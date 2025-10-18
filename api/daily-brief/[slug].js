// api/daily-brief/[slug].js
// 无密码 · 支持 GET/POST/PUT/DELETE/OPTIONS · 自动维护 daily-brief/index.json

import { writeJSON, readJSONViaFetch, deleteObject, readList } from '../_lib/blob.js';
import { jsonOK, badRequest, methodNotAllowed, okOptions, readBody } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX  = `${PREFIX}/index.json`;

function getSlugFromReq(req) {
  const raw = new URL(req.url).pathname.split('/').pop() || '';
  return raw.replace(/\.json$/i, '').trim();
}

/** 将 slug 按 YYYY-MM-DD 倒序；非日期格式自然排在后面（保持稳定顺序） */
function sortSlugsDesc(slugs) {
  const toKey = (s) => {
    const d = (s || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '0000-00-00';
  };
  const uniq = Array.from(new Set((slugs || []).filter(Boolean)));
  return uniq.sort((a, b) => (toKey(a) > toKey(b) ? -1 : toKey(a) < toKey(b) ? 1 : 0));
}

/** 从实际 Blob 目录重建索引，避免脏数据 */
async function rebuildIndex() {
  const list = await readList(`${PREFIX}/`);
  const items = list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
    .map(b => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''));
  const sorted = sortSlugsDesc(items);
  await writeJSON(INDEX, sorted);
  return sorted;
}

// 预检：CORS
export async function OPTIONS() {
  return okOptions();
}

// 读取单条
export async function GET(req) {
  const slug = getSlugFromReq(req);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try {
    const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
    return jsonOK(data);
  } catch {
    return badRequest('NOT_FOUND', 404);
  }
}

// 新建（与 PUT 等价）
export async function POST(req) {
  return PUT(req);
}

// 写入/覆盖
export async function PUT(req) {
  const slug = getSlugFromReq(req);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  const incoming = await readBody(req, null);
  if (!incoming || typeof incoming !== 'object') {
    return badRequest('INVALID_JSON', 400);
  }

  const payload = {
    ...incoming,
    slug,
    updatedAt: new Date().toISOString(),
  };

  try {
    await writeJSON(`${PREFIX}/${slug}.json`, payload);
    const idx = await rebuildIndex();
    return jsonOK({ ok: true, slug, total: idx.length, path: `${PREFIX}/${slug}.json` });
  } catch (e) {
    console.error('[PUT daily-brief] write error:', e);
    return badRequest('WRITE_FAILED', 500);
  }
}

// 删除
export async function DELETE(req) {
  const slug = getSlugFromReq(req);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try {
    try { await deleteObject(`${PREFIX}/${slug}.json`); } catch {}
    const idx = await rebuildIndex();
    return jsonOK({ ok: true, deleted: slug, total: idx.length });
  } catch (e) {
    console.error('[DELETE daily-brief] error:', e);
    return badRequest('DELETE_FAILED', 500);
  }
}

// 兜底（兼容默认导出调用）
export default async function handler(req) {
  const m = req.method?.toUpperCase();
  if (m === 'OPTIONS') return OPTIONS(req);
  if (m === 'GET')     return GET(req);
  if (m === 'POST')    return POST(req);
  if (m === 'PUT')     return PUT(req);
  if (m === 'DELETE')  return DELETE(req);
  return methodNotAllowed();
}
