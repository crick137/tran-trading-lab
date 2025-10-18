// api/daily-brief/index.json.js
import { put, list } from '@vercel/blob';
import { jsonOK, badRequest, okOptions, methodNotAllowed, readBody } from '../_lib/http.js';

const DIR = 'daily-brief';

/** 日期感知：将 slug 按 YYYY-MM-DD 倒序，其它格式自然排后 */
function sortSlugsDesc(slugs) {
  const toKey = (s) => {
    const d = String(s || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '0000-00-00';
  };
  const uniq = Array.from(new Set((slugs || []).filter(Boolean)));
  return uniq.sort((a, b) => (toKey(a) > toKey(b) ? -1 : toKey(a) < toKey(b) ? 1 : 0));
}

async function readIndex() {
  const { blobs } = await list({ prefix: `${DIR}/`, limit: 1000 });
  const items = blobs
    .filter((b) => b.pathname.endsWith('.json'))
    .map((b) => b.pathname.replace(`${DIR}/`, '').replace(/\.json$/i, ''));
  return sortSlugsDesc(items);
}

// CORS 预检
export async function OPTIONS() {
  return okOptions();
}

// 索引（列表）
export async function GET() {
  try {
    const items = await readIndex();
    return jsonOK(items, { headers: { 'cache-control': 'no-store' } });
  } catch (e) {
    console.error('[GET daily-brief/index.json] error:', e);
    return badRequest('READ_INDEX_FAILED', 500);
  }
}

// 发布（管理页可 POST 到这里）
export async function POST(req) {
  try {
    const payload = await readBody(req, {}) || {};
    const slug = (payload.slug || new Date().toISOString().slice(0, 10)).trim();
    if (!slug) return badRequest('MISSING_SLUG', 400);

    await put(`${DIR}/${slug}.json`, JSON.stringify({ ...payload, slug }, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json; charset=utf-8',
    });

    // 可选：返回最新索引，方便前端立即刷新
    let index = [];
    try { index = await readIndex(); } catch {}

    return jsonOK(
      { ok: true, slug, path: `${DIR}/${slug}.json`, index },
      { headers: { 'cache-control': 'no-store' } }
    );
  } catch (e) {
    console.error('[POST daily-brief/index.json] error:', e);
    return badRequest('WRITE_FAILED', 500);
  }
}

// 兼容默认导出（若你的框架还会调用 default）
export default async function handler(req) {
  const m = req.method?.toUpperCase();
  if (m === 'OPTIONS') return OPTIONS(req);
  if (m === 'GET') return GET(req);
  if (m === 'POST') return POST(req);
  return methodNotAllowed();
}
