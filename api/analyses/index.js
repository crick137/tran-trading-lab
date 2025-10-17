// /api/analyses/index.js
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, withCORS } from '../_lib/http.js';

const PREFIX = 'analyses';
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
    let d; try { d = await req.json(); } catch { return badRequest('INVALID_JSON'); }
    if (!d.slug) return badRequest('MISSING_SLUG');

    const data = {
      slug: d.slug,
      title: d.title || '',
      symbol: d.symbol || '',
      tf: d.tf || '',
      date: d.date || new Date().toISOString().slice(0,10),
      bias: d.bias || 'neutral',
      tags: Array.isArray(d.tags) ? d.tags : [],
      supports: Array.isArray(d.supports) ? d.supports : [],
      resistances: Array.isArray(d.resistances) ? d.resistances : [],
      context: d.context || '',
      view: d.view || '',
      invalidation: d.invalidation || '',
      chart: d.chart || { symbol: d.symbol || '', interval: d.chart?.interval || '60' }
    };

    await writeJSON(`${PREFIX}/${encodeURIComponent(d.slug)}.json`, data);

    let idx = [];
    try { idx = await readJSONViaFetch(INDEX); } catch {}
    idx = Array.isArray(idx) ? idx : [];
    const map = new Map(idx.map(x => [x.slug || x, x]));
    map.set(data.slug, { slug: data.slug, title: data.title, date: data.date });
    const list = Array.from(map.values()).sort((a,b)=>{
      return String(b.date || b.slug).localeCompare(String(a.date || a.slug));
    });
    await writeJSON(INDEX, list);

    return jsonOK({ ok: true, slug: data.slug });
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
