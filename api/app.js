// api/app.js
export const config = { runtime: 'nodejs' };

// —— 依赖：api/_lib/http.js, api/_lib/blob.js
import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  list as _listRaw,
} from './_lib/blob.js';

const ENABLE_CORS = false;

/* ---------- 基础响应工具：仍返回 Web Response ---------- */
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

/* ---------- Header 与 URL 兼容 ---------- */
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

/* ---------- 读取请求体：Edge/Web/Node 皆可 ---------- */
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
  try { return await readJSONViaFetch(path); } catch { return []; }
}

async function upsertIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX); } catch {}
  arr = [key, ...arr.filter(x => x !== key)];
  await writeJSON(INDEX, arr);
}

async function removeFromIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX); } catch {}
  arr = arr.filter(x => x !== key);
  await writeJSON(INDEX, arr);
}

function requireAuthIfConfigured(req) {
  if (!process.env.ADMIN_PASSWORD) return null;
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
    // 你的前端并未真正设置 cookie，这里按“只验证一次”的轻模式
    return ok({ ok: true, token: 'ok' });
  }

  if (sub === '/verify' && req.method === 'GET') {
    // 轻模式：只要能到达这里，就认为已登录
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
    
    // 日志记录
    console.log(`[API] ${req.method} ${pathname} (PREFIX: ${PREFIX})`);
    
    // 列表 / 索引
    if ([`/api/${PREFIX}`, `/api/${PREFIX}/index`, `/api/${PREFIX}/index.json`].includes(p)) {
      const idx = await readIndexJson(`${PREFIX}/index.json`);
      if (Array.isArray(idx) && idx.length) return ok(idx);
      const blobs = await listByPrefix(`${PREFIX}/`);
      const items = blobs
        .filter(b => b.pathname.endsWith('.json'))
        .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
        .sort((a,b)=> (a > b ? -1 : 1));
      return ok(items);
    }
  
    // 单项
    const m = p.match(new RegExp(`^/api/${PREFIX}/([^/]+?)(?:\\.json)?$`));
    if (!m) return err(`${PREFIX.toUpperCase()}_NO_ROUTE`, 404);
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;
  
    // 读
    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
  
    // 写操作增强日志
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
        return err('WRITE_FAILED', 500);
      }
    }
  
    // 删
    if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, slug);
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
    try { return ok(await readJSONViaFetch('research/syllabus.json')); }
    catch { return err('NOT_FOUND', 404); }
  }
  if (/^\/api\/research\/articles(?:\.json)?$/.test(p)) {
    try { return ok(await readJSONViaFetch('research/articles/index.json')); }
    catch { return err('NOT_FOUND', 404); }
  }
  return err('RESEARCH_NO_ROUTE', 404);
}

/* ---------- 把 Web Response 写回到 Node res ---------- */
async function sendNodeResponse(res, out) {
  // out 是一个 Web Response（jsonOK/badRequest 返回的）
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
  // 容错：非 Response，按 JSON 输出
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify(out ?? {}));
}

/* ---------- 主路由入口（Node 风格） ---------- */
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

    // 健康检查
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
    
    // 增强路由分发日志
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
      out = await handleResearch(req, pathname);
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