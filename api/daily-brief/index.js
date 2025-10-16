// api/daily-brief/index.js
import { writeJSON, readList, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth } from '../_lib/http.js';

const PREFIX = 'daily-brief'; // 存储目录
const INDEX = `${PREFIX}/index.json`;

export default async function handler(req) {
  const { method } = req;

  // GET /daily-brief/index.json  —— 返回所有 slug（按时间倒序）
  if (method === 'GET') {
    const blobs = await readList(`${PREFIX}/`);
    // 只要 *.json 且不是 index.json
    const items = blobs
      .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
      .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json',''));

    // 自定义排序：尝试按 YYYY-MM-DD 倒排
    const sorted = items.sort((a,b) => (a>b?-1:1));
    return jsonOK(sorted);
  }

  // POST /daily-brief/index.json —— 新建/更新一条
  if (method === 'POST') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;

    let body;
    try { body = await req.json(); } catch { return badRequest('INVALID_JSON'); }

    // body 结构：{ slug, title?, bullets[], schedule[], chart:{symbol?, interval?} }
    const slug = (body.slug || new Date().toISOString().slice(0,10)).trim();
    if (!slug) return badRequest('MISSING_SLUG');

    // 写入实际内容
    await writeJSON(`${PREFIX}/${slug}.json`, {
      title: body.title || '',
      bullets: body.bullets || [],
      schedule: body.schedule || [],
      chart: body.chart || {},
    });

    // 维护 index.json（存储数组，避免反复 list）
    let idx = [];
    try { idx = await readJSONViaFetch(INDEX); } catch {}
    // 可能已有：去重
    idx = Array.isArray(idx) ? idx.filter(s => s !== slug) : [];
    idx.unshift(slug);
    await writeJSON(INDEX, idx);

    return jsonOK({ ok: true, slug });
  }

  return badRequest('NOT_ALLOWED', 405);
}

export const config = {
  runtime: 'edge',
};
