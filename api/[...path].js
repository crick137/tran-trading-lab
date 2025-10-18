// api/[...path].js
// 单文件总路由：Hobby 计划下把所有 API 合并为 1 个函数
// 无鉴权 + CORS + 支持 GET/POST/PUT/DELETE/OPTIONS
// 依赖你已有的 _lib/blob.js / _lib/http.js

import {
  writeJSON, readJSONViaFetch, deleteObject, readList,
} from './_lib/blob.js';
import {
  jsonOK, badRequest, okOptions, methodNotAllowed, readBody,
} from './_lib/http.js';

// ---------- Helpers ----------
const COLS = {
  'daily-brief': { index: 'daily-brief/index.json', prefix: 'daily-brief/' },
  'analyses':    { index: 'analyses/index.json',     prefix: 'analyses/' },
  'market-news': { index: 'market-news/index.json',  prefix: 'market-news/' },
  'research/articles': { index: 'research/articles/index.json', prefix: 'research/articles/' },
};
const SYLLABUS_FILE = 'research/syllabus.json';

const isDate10 = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s||'').slice(0,10));
const sortDateFirstDesc = (arr) => {
  const key = (s)=> isDate10(s) ? s.slice(0,10) : '0000-00-00';
  return Array.from(new Set(arr.filter(Boolean)))
    .sort((a,b)=> key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0);
};

async function rebuildIndex(prefix, indexKey, dateAware=false) {
  const list = await readList(prefix);
  const items = list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== indexKey)
    .map(b => b.pathname.replace(prefix, '').replace(/\.json$/i, ''));
  const sorted = dateAware ? sortDateFirstDesc(items) : items.sort((a,b)=> (a>b?-1:1));
  await writeJSON(indexKey, sorted);
  return sorted;
}

function parsePath(req) {
  const u = new URL(req.url);
  // 去掉 "/api/" 前缀
  const parts = u.pathname.replace(/^\/+/, '').split('/');
  const apiIdx = parts.indexOf('api');
  const segs = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;

  // 组合 research/articles 这种二级集合名
  if (segs[0] === 'research' && segs[1] === 'articles') {
    const rest = segs.slice(2);
    return { collection: 'research/articles', rest };
  }
  return { collection: segs[0] || '', rest: segs.slice(1) };
}

async function handleCollection(req, collection, rest) {
  if (!collection) return badRequest('MISSING_COLLECTION', 400);

  // syllabus 是单文件，不走集合逻辑
  if (collection === 'research' && rest[0] === 'syllabus') {
    const m = req.method.toUpperCase();
    if (m === 'OPTIONS') return okOptions();
    if (m === 'GET') {
      try {
        const data = await readJSONViaFetch(SYLLABUS_FILE);
        return jsonOK(data, { headers: { 'cache-control': 'no-store' } });
      } catch {
        return jsonOK({ syllabus: [] }, { headers: { 'cache-control': 'no-store' } });
      }
    }
    if (m === 'POST' || m === 'PUT') {
      const body = await readBody(req, {});
      const syllabus = Array.isArray(body?.syllabus) ? body.syllabus : null;
      if (!Array.isArray(syllabus)) return badRequest('INVALID_SYLLABUS_ARRAY', 400);
      await writeJSON(SYLLABUS_FILE, { syllabus, updatedAt: new Date().toISOString() });
      return jsonOK({ ok: true }, { headers: { 'cache-control': 'no-store' } });
    }
    return methodNotAllowed();
  }

  // 其余都是集合型
  const meta =
    collection in COLS ? COLS[collection] :
    // 兼容 'research/articles'
    (collection === 'research/articles' ? COLS['research/articles'] : null);

  if (!meta) return badRequest('UNKNOWN_COLLECTION', 404);

  const { index: INDEX_KEY, prefix: PREFIX } = meta;
  const method = req.method.toUpperCase();

  // 预检
  if (method === 'OPTIONS') return okOptions();

  // ===== index 路由 =====
  // 形态：/api/<collection>/index 或 /index.json
  if (rest.length === 0 || /^index(\.json)?$/i.test(rest[0]||'')) {
    if (method === 'GET') {
      try {
        const dateAware = (collection === 'daily-brief' || collection === 'market-news');
        const items = await rebuildIndex(PREFIX, INDEX_KEY, dateAware);
        return jsonOK(items, { headers: { 'cache-control': 'no-store' } });
      } catch (e) {
        console.error('[INDEX GET]', collection, e);
        return badRequest('INDEX_READ_ERROR', 500);
      }
    }
    if (method === 'POST') {
      try {
        const dateAware = (collection === 'daily-brief' || collection === 'market-news');
        const items = await rebuildIndex(PREFIX, INDEX_KEY, dateAware);
        return jsonOK({ ok: true, total: items.length, index: items });
      } catch (e) {
        console.error('[INDEX POST]', collection, e);
        return badRequest('INDEX_REBUILD_ERROR', 500);
      }
    }
    return methodNotAllowed();
  }

  // ===== 单条路由 =====
  // 形态：/api/<collection>/<id or slug>[.json]
  const last = (rest[0]||'').replace(/\.json$/i, '');
  if (!last) return badRequest('MISSING_ID', 400);

  if (method === 'GET') {
    try {
      const data = await readJSONViaFetch(`${PREFIX}${last}.json`);
      return jsonOK(data, { headers: { 'cache-control': 'no-store' } });
    } catch {
      return badRequest('NOT_FOUND', 404);
    }
  }

  if (method === 'POST' || method === 'PUT') {
    const body = await readBody(req, null);
    if (!body || typeof body !== 'object') return badRequest('INVALID_JSON', 400);

    // Daily Brief 自动补充 slug/updatedAt（其它集合原样写入即可）
    const payload = (collection === 'daily-brief')
      ? { ...body, slug: last, updatedAt: new Date().toISOString() }
      : body;

    try {
      await writeJSON(`${PREFIX}${last}.json`, payload);
      // 写入后自动重建索引（可保持一致性）
      const dateAware = (collection === 'daily-brief' || collection === 'market-news');
      await rebuildIndex(PREFIX, INDEX_KEY, dateAware);
      return jsonOK({ ok: true, id: last, path: `${PREFIX}${last}.json` });
    } catch (e) {
      console.error('[PUT item]', collection, last, e);
      return badRequest('WRITE_FAILED', 500);
    }
  }

  if (method === 'DELETE') {
    try {
      await deleteObject(`${PREFIX}${last}.json`);
      const dateAware = (collection === 'daily-brief' || collection === 'market-news');
      const index = await rebuildIndex(PREFIX, INDEX_KEY, dateAware);
      return jsonOK({ ok: true, deleted: last, total: index.length });
    } catch (e) {
      console.error('[DELETE item]', collection, last, e);
      return badRequest('DELETE_FAILED', 500);
    }
  }

  return methodNotAllowed();
}

// 入口：所有 /api/* 都走这里
export default async function handler(req) {
  try {
    const { collection, rest } = parsePath(req);
    return await handleCollection(req, collection, rest);
  } catch (e) {
    console.error('[router] fatal', e);
    return badRequest('SERVER_ERROR', 500);
  }
}
