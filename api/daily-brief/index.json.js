// api/daily-brief/index.json.js
import { put, list } from '@vercel/blob';
import { requireAuth, jsonOK, badRequest } from '../_lib/http.js';

const DIR = 'daily-brief';

export default async function handler(req) {
  const { method } = req;

  // 列表（索引页）
  if (method === 'GET') {
    try {
      const { blobs } = await list({ prefix: `${DIR}/`, limit: 500 });
      const items = blobs
        .filter(b => b.pathname.endsWith('.json'))
        .map(b => b.pathname.replace(`${DIR}/`, '').replace(/\.json$/, ''))
        .sort((a, b) => (a > b ? -1 : 1)); // 按日期倒序
      return jsonOK(items, { headers: { 'cache-control': 'no-store' } });
    } catch (e) {
      console.error(e);
      return badRequest('READ_INDEX_FAILED', 500);
    }
  }

  // 发布（你管理页的“发布”按钮就是 POST 到这里）
  if (method === 'POST') {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    let payload = {};
    try { payload = await req.json(); } catch { /* ignore */ }

    const slug = (payload.slug || new Date().toISOString().slice(0,10)).trim();
    if (!slug) return badRequest('MISSING_SLUG');

    try {
      await put(`${DIR}/${slug}.json`, JSON.stringify(payload, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json; charset=utf-8',
      });
      return jsonOK({ ok: true, slug }, { headers: { 'cache-control': 'no-store' } });
    } catch (e) {
      console.error(e);
      return badRequest('WRITE_FAILED', 500);
    }
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
