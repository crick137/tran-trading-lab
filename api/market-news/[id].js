// /api/market-news/[id].js
import { writeJSON, deleteObject, listByPrefix, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, withCORS } from '../_lib/http.js';

const PREFIX = 'market-news';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop().replace('.json','');
  if (!id) return badRequest('MISSING_ID', 400);

  // GET /market-news/:id.json
  if (req.method === 'GET') {
    try {
      const data = await readJSONViaFetch(`${PREFIX}/${id}.json`);
      return jsonOK(data);
    } catch {
      return badRequest('NOT_FOUND', 404);
    }
  }

  // POST /market-news/:id.json  （写入单条，用于兼容直写，但索引维护放在 index.js）
  if (req.method === 'POST') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    let payload; try { payload = await req.json(); } catch { return badRequest('INVALID_JSON'); }
    await writeJSON(`${PREFIX}/${id}.json`, payload);
    return jsonOK({ ok: true, id });
  }

  // DELETE /market-news/:id.json
  if (req.method === 'DELETE') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    await deleteObject(`${PREFIX}/${id}.json`);
    return jsonOK({ ok: true });
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}