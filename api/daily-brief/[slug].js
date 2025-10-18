// api/daily-brief/[slug].js
import { writeJSON, readJSONViaFetch, deleteObject } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX  = `${PREFIX}/index.json`;

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop().replace('.json','');
    if (!slug) return badRequest('MISSING_SLUG');

    // GET /daily-brief/:slug.json
    if (req.method === 'GET') {
      try {
        const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
        return jsonOK(data);
      } catch {
        return badRequest('NOT_FOUND', 404);
      }
    }

    // DELETE /daily-brief/:slug.json  （已去鉴权）
    if (req.method === 'DELETE') {
      // 删除正文
      await deleteObject(`${PREFIX}/${slug}.json`);

      // 更新 index.json
      let idx = [];
      try {
        const arr = await readJSONViaFetch(INDEX);
        if (Array.isArray(arr)) idx = arr;
      } catch {}
      const next = idx.filter(s => (typeof s === 'string' ? s : s?.slug) !== slug);
      await writeJSON(INDEX, next);

      return jsonOK({ ok: true, deleted: slug });
    }

    return badRequest('METHOD_NOT_ALLOWED', 405);
  } catch (err) {
    console.error('[daily-brief/[slug]] error:', err);
    return badRequest('SERVER_ERROR', 500);
  }
}
