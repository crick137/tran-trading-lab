import { writeJSON, readList, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const PREFIX = 'market-news';
const INDEX  = `${PREFIX}/index.json`;

export default async function handler(req) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const blobs = await readList(`${PREFIX}/`);
      const items = blobs
        .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
        .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json',''))
        .sort((a,b) => (a > b ? -1 : 1));
      return jsonOK(items);
    } catch (err) {
      console.error(`[GET] ${PREFIX}`, err);
      return badRequest('INDEX_READ_ERROR');
    }
  }

  if (method === 'POST') {
    try {
      const payload = await req.json();
      const { id } = payload || {};
      if (!id) return badRequest('MISSING_ID');

      await writeJSON(`${PREFIX}/${id}.json`, payload);

      let idx = [];
      try {
        const exist = await readJSONViaFetch(INDEX);
        if (Array.isArray(exist)) idx = exist;
      } catch {}
      if (!idx.includes(id)) idx.unshift(id);

      await writeJSON(INDEX, idx);
      return jsonOK({ ok: true, id });
    } catch (err) {
      console.error(`[POST] ${PREFIX}`, err);
      return badRequest('POST_ERROR');
    }
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
