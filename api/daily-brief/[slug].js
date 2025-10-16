// api/daily-brief/[slug].js
import { writeJSON, readJSONViaFetch, deleteObject } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX = `${PREFIX}/index.json`;

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    let last = parts.pop() || parts.pop(); // 防止末尾是空字符串
    if (!last) return badRequest('MISSING_SLUG');
    const slug = last.replace(/\.json$/i, '').trim();
    if (!slug) return badRequest('MISSING_SLUG');

    switch (req.method) {
      case 'GET':
        try {
          const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
          return jsonOK(data);
        } catch {
          return badRequest('NOT_FOUND', 404);
        }

      case 'DELETE': {
        const unauthorized = requireAuth(req);
        if (unauthorized) return unauthorized;

        // 删除正文
        try {
          await deleteObject(`${PREFIX}/${slug}.json`);
        } catch (err) {
          console.error('deleteObject error:', err);
          return badRequest('DELETE_BODY_FAILED', 500);
        }

        // 更新 index.json
        let idx = [];
        try {
          idx = await readJSONViaFetch(INDEX);
          if (!Array.isArray(idx)) idx = [];
        } catch {
          idx = [];
        }

        const filtered = idx.filter(item => {
          if (typeof item === 'string') return item !== slug;
          if (item && typeof item === 'object') {
            const candidate = item.slug || item.id || item.name;
            return candidate !== slug;
          }
          return true; // 非标准项保留
        });

        const indexChanged = filtered.length !== idx.length;
        if (indexChanged) {
          try {
            await writeJSON(INDEX, filtered);
          } catch (err) {
            console.error('writeJSON index error:', err);
            return badRequest('INDEX_UPDATE_FAILED', 500);
          }
        }

        return jsonOK({ ok: true, slug, deleted: true, indexUpdated: indexChanged });
      }

      default:
        return badRequest('NOT_ALLOWED', 405);
    }
  } catch (err) {
    console.error('handler top-level error:', err);
    return badRequest('INTERNAL_ERROR', 500);
  }
}
