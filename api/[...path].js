// api/[...path].js —— 单入口总路由（Vercel Hobby 避开 12 函数限制）
// 依赖：api/_lib/http.js, api/_lib/blob.js
// 环境变量（可选）：ADMIN_PASSWORD（后台登录口令）

import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  list as _listRaw
} from './_lib/blob.js';

/* ====================== 公共小工具 ====================== */
const ENABLE_CORS = false; // 同域不需要；若你要跨域调用，改成 true

function withHeaders(init = {}) {
  const h = new Headers(init.headers || {});
  if (ENABLE_CORS) {
    h.set('access-control-allow-origin', '*');
    h.set('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
    h.set('access-control-allow-headers', 'content-type,authorization,cookie');
  }
  return { ...init, headers: h };
}

function ok(data, status = 200) {
  return jsonOK(data, status);
}
function err(message = 'BAD_REQUEST', status = 400) {
  return badRequest(message, status);
}

async function readBody(req) {
  try {
    const ct = (req.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/json')) return await req.json();
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

async function listByPrefix(prefix) {
  if (typeof _listByPrefix === 'function') return await _listByPrefix(prefix);
  const it = await _listRaw({ prefix });
  return it?.blobs ?? [];
}

function pickTail(pathname) {
  // 取最后一段，不带 .json
  const seg = pathname.split('/').filter(Boolean).pop() || '';
  return seg.endsWith('.json') ? seg.slice(0, -5) : seg;
}

function normPath(pathname) {
  // 去掉多余尾斜杠（根路径除外）
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

async function readIndexJson(path) {
  try { return await readJSONViaFetch(path); }
  catch { return []; }
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

// 只有当你设置了 ADMIN_PASSWORD 时才执行鉴权；否则放行（避免开发/演示期阻断）
function requireAuthIfConfigured(req) {
  if (!process.env.ADMIN_PASSWORD) return null;
  return _requireAuth(req);
}

/* ====================== Admin ====================== */
// /api/admin/login  POST {password}
// /api/admin/verify GET
// /api/admin/logout POST
async function handleAdmin(req, pathname) {
  const sub = pathname.replace('/api/admin', '') || '';

  if (sub === '/login' && req.method === 'POST') {
    const body = await readBody(req);
    const pass = body?.password || body?.pwd || '';
    if (!process.env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD_NOT_SET', 500);
    if (pass !== process.env.ADMIN_PASSWORD) return err('INVALID_PASSWORD', 401);

    const token = 'ok'; // TODO: 可替换为签名 token
    return new Response(JSON.stringify({ ok: true }), withHeaders({
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `admintoken=${token}; Path=/; HttpOnly; Max-Age=${7 * 86400}; SameSite=Lax`
      }
    }));
  }

  if (sub === '/verify' && req.method === 'GET') {
    const cookie = req.headers.get('cookie') || '';
    const authed = /(^|;\s*)admintoken=/.test(cookie);
    return ok({ authed });
  }

  if (sub === '/logout' && req.method === 'POST') {
    return new Response(JSON.stringify({ ok: true }), withHeaders({
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `admintoken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
      }
    }));
  }

  return err('ADMIN_NO_ROUTE', 404);
}

/* ====================== Daily Brief ====================== */
// 列表：/api/daily-brief  /api/daily-brief/index  /api/daily-brief/index.json
// 项目：/api/daily-brief/:slug  或  :slug.json
async function handleDailyBrief(req, pathname) {
  const PREFIX = 'daily-brief';
  const p = normPath(pathname);

  // 列表
  if (
    (p === '/api/daily-brief') ||
    (p === '/api/daily-brief/index') ||
    (p === '/api/daily-brief/index.json')
  ) {
    if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  // 单条（兼容 .json 与不带 .json）
  const m = p.match(/^\/api\/daily-brief\/([^/]+?)(?:\.json)?$/);
  if (m) {
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;

    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, slug);
      return ok({ saved: true, slug });
    }

    if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, slug);
      return ok({ deleted: true, slug });
    }

    return err('METHOD_NOT_ALLOWED', 405);
  }

  return err('DAILY_NO_ROUTE', 404);
}

/* ====================== Analyses ====================== */
// 列表：/api/analyses /index /index.json
// 单条：/api/analyses/:id(.json)
async function handleAnalyses(req, pathname) {
  const PREFIX = 'analyses';
  const p = normPath(pathname);

  if (
    (p === '/api/analyses') ||
    (p === '/api/analyses/index') ||
    (p === '/api/analyses/index.json')
  ) {
    if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  const m = p.match(/^\/api\/analyses\/([^/]+?)(?:\.json)?$/);
  if (m) {
    const id = m[1];
    const FILE = `${PREFIX}/${id}.json`;

    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, id);
      return ok({ saved: true, id });
    }
    if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, id);
      return ok({ deleted: true, id });
    }
    return err('METHOD_NOT_ALLOWED', 405);
  }

  return err('ANALYSES_NO_ROUTE', 404);
}

/* ====================== Market News ====================== */
// 列表：/api/market-news /index /index.json
// 单条：/api/market-news/:slug(.json)
async function handleMarketNews(req, pathname) {
  const PREFIX = 'market-news';
  const p = normPath(pathname);

  if (
    (p === '/api/market-news') ||
    (p === '/api/market-news/index') ||
    (p === '/api/market-news/index.json')
  ) {
    if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  const m = p.match(/^\/api\/market-news\/([^/]+?)(?:\.json)?$/);
  if (m) {
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;

    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, slug);
      return ok({ saved: true, slug });
    }
    if (req.method === 'DELETE') {
      const unauthorized = requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, slug);
      return ok({ deleted: true, slug });
    }
    return err('METHOD_NOT_ALLOWED', 405);
  }

  return err('NEWS_NO_ROUTE', 404);
}

/* ====================== Research ====================== */
// GET /api/research/syllabus(.json)
// GET /api/research/articles(.json)
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

/* ====================== 总路由入口 ====================== */
export default async function handler(req) {
  const url = new URL(req.url);
  const pathname = normPath(url.pathname);

  // 处理预检与 HEAD
  if (req.method === 'OPTIONS') {
    return new Response(null, withHeaders({ status: 204 }));
  }
  if (req.method === 'HEAD') {
    return new Response(null, withHeaders({ status: 200 }));
  }

  try {
    if (pathname.startsWith('/api/admin'))       return await handleAdmin(req, pathname);
    if (pathname.startsWith('/api/daily-brief')) return await handleDailyBrief(req, pathname);
    if (pathname.startsWith('/api/analyses'))    return await handleAnalyses(req, pathname);
    if (pathname.startsWith('/api/market-news')) return await handleMarketNews(req, pathname);
    if (pathname.startsWith('/api/research'))    return await handleResearch(req, pathname);

    return err('NO_ROUTE', 404);
  } catch (e) {
    console.error('API_ERROR:', e);
    return err('INTERNAL_ERROR', 500);
  }
}
