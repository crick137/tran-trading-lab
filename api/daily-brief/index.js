// /api/daily-brief/index.js
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, withCORS } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX  = `${PREFIX}/index.json`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));

  if (req.method === 'GET') {
    try {
      const arr = await readJSONViaFetch(INDEX);
      return jsonOK(Array.isArray(arr) ? arr : []);
    } catch {
      return jsonOK([]);
    }
  }

  if (req.method === 'POST') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    let payload; try { payload = await req.json(); } catch { return badRequest('INVALID_JSON'); }
    const slug = payload.slug || new Date().toISOString().slice(0,10);
    const item = {
      slug,
      title: payload.title || '',
      bullets: Array.isArray(payload.bullets) ? payload.bullets : [],
      schedule: Array.isArray(payload.schedule) ? payload.schedule : [],
      chart: payload.chart || { symbol: payload.symbol || '', interval: payload.interval || '60' }
    };

    await writeJSON(`${PREFIX}/${slug}.json`, item);

    let idx = [];
    try { idx = await readJSONViaFetch(INDEX); } catch {}
    idx = Array.isArray(idx) ? idx : [];
    const map = new Map(idx.map(s => [typeof s==='string'?s:s.slug, s]));
    map.set(slug, (typeof idx[0]==='string') ? slug : { slug });
    const list = Array.from(map.values()).sort((a,b)=>{
      const sa = typeof a==='string'?a:a.slug, sb = typeof b==='string'?b:b.slug;
      return sb.localeCompare(sa);
    });
    await writeJSON(INDEX, list);

    return jsonOK({ ok: true, slug });
  }

  if (req.method === 'DELETE') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    return badRequest('DELETE_SINGLE_USE /daily-brief/:slug.json', 405);
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
