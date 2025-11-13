// api/app.js
export const config = { runtime: 'nodejs' };

// 依赖：api/_lib/http.js, api/_lib/blob.js
import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  deleteByUrl,
  list as _listRaw,
} from './_lib/blob.js';
import { DEFAULT_SYLLABUS } from '../data/syllabus.js';

const ENABLE_CORS = false;

/* ---------- 基础响应工具 ---------- */
function ok(data, status = 200) { return jsonOK(data, status); }
function err(message = 'BAD_REQUEST', status = 400) { return badRequest(message, status); }
function withHeaders(init = {}) {
  const h = new Headers(init.headers || {});
  if (ENABLE_CORS) {
    h.set('access-control-allow-origin', '*');
    h.set('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
    h.set('access-control-allow-headers', 'content-type,authorization,cookie');
  }
  return { ...init, headers: h };
}

/* ---------- Header / URL 兼容 ---------- */
function getHeader(req, name) {
  const h = req.headers || {};
  const key = String(name).toLowerCase();
  if (typeof h.get === 'function') return h.get(name); // WHATWG Request
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

/* ---------- 读取请求体（Edge/Web/Node 通用） ---------- */
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

/* ---------- Blob 工具 ---------- */
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
  try {
    return await readJSONViaFetch(path, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 });
  } catch { return []; }
}

async function upsertIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch {}
  if (!Array.isArray(arr)) arr = [];
  arr = [key, ...arr.filter(x => x !== key)];
  try { await writeJSON(INDEX, arr, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch (e) {
    console.warn('[INDEX] upsertIndex fast-path failed, continuing:', e?.message || e);
  }
}

// analyses 富索引：保存对象
async function upsertAnalysesIndex(prefix, meta) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch {}
  if (!Array.isArray(arr)) arr = [];
  // 统一为对象形态
  arr = arr
    .map(x => (typeof x === 'string') ? { slug: x } : (x && typeof x === 'object') ? x : null)
    .filter(Boolean);
  // 去重
  arr = arr.filter(x => x.slug !== meta.slug);
  // 最新靠前
  arr.unshift(meta);
  try { await writeJSON(INDEX, arr, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch (e) {
    console.warn('[INDEX] upsertAnalysesIndex failed, continuing:', e?.message || e);
  }
}

// ✅ 修复点：既能删字符串项，也能删对象项（按 slug/id 匹配）
async function removeFromIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch {}
  if (!Array.isArray(arr)) arr = [];
  const K = String(key);
  arr = arr.filter(x => {
    if (typeof x === 'string') return x !== K;
    if (x && typeof x === 'object') {
      const s = String(x.slug ?? x.id ?? '');
      return s !== K;
    }
    return true;
  });
  try { await writeJSON(INDEX, arr, { timeoutMs: 2000, retries: 1, retryDelayMs: 200 }); } catch (e) {
    console.warn('[INDEX] removeFromIndex failed, continuing:', e?.message || e);
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
    if (cookie && /(?:^|;\s*)tran_admin=ok(?:;|$)/.test(cookie)) return null;
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
    // 你的前端没设置 cookie，这里返回一次性 token 供前端存储
    return ok({ ok: true, token: 'ok' });
  }

  if (sub === '/verify' && req.method === 'GET') {
    // 前端到得了这里就视为已登录
    return ok({ authed: true });
  }

  if (sub === '/logout' && req.method === 'POST') {
    return ok({ ok: true });
  }

  return err('ADMIN_NO_ROUTE', 404);
}

/* ---------- 通用 CRUD ---------- */
async function genericHandler(req, pathname, PREFIX) {
  try {
    const p = normPath(pathname);
    console.log(`[API] ${req.method} ${pathname} (PREFIX: ${PREFIX})`);

    // 列表 / 索引
    if ([`/api/${PREFIX}`, `/api/${PREFIX}/index`, `/api/${PREFIX}/index.json`].includes(p)) {
      // research/articles：以 Blob 列表为准，清洗 slug
      if (PREFIX === 'research/articles') {
        const blobs = await listByPrefix(`${PREFIX}/`);
        const items = (blobs || [])
          .filter(b => b.pathname && b.pathname.endsWith('.json'))
          .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
          .map(s => s.replace(/\/+/, '/'))
          .map(s => s.replace(/\//g, '-'))
          .map(s => s.replace(/_+$/,''))
          .filter((s, i, arr) => s && s !== 'index' && arr.indexOf(s) === i)
          .sort((a,b)=> (a > b ? -1 : 1));
        return ok(items);
      }

      // 其它前缀：优先用 index.json，但只返回“有实际 blob 文件存在”的项
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

    // 单项
    const m = p.match(new RegExp(`^/api/${PREFIX}/([^/]+?)(?:\\.json)?$`));
    if (!m) return err(`${PREFIX.toUpperCase()}_NO_ROUTE`, 404);
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;

    // 读
    if (req.method === 'GET') {
      if (PREFIX === 'research/articles'){
        const dateToNested = (s)=>{
          const m = String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})_?$/);
          return m ? `${m[1]}/${m[2]}/${m[3]}` : null;
        };
        const nestedToDash = (s)=> s && s.replace(/\//g,'-');
        const dash = slug.replace(/[\\\/]+/g,'-').replace(/_+$/,'');
        const nested = dateToNested(dash) || dateToNested(slug) || null;
        const candidates = Array.from(new Set([
          slug, dash, slug.replace(/_+$/,''), nested || '', nested ? nestedToDash(nested) : ''
        ].filter(Boolean)));
        for (const s of candidates){
          try { return ok(await readJSONViaFetch(`${PREFIX}/${s}.json`)); } catch {}
        }
        return err('NOT_FOUND', 404);
      }
      const __candidates = Array.from(new Set([
        slug,
        (function(){ try { return decodeURIComponent(slug); } catch { return slug; } })(),
        (function(){ try { const once = decodeURIComponent(slug); return decodeURIComponent(once); } catch { return slug; } })()
      ].filter(Boolean)));
      for (const s of __candidates){
        try { return ok(await readJSONViaFetch(`${PREFIX}/${s}.json`)); } catch {}
      }
      return err('NOT_FOUND', 404);
    }

    // 写（新增/覆盖）
    if (['PUT','POST'].includes(req.method)) {
      console.log(`[API] Writing to ${PREFIX}/${slug}.json`);
      const unauthorized = requireAuthIfConfigured(req);
      if (unauthorized) return unauthorized;

      const body = await readBody(req);
      console.log(`[API] Body received:`, body);

      try {
        await writeJSON(FILE, body);
        try {
          if (PREFIX === 'analyses'){
            const meta = {
              slug,
              title: body?.title || slug,
              symbol: body?.symbol || body?.chart?.symbol || '',
              tf: body?.tf || '',
              date: body?.date || '',
              tags: Array.isArray(body?.tags) ? body.tags : [],
              bias: body?.bias || ''
            };
            await upsertAnalysesIndex(PREFIX, meta);
          } else {
            await upsertIndex(PREFIX, slug);
          }
        } catch (e) { console.warn('[API] index update error', e?.message || e); }
        console.log(`[API] Write successful`);
        return ok({ saved: true, slug });
      } catch (e) {
        console.error(`[API] Write failed:`, e);
        return err((e && e.message) ? e.message : 'WRITE_FAILED', 500);
      }
    }

    // 删
    if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req);
      if (unauthorized) return unauthorized;

      if (PREFIX === 'research/articles'){
        const dateToNested = (s)=>{
          const m = String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})_?$/);
          return m ? `${m[1]}/${m[2]}/${m[3]}` : null;
        };
        const dash = slug.replace(/[\\\/]+/g,'-').replace(/_+$/,'');
        const nested = dateToNested(dash) || dateToNested(slug) || null;
        const variants = Array.from(new Set([ slug, dash, slug.replace(/_+$/,''), nested || '' ].filter(Boolean)));
        let any = false;
        for (const s of variants){
          const path = `${PREFIX}/${s}.json`;
          try { await deleteObject(path); any = true; } catch {}
          try { await ensureDeleted(PREFIX, s); } catch {}
          try { await removeFromIndex(PREFIX, s); } catch {}
        }
        return ok({ deleted: any, slug });
      }

      try { await deleteObject(FILE); } catch (e) {
        console.error(`[API] Delete failed for ${FILE}:`, e);
        return err((e && e.message) ? e.message : 'DELETE_FAILED', 500);
      }
      try {
        const okGone = await ensureDeleted(PREFIX, slug);
        if (!okGone) { console.warn(`[API] Delete verify failed for ${FILE}`); return err('DELETE_VERIFY_FAILED', 500); }
      } catch (e) { console.warn(`[API] ensureDeleted error for ${FILE}:`, e?.message || e); }
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

/* ---------- Research 只读 ---------- */
async function handleResearch(req, pathname) {
  const p = normPath(pathname);
  if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);

  if (/^\/api\/research\/syllabus(?:\.json)?$/.test(p)) {
    try {
      const data = await readJSONViaFetch('research/syllabus.json');
      if (Array.isArray(data?.syllabus) && data.syllabus.length) return ok(data);
    } catch (_) {}
    try {
      await writeJSON('research/syllabus.json', { syllabus: DEFAULT_SYLLABUS, updatedAt: new Date().toISOString() });
    } catch (seedErr) { console.warn('[syllabus seed] unable to persist default syllabus:', seedErr?.message || seedErr); }
    return ok({ syllabus: DEFAULT_SYLLABUS });
  }
  if (/^\/api\/research\/articles(?:\.json)?$/.test(p)) {
    try { return ok(await readJSONViaFetch('research/articles/index.json')); }
    catch { return err('NOT_FOUND', 404); }
  }
  return err('RESEARCH_NO_ROUTE', 404);
}

async function handleResearchSyllabusWrite(req) {
  if (!['PUT','POST','DELETE'].includes(req.method)) return err('METHOD_NOT_ALLOWED', 405);
  const unauthorized = requireAuthIfConfigured(req);
  if (unauthorized) return unauthorized;

  try {
    let syllabus = [];
    if (req.method === 'DELETE') syllabus = [];
    else {
      const body = await readBody(req);
      const raw = Array.isArray(body?.syllabus) ? body.syllabus : Array.isArray(body) ? body : null;
      if (!Array.isArray(raw)) return err('INVALID_SYLLABUS_ARRAY', 400);
      syllabus = raw;
    }
    await writeJSON('research/syllabus.json', { syllabus, updatedAt: new Date().toISOString() });
    return ok({ saved: true, count: syllabus.length });
  } catch (e) {
    console.error('[syllabus write] error:', e);
    return err('SYLLABUS_WRITE_FAILED', 500);
  }
}

/* ---------- og:image 提取（文章配图） ---------- */
async function handleOgImage(urlObj) {
  const target = urlObj.searchParams.get('url') || '';
  if (!target) return err('MISSING_URL', 400);
  try {
    const r = await fetch(target, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; TTL-Bot/1.0)' } });
    const html = await r.text();

    // 简单提取 og/twitter image
    const pick = (re) => {
      const m = html.match(re);
      return m && m[1] ? m[1] : '';
    };
    const og = pick(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
               pick(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    const tw = pick(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
               pick(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*>/i);
    const linkImg = pick(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["'][^>]*>/i);

    const image = og || tw || linkImg || '';
    return ok({ image: image || null });
  } catch (e) {
    console.warn('[og-image] parse fail:', e?.message || e);
    return ok({ image: null });
  }
}

/* ---------- 将 Web Response 写回 Node res ---------- */
async function sendNodeResponse(res, out) {
  if (out && typeof out === 'object' && typeof out.text === 'function' && out.headers) {
    const status = out.status || 200;
    const headersObj = {};
    try { for (const [k, v] of out.headers.entries()) headersObj[k] = v; } catch {}
    const bodyText = await out.text();
    res.writeHead(status, headersObj);
    res.end(bodyText);
    return;
  }
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify(out ?? {}));
}

/* ---------- 主入口（Node 形态） ---------- */
export default async function handler(req, res) {
  try {
    const url = getURL(req);
    const pathname = normPath(url.pathname || '/');

    if (req.method === 'OPTIONS') return sendNodeResponse(res, new Response(null, withHeaders({ status: 204 })));
    if (req.method === 'HEAD')    return sendNodeResponse(res, new Response(null, withHeaders({ status: 200 })));

    // 健康检查
    if (req.method === 'GET' && pathname === '/api/ping') {
      return sendNodeResponse(res, ok({
        ok: true, ts: Date.now(), runtime: 'node', env: process.env.VERCEL_ENV || 'local',
      }));
    }

    let out;
    console.log(`[API] Request received: ${req.method} ${pathname}`);

    if (pathname.startsWith('/api/admin')) {
      out = await handleAdmin(req, pathname);
    }
    else if (pathname.startsWith('/api/daily-brief')) {
      out = await genericHandler(req, pathname, 'daily-brief');
    }
    else if (pathname.startsWith('/api/analyses')) {
      out = await genericHandler(req, pathname, 'analyses');
    }
    else if ((req.method === 'POST') && (pathname === '/api/market-news' || pathname === '/api/market-news/index' || pathname === '/api/market-news/index.json')) {
      // Admin 发布 Market News（带鉴权）
      const unauthorized = requireAuthIfConfigured(req);
      if (unauthorized) out = unauthorized;
      else {
        const body = await readBody(req);
        const id = body?.id || body?.slug;
        if (!id) out = err('MISSING_ID', 400);
        else {
          try { await writeJSON(`market-news/${id}.json`, body); }
          catch (e) { console.error('[API] market-news write failed:', e); out = err('WRITE_FAILED', 500); }
          if (!out) {
            try { await upsertIndex('market-news', id); } catch (e) { console.warn('[API] upsertIndex error', e?.message || e); }
            out = ok({ saved: true, id });
          }
        }
      }
    }
    else if (pathname.startsWith('/api/market-news')) {
      out = await genericHandler(req, pathname, 'market-news');
    }
    else if (pathname.startsWith('/api/research/syllabus')) {
      if (req.method === 'GET') out = await handleResearch(req, pathname);
      else out = await handleResearchSyllabusWrite(req);
    }
    else if (pathname.startsWith('/api/research/articles/')) {
      out = await genericHandler(req, pathname, 'research/articles');
    }
    else if (pathname === '/api/research/articles' || pathname === '/api/research/articles.json')) {
      out = await handleResearch(req, pathname);
    }
    else if (pathname.startsWith('/api/research')) {
      out = await handleResearch(req, pathname);
    }
    else if (pathname === '/api/og-image' && req.method === 'GET') {
      out = await handleOgImage(getURL(req));
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
