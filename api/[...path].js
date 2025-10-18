// api/[...path].js —— 单入口总路由（Hobby 版避开 12 个函数限制）
// 依赖：api/_lib/http.js, api/_lib/blob.js
// 环境变量：ADMIN_PASSWORD（后台登录口令）

import { jsonOK, badRequest, requireAuth } from './_lib/http.js';
import {
  writeJSON,
  readJSONViaFetch,
  deleteObject,
  listByPrefix as _listByPrefix,
  list as _listRaw
} from './_lib/blob.js';

// ---------- 小工具 ----------
async function readBody(req) {
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await req.json();
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch { return {}; }
}
function ok(data, status = 200) {
  return jsonOK(data, status);
}
function err(message = 'BAD_REQUEST', status = 400) {
  return badRequest(message, status);
}
async function listByPrefix(prefix) {
  // 优先用你封装的 listByPrefix；没有就退化用 raw list + 过滤
  if (typeof _listByPrefix === 'function') return await _listByPrefix(prefix);
  const it = await _listRaw({ prefix });
  return it?.blobs ?? [];
}

// 提取 slug/id（用于 /xx/:slug(.json)）
function pickTail(pathname) {
  const seg = pathname.split('/').pop() || '';
  return seg.endsWith('.json') ? seg.slice(0, -5) : seg;
}

// 统一读 index.json（如果不存在就给空数组）—— 用于列表端点
async function readIndexJson(pathname) {
  try {
    return await readJSONViaFetch(pathname);
  } catch {
    return [];
  }
}

// 统一写 index.json（去重+倒序）
async function upsertIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX); } catch {}
  // 去重，新增放最前
  arr = [key, ...arr.filter(x => x !== key)];
  await writeJSON(INDEX, arr);
}

// 统一删除 index.json 中的 key
async function removeFromIndex(prefix, key) {
  const INDEX = `${prefix}/index.json`;
  let arr = [];
  try { arr = await readJSONViaFetch(INDEX); } catch {}
  arr = arr.filter(x => x !== key);
  await writeJSON(INDEX, arr);
}

// ---------- 各资源的具体处理 ----------
// 1) Admin：login / logout / verify（基于 Cookie 的超轻认证）
async function handleAdmin(req, pathname) {
  const url = new URL(req.url);
  const sub = url.pathname.replace('/api/admin', '') || '';

  if (sub === '/login' && req.method === 'POST') {
    const body = await readBody(req);
    const pass = body?.password || body?.pwd || '';
    if (!process.env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD_NOT_SET', 500);
    if (pass !== process.env.ADMIN_PASSWORD) return err('INVALID_PASSWORD', 401);

    // 设置 httpOnly cookie（简单示例：7 天）
    const token = 'ok'; // 你可以换成签名字符串
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `admintoken=${token}; Path=/; HttpOnly; Max-Age=${7 * 86400}; SameSite=Lax`
      }
    });
  }

  if (sub === '/verify' && req.method === 'GET') {
    const cookie = req.headers.get('cookie') || '';
    const authed = /(^|;\s*)admintoken=/.test(cookie);
    return ok({ authed });
  }

  if (sub === '/logout' && req.method === 'POST') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'set-cookie': `admintoken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
      }
    });
  }

  return err('ADMIN_NO_ROUTE', 404);
}

// 2) Daily Brief：/daily-brief/index.json & /daily-brief/:slug.json
async function handleDailyBrief(req, pathname) {
  const PREFIX = 'daily-brief';

  // 列表
  if (pathname === '/api/daily-brief/index.json' && req.method === 'GET') {
    // 优先读维护的 index.json；若没有，则从存储列目录生成
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  // 具体 slug
  if (pathname.startsWith('/api/daily-brief/') && pathname.endsWith('.json')) {
    const slug = pickTail(pathname);
    const FILE = `${PREFIX}/${slug}.json`;

    if (req.method === 'GET') {
      try {
        const data = await readJSONViaFetch(FILE);
        return ok(data);
      } catch {
        return err('NOT_FOUND', 404);
      }
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, slug);
      return ok({ saved: true, slug });
    }

    if (req.method === 'DELETE') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, slug);
      return ok({ deleted: true, slug });
    }
  }

  return err('DAILY_NO_ROUTE', 404);
}

// 3) Analyses：/analyses/index(.json) & /analyses/:id(.json)
async function handleAnalyses(req, pathname) {
  const PREFIX = 'analyses';

  // 列表：允许 /index 或 /index.json 或 /analyses
  if (
    (pathname === '/api/analyses' || pathname === '/api/analyses/' || pathname === '/api/analyses/index' ||
     pathname === '/api/analyses/index.json') && req.method === 'GET'
  ) {
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  // 具体 id
  const m = pathname.match(/^\/api\/analyses\/([^/]+)(?:\.json)?$/);
  if (m) {
    const id = m[1];
    const FILE = `${PREFIX}/${id}.json`;

    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, id);
      return ok({ saved: true, id });
    }
    if (req.method === 'DELETE') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, id);
      return ok({ deleted: true, id });
    }
  }

  return err('ANALYSES_NO_ROUTE', 404);
}

// 4) Market News：/market-news/index(.json) & /market-news/:slug(.json)
async function handleMarketNews(req, pathname) {
  const PREFIX = 'market-news';

  if (
    (pathname === '/api/market-news' || pathname === '/api/market-news/' || pathname === '/api/market-news/index' ||
     pathname === '/api/market-news/index.json') && req.method === 'GET'
  ) {
    const fromIndex = await readIndexJson(`${PREFIX}/index.json`);
    if (Array.isArray(fromIndex) && fromIndex.length) return ok(fromIndex);

    const blobs = await listByPrefix(`${PREFIX}/`);
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('/index.json'))
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
      .sort((a, b) => (a > b ? -1 : 1));
    return ok(items);
  }

  const m = pathname.match(/^\/api\/market-news\/([^/]+)(?:\.json)?$/);
  if (m) {
    const slug = m[1];
    const FILE = `${PREFIX}/${slug}.json`;

    if (req.method === 'GET') {
      try { return ok(await readJSONViaFetch(FILE)); }
      catch { return err('NOT_FOUND', 404); }
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      const body = await readBody(req);
      await writeJSON(FILE, body);
      await upsertIndex(PREFIX, slug);
      return ok({ saved: true, slug });
    }
    if (req.method === 'DELETE') {
      const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
      try { await deleteObject(FILE); } catch {}
      await removeFromIndex(PREFIX, slug);
      return ok({ deleted: true, slug });
    }
  }

  return err('NEWS_NO_ROUTE', 404);
}

// 5) Research：/research/syllabus(.json) & /research/articles(.json)
// 这两个更多像固定文件读取的端点
async function handleResearch(req, pathname) {
  if (req.method !== 'GET') return err('METHOD_NOT_ALLOWED', 405);

  if (/^\/api\/research\/syllabus(?:\.json)?$/.test(pathname)) {
    try { return ok(await readJSONViaFetch('research/syllabus.json')); }
    catch { return err('NOT_FOUND', 404); }
  }

  if (/^\/api\/research\/articles(?:\.json)?$/.test(pathname)) {
    try { return ok(await readJSONViaFetch('research/articles/index.json')); }
    catch { return err('NOT_FOUND', 404); }
  }

  return err('RESEARCH_NO_ROUTE', 404);
}

// ---------- 总路由入口 ----------
export default async function handler(req) {
  const url = new URL(req.url);
  const { pathname } = url;

  try {
    // Admin
    if (pathname.startsWith('/api/admin')) {
      return await handleAdmin(req, pathname);
    }
    // Daily Brief
    if (pathname.startsWith('/api/daily-brief')) {
      return await handleDailyBrief(req, pathname);
    }
    // Analyses
    if (pathname.startsWith('/api/analyses')) {
      return await handleAnalyses(req, pathname);
    }
    // Market News
    if (pathname.startsWith('/api/market-news')) {
      return await handleMarketNews(req, pathname);
    }
    // Research
    if (pathname.startsWith('/api/research')) {
      return await handleResearch(req, pathname);
    }

    return err('NO_ROUTE', 404);
  } catch (e) {
    console.error('API_ERROR:', e);
    return err('INTERNAL_ERROR', 500);
  }
}
