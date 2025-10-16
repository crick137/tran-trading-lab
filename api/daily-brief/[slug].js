import { writeJSON, readJSONViaFetch, deleteObject } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX = `${PREFIX}/index.json`;

function parseSlugFromURL(req) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    let last = parts.pop() || parts.pop();
    if (!last) return null;
    return last.replace(/\.json$/i, '').trim();
  } catch {
    return null;
  }
}

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
  const slug = parseSlugFromURL(req);
  if (!slug) return badRequest('MISSING_SLUG');

  try {
    switch (req.method) {
      case 'GET': {
        try {
          const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
          return jsonOK(data);
        } catch {
          return badRequest('NOT_FOUND', 404);
        }
      }

      case 'POST': {
        const unauthorized = requireAuth(req);
        if (unauthorized) return unauthorized;

        let body;
        try { body = await req.json(); } catch {
          return badRequest('INVALID_JSON');
        }

        await writeJSON(`${PREFIX}/${slug}.json`, {
          title: body.title || '',
          bullets: body.bullets || [],
          schedule: body.schedule || [],
          chart: body.chart || {},
        });

        await updateIndex(slug);

        return jsonOK({ ok: true, slug, saved: true });
      }

      case 'DELETE': {
        const unauthorized = requireAuth(req);
        if (unauthorized) return unauthorized;

        try {
          await deleteObject(`${PREFIX}/${slug}.json`);
        } catch (err) {
          console.error('deleteObject error:', err);
          return badRequest('DELETE_BODY_FAILED', 500);
        }

        const indexUpdated = await updateIndex(slug, true);

        return jsonOK({ ok: true, slug, deleted: true, indexUpdated });
      }

      default:
        return badRequest('NOT_ALLOWED', 405);
    }
  } catch (err) {
    console.error('slug handler error:', err);
    return badRequest('INTERNAL_ERROR', 500);
  }
}
