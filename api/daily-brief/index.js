import { writeJSON, readList, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX = `${PREFIX}/index.json`;

// 更新索引辅助函数
async function updateIndex(slug, remove = false) {
  let idx = [];
  try {
    idx = await readJSONViaFetch(INDEX);
    if (!Array.isArray(idx)) idx = [];
  } catch {}

  let changed = false;

  if (remove) {
    const filtered = idx.filter(item => item !== slug);
    changed = filtered.length !== idx.length;
    if (changed) await writeJSON(INDEX, filtered);
  } else {
    idx = Array.isArray(idx) ? idx.filter(s => s !== slug) : [];
    idx.unshift(slug);
    changed = true;
    await writeJSON(INDEX, idx);
  }

  return changed;
}

export default async function handler(req) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const blobs = await readList(`${PREFIX}/`);
      const items = blobs
        .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
        .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json',''));
      const sorted = items.sort((a,b) => (a > b ? -1 : 1));
      return jsonOK(sorted);
    }

    if (method === 'POST') {
      const unauthorized = requireAuth(req);
      if (unauthorized) return unauthorized;

      let body;
      try { body = await req.json(); } catch {
        return badRequest('INVALID_JSON');
      }

      const slug = (body.slug || new Date().toISOString().slice(0,10)).trim();
      if (!slug) return badRequest('MISSING_SLUG');

      await writeJSON(`${PREFIX}/${slug}.json`, {
        title: body.title || '',
        bullets: body.bullets || [],
        schedule: body.schedule || [],
        chart: body.chart || {},
      });

      await updateIndex(slug);

      return jsonOK({ ok: true, slug, saved: true });
    }

    return badRequest('NOT_ALLOWED', 405);
  } catch (err) {
    console.error('index handler error:', err);
    return badRequest('INTERNAL_ERROR', 500);
  }
}
