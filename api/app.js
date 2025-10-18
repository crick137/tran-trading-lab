// api/app.js —— 单入口总路由（稳定版）
// 依赖：api/_lib/http.js, api/_lib/blob.js
// 可选环境变量：ADMIN_PASSWORD

import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  list as _listRaw
} from './_lib/blob.js';

const ENABLE_CORS = false;

/* ---------- 工具 ---------- */
// 使用“普通对象”来返回响应头，避免在 Node 运行时 new Headers 报错
function withHeaders(init = {}) {
  const h0 = init.headers || {};
  let h = {};
  if (h0 && typeof h0.forEach === 'function') {
    // 兼容 Headers/Map
    h0.forEach((v, k) => { h[String(k).toLowerCase()] = v; });
  } else {
    for (const k in h0) h[String(k).toLowerCase()] = h0[k];
  }
  if (ENABLE_CORS) {
    h['access-control-allow-origin']  = '*';
    h['access-control-allow-methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    h['access-control-allow-headers'] = 'content-type,authorization,cookie';
  }
  return { ...init, headers: h };
}
function ok(data, status = 200) { return jsonOK(data, status); }
function err(message = 'BAD_REQUEST', status = 400) { return badRequest(message, status); }

// ---- 兼容 Node IncomingMessage.headers 与 Web Headers ----
function getHeader(req, name) {
  const h = req.headers || {};
  if (h && typeof h.get === 'function') return h.get(name);
  const key = String(name).toLowerCase();
  return h[key] || h[name] || null;
}

// 关键修复：Vercel 中 req.url 可能是相对路径，需补 base
function getURL(req) {
  const proto = getHeader(req, 'x-forwarded-proto') || 'https';
  const host  = getHeader(req, 'x-forwarded-host') || getHeader(req, 'host') || 'localhost';
  const raw   = req.url || '/';
  const abs   = /^https?:\/\//i.test(raw)
    ? raw
    : `${proto}://${host}${raw.startsWith('/') ? '' : '/'}${raw}`;
  return new URL(abs);
}

async function readBody(req) {
  try {
    const ct = (getHeader(req, 'content-type') || '').toLowerCase();
    if (ct.includes('application/json')) return await req.json();
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    // 解析失败也返回空对象，避免阻塞
    return {};
  }
}

async function listByPrefix(prefix) {
  if (typeof _listByPrefix === 'function') return await _listByPrefix(prefix);
  const it = await _listRaw({ prefix });
  return it?.blobs ?? [];
}

function normPath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

async function readIndexJson(path) { try { return await readJSONViaFetch(path); } catch { return []; } }

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

/* -------- Admin -------- */
async function handleAdmin(req, pathname) {
  const sub = pathname.replace('/api/admin', '') || '';

  if (sub === '/login' && req.method === 'POST') {
    const body = await readBody(req);
    const pass = body?.password || body?.pwd || '';
    if (!process.env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD_NOT_SET', 500);
    if (pass !== process.env.ADMIN_PASSWORD) return err('INVALID_PASSWORD', 401);

    const token = 'ok';
    return new Response(JSON.stringify({ ok: true }), withHeaders({
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `admintoken=${token}; Path=/; HttpOnly; Max-Age=${7 * 86400}; SameSite=Lax`
      }
    }));
  }

  if (sub === '/verify' && req.method === 'GET') {
    const cookie = getHeader(req, 'cookie') || '';
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

/* -------- Daily Brief -------- */
async function handleDailyBrief(req, pathname) {
  const PREFIX = 'daily-brief';
  const p = normPath(pathname);

  // 列表
  if (p === '/api/daily-brief' || p === '/api/daily-brief/index' || p === '/api/daily-brief/index.json') {
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
      console.log('[daily-brief] write start:', FILE);

      try {
        await writeJSON(FILE, body);
        console.log('[daily-brief] write ok:', FILE);
      } catch (e) {
        console.error('[daily-brief] write error:', e);
        return err('WRITE_FAILED', 500);
      }

      try {
        await upsertIndex(PREFIX, slug);
        console.log('[daily-brief] index ok:', slug);
      } catch (e) {
        console.error('[daily-brief] index error:', e);
        // 写入已成功，即使索引更新失败也避免前端一直 loading
        return ok({ saved: true, slug, warn: 'INDEX_UPDATE_FAILED' });
      }

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

/* -------- Analyses -------- */
async function handleAnalyses(req, pathname) {
  const PREFIX = 'analyses';
  const p = normPath(pathname);

  if (p === '/api/analyses' || p === '/api/analyses/index' || p === '/api/analyses/index.json') {
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

/* -------- Market News -------- */
async function handleMarketNews(req, pathname) {
  const PREFIX = 'market-news';
  const p = normPath(pathname);

  if (p === '/api/market-news' || p === '/api/market-news/index' || p === '/api/market-news/index.json') {
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

/* -------- Research -------- */
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

/* -------- 总路由入口 -------- */
export default async function handler(req) {
  const url = getURL(req);
  const pathname = normPath(url.pathname);

  if (req.method === 'OPTIONS') return new Response(null, withHeaders({ status: 204 }));
  if (req.method === 'HEAD')    return new Response(null, withHeaders({ status: 200 }));

  // 健康检查：GET /api/ping -> { ok: true }
  if (req.method === 'GET' && pathname === '/api/ping') {
    return ok({ ok: true, ts: Date.now() });
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
