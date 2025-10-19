// api/app.js
export const config = { runtime: 'nodejs' };

// 鈥斺€?渚濊禆锛歛pi/_lib/http.js, api/_lib/blob.js
import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  deleteByUrl,
  list as _listRaw,
} from './_lib/blob.js';

const ENABLE_CORS = false;

/* ---------- 鍩虹鍝嶅簲宸ュ叿锛氫粛杩斿洖 Web Response ---------- */
function ok(data, status = 200) {
  return jsonOK(data, status);
}
function err(message = 'BAD_REQUEST', status = 400) {
  return badRequest(message, status);
}
function withHeaders(init = {}) {
  const h = new Headers(init.headers || {});
  if (ENABLE_CORS) {
    h.set('access-control-allow-origin', '*');
    h.set('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
    h.set('access-control-allow-headers', 'content-type,authorization,cookie');
  }
  return { ...init, headers: h };
}

/* ---------- Header 涓?URL 鍏煎 ---------- */
function getHeader(req, name) {
  const h = req.headers || {};
  const key = String(name).toLowerCase();
  if (typeof h.get === 'function') return h.get(name); // Web Request
  return h[key] || h[name] || null;                    // Node IncomingMessage
}

function getURL(req) {
  try {
    if (req.url && String(req.url).startsWith('http')) return new URL(req.url);
    const proto = getHeader(req, 'x-forwarded-proto') || 'https';
    const host  = getHeader(req, 'x-forwarded-host') || getHeader(req, 'host') || 'localhost';
    const path  = req.url || '/';
    return new URL(`${proto}://${host}${path.startsWith('/') ? '' : '/'}${path}`);
  } catch {
    return new URL('https://localhost/api/ping');
  }
}

/* ---------- 璇诲彇璇锋眰浣擄細Edge/Web/Node 鐨嗗彲 ---------- */
async function readBody(req) {
  try {
    const ct = (getHeader(req, 'content-type') || '').toLowerCase();

    // Edge/Web
    if (typeof req.json === 'function' && ct.includes('application/json')) {
      return await req.json();
    }
    if (typeof req.text === 'function') {
      const text = await req.text();
      return text ? JSON.parse(text) : {};
    }

    // Node Stream
    let data = '';
    if (req.readable) {
      for await (const chunk of req) data += chunk;
      return data ? JSON.parse(data) : {};
    }

    return {};
  } catch {
    return {};
  }
}

/* ---------- Blob 宸ュ叿 ---------- */
async function listByPrefix(prefix) {
  try {
    if (typeof _listByPrefix === 'function') return await _listByPrefix(prefix);
    const it = await _listRaw({ prefix });
    return it?.blobs ?? [];
  } catch {
    return [];
  }
}

function normPath(path) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

async function readIndexJson(path) {
  try { return await readJSONViaFetch(path, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch { return []; }
}

async function upsertIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch {}
  arr = [key, ...arr.filter(x => x !== key)];
  try { await writeJSON(INDEX, arr, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch (e) {
    console.warn('[INDEX] upsertIndex fast-path failed, continuing:', e?.message || e);
  }
}

async function removeFromIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch {}
  arr = arr.filter(x => x !== key);
  try { await writeJSON(INDEX, arr, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch (e) {
    console.warn('[INDEX] removeFromIndex fast-path failed, continuing:', e?.message || e);
  }
}


async function ensureDeleted(prefix, slug) {
  const FILE = `${prefix}/${slug}.json`;
  for (let i = 0; i < 3; i++) {
    const blobs = await listByPrefix(`${prefix}/`);
    const hit = (blobs||[]).find(b => b.pathname === FILE);
    if (!hit) return true;
    try { await deleteObject(FILE, { timeoutMs: 3000, retries: 1, retryDelayMs: 200 }); } catch {}
    try { if (hit.url) await deleteByUrl(hit.url, { timeoutMs: 3000, retries: 1, retryDelayMs: 200 }); } catch {}
    await new Promise(r => setTimeout(r, 400));
  }
  const after = await listByPrefix(`${prefix}/`);
  const still = (after||[]).some(b => b.pathname === FILE);
  return !still;
}

function requireAuthIfConfigured(req) {
  if (!process.env.ADMIN_PASSWORD) return null;
  try {
    const cookie = getHeader(req, 'cookie') || '';
    if (cookie && /(?:^|;\s*)tran_admin=ok(?:;|$)/.test(cookie)) {
      return null; // cookie 会话已登录
    }
  } catch {}
  return _requireAuth(req);
}

/* ---------- Admin ---------- */
async function handleAdmin(req, pathname) {
  const sub = pathname.replace('/api/admin', '') || '';

  if (sub === '/login' && req.method === 'POST') {
    const body = await readBody(req);
    const pass = body?.password || body?.pwd || '';
    if (!process.env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD_NOT_SET', 500);
    if (pass !== process.env.ADMIN_PASSWORD) return err('INVALID_PASSWORD', 401);
    // 浣犵殑鍓嶇骞舵湭鐪熸璁剧疆 cookie锛岃繖閲屾寜鈥滃彧楠岃瘉涓€娆♀€濈殑杞绘ā寮?
    return ok({ ok: true, token: 'ok' });
  }

  if (sub === '/verify' && req.method === 'GET') {
    // 杞绘ā寮忥細鍙鑳藉埌杈捐繖閲岋紝灏辫涓哄凡鐧诲綍
    return ok({ authed: true });
  }

  if (sub === '/logout' && req.method === 'POST') {
    return ok({ ok: true });
  }

  return err('ADMIN_NO_ROUTE', 404);
}

/* ---------- 閫氱敤 CRUD ---------- */
async function genericHandler(req, pathname, PREFIX) {
  try {
    const p = normPath(pathname);
    
    // 鏃ュ織璁板綍
    console.log(`[API] ${req.method} ${pathname} (PREFIX: ${PREFIX})`);
    
    // 鍒楄〃 / 绱㈠紩
    if ([`/api/${PREFIX}`, `/api/${PREFIX}/index`, `/api/${PREFIX}/index.json`].includes(p)) {
      const idx = await readIndexJson(`${PREFIX}/index.json`);
      const blobs = await listByPrefix(`${PREFIX}/`);
      const blobNames = new Set(
        (blobs || [])
          .filter(b => b.pathname && b.pathname.endsWith('.json'))
          .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
          .filter(s => s && s !== 'index')
      );

      if (Array.isArray(idx) && idx.length) {
        const normalized = idx
          .map(x => (typeof x === 'string') ? x : (x && x.slug) ? x.slug : '')
          .filter(Boolean);
        const filtered = normalized.filter(s => blobNames.has(s));
        const missing = Array.from(blobNames).filter(s => !normalized.includes(s));
        const items = filtered.concat(missing).filter(s => s && s !== 'index').sort((a,b)=> (a > b ? -1 : 1));
        return ok(items);
      }

      const items = Array.from(blobNames).sort((a,b)=> (a > b ? -1 : 1));
      return ok(items);
    }
  
    // 鍗曢」
    const m = p.match(new RegExp(`^/api/${PREFIX}/([^/]+?)(?:\\.json)?$`));
    if (!m) return err(`${PREFIX.toUpperCase()}_NO_ROUTE`, 404);
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;
  
    // 璇?
    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
  
    // 鍐欐搷浣滃寮烘棩蹇?
    if (['PUT','POST'].includes(req.method)) {
      console.log(`[API] Writing to ${PREFIX}/${slug}.json`);
      const unauthorized = requireAuthIfConfigured(req); 
      if (unauthorized) {
        console.warn(`[API] Unauthorized access attempt`);
        return unauthorized;
      }
      
      const body = await readBody(req);
      console.log(`[API] Body received:`, body);
      
      try {
        await writeJSON(FILE, body);
        await upsertIndex(PREFIX, slug);
        console.log(`[API] Write successful`);
        return ok({ saved: true, slug });
      } catch (e) {
        console.error(`[API] Write failed:`, e);
        return err((e && e.message) ? e.message : 'WRITE_FAILED', 500);
      }
    }
  
    // 鍒?
        if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      try {
        await deleteObject(FILE);
      } catch (e) {
        console.error(`[API] Delete failed for ${FILE}:`, e);
        const msg = (e && e.message) ? e.message : 'DELETE_FAILED';
        return err(msg, 500);
      }
      try {
        const okGone = await ensureDeleted(PREFIX, slug);
        if (!okGone) {
          console.warn(`[API] Delete verify failed for ${FILE}`);
          return err('DELETE_VERIFY_FAILED', 500);
        }
      } catch (e) {
        console.warn(`[API] ensureDeleted error for ${FILE}:`, e?.message || e);
      }
      try { await removeFromIndex(PREFIX, slug); } catch (e) {
        console.warn(`[API] removeFromIndex failed for ${PREFIX}/${slug}:`, e?.message || e);
      }
      return ok({ deleted: true, slug });
    }
  
    return err('METHOD_NOT_ALLOWED', 405);
  } catch (e) {
    console.error(`[API] Error in genericHandler:`, e);
    return err('INTERNAL_ERROR', 500);
  }
}

/* ---------- Research 鍙 ---------- */
async function handleResearch(req, pathname) {
  const p = normPath(pathname);
  if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);

  if (/^\/api\/research\/syllabus(?:\.json)?$/.test(p)) {
    try { return ok(await readJSONViaFetch('research/syllabus.json')); }
    catch { return err('NOT_FOUND', 404); }
  }
  if (/^\/api\/research\/articles(?:\.json)?$/.test(p)) {
    try { return ok(await readJSONViaFetch('research/articles/index.json')); }
    catch { return err('NOT_FOUND', 404); }
  }
  return err('RESEARCH_NO_ROUTE', 404);
}

/* ---------- 鎶?Web Response 鍐欏洖鍒?Node res ---------- */
async function sendNodeResponse(res, out) {
  // out 鏄竴涓?Web Response锛坖sonOK/badRequest 杩斿洖鐨勶級
  if (out && typeof out === 'object' && typeof out.text === 'function' && out.headers) {
    const status = out.status || 200;
    const headersObj = {};
    try {
      for (const [k, v] of out.headers.entries()) headersObj[k] = v;
    } catch (_) {}
    const bodyText = await out.text();
    res.writeHead(status, headersObj);
    res.end(bodyText);
    return;
  }
  // 瀹归敊锛氶潪 Response锛屾寜 JSON 杈撳嚭
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify(out ?? {}));
}

/* ---------- 涓昏矾鐢卞叆鍙ｏ紙Node 椋庢牸锛?---------- */
export default async function handler(req, res) {
  try {
    const url = getURL(req);
    const pathname = normPath(url.pathname || '/');

    if (req.method === 'OPTIONS') {
      const r = new Response(null, withHeaders({ status: 204 }));
      return sendNodeResponse(res, r);
    }
    if (req.method === 'HEAD') {
      const r = new Response(null, withHeaders({ status: 200 }));
      return sendNodeResponse(res, r);
    }

    // 鍋ュ悍妫€鏌?
    if (req.method === 'GET' && pathname === '/api/ping') {
      const r = ok({
        ok: true,
        ts: Date.now(),
        runtime: 'node',
        env: process.env.VERCEL_ENV || 'local',
      });
      return sendNodeResponse(res, r);
    }

    let out;
    console.log(`[API] Request received: ${req.method} ${pathname}`);
    
    // 澧炲己璺敱鍒嗗彂鏃ュ織
    if (pathname.startsWith('/api/admin')) {
      console.log(`[API] Handling admin route: ${pathname}`);
      out = await handleAdmin(req, pathname);
    }
    else if (pathname.startsWith('/api/daily-brief')) {
      console.log(`[API] Handling daily-brief route: ${pathname}`);
      out = await genericHandler(req, pathname, 'daily-brief');
    }
    else if (pathname.startsWith('/api/analyses')) {
      out = await genericHandler(req, pathname, 'analyses');
    }
    else if (pathname.startsWith('/api/market-news')) {
      out = await genericHandler(req, pathname, 'market-news');
    }
    else if (pathname.startsWith('/api/research')) {
      if (req.method === 'GET') {
        out = await handleResearch(req, pathname);
      } else if (pathname.startsWith('/api/research/syllabus')) {
        out = await genericHandler(req, pathname, 'research');
      } else if (pathname.startsWith('/api/research/articles')) {
        out = await genericHandler(req, pathname, 'research/articles');
      } else {
        out = err('RESEARCH_NO_ROUTE', 404);
      }
    }
    else {
      out = err('NO_ROUTE', 404);
    }

    console.log(`[API] Response status: ${out?.status || 200}`);
    return sendNodeResponse(res, out);
  } catch (e) {
    console.error('[API] Critical error:', e);
    return sendNodeResponse(res, err('INTERNAL_ERROR', 500));
  }
}









