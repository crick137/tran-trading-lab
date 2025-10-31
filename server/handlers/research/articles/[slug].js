import { writeJSON, readJSONViaFetch, deleteObject } from '../../../_lib/blob.js';
import { jsonOK, notFound, badRequest } from '../../../_lib/http.js';

const PREFIX = 'research/articles';

function normalizeSlug(slug = '') {
  return slug.replace(/[\\/]+/g, '-');
}

export default async function handler(req) {
  const { method } = req;
  const url = new URL(req.url);
  const slugRaw = url.pathname.split('/').pop().replace('.json', '');
  if (!slugRaw) return badRequest('MISSING_SLUG');

  const slug = normalizeSlug(slugRaw);

  try {
    /* -------- GET -------- */
    if (method === 'GET') {
      try {
        const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
        return jsonOK(data);
      } catch {
        // 兼容旧路径
        const data = await readJSONViaFetch(`${PREFIX}/${slugRaw}.json`).catch(() => null);
        if (!data) return notFound('ARTICLE_NOT_FOUND');
        return jsonOK(data);
      }
    }

    /* -------- PUT (保存/发布) -------- */
    if (method === 'PUT') {
      const payload = await req.json();
      await writeJSON(`${PREFIX}/${slug}.json`, payload);

      // 更新索引
      let idx = [];
      try {
        const exist = await readJSONViaFetch(`${PREFIX}/index.json`);
        if (Array.isArray(exist)) idx = exist;
      } catch {}
      if (!idx.includes(slug)) idx.unshift(slug);
      await writeJSON(`${PREFIX}/index.json`, idx);

      return jsonOK({ ok: true, slug, index: idx });
    }

    /* -------- DELETE -------- */
    if (method === 'DELETE') {
      await deleteObject(`${PREFIX}/${slug}.json`).catch(() => {});
      await deleteObject(`${PREFIX}/${slugRaw}.json`).catch(() => {});

      let idx = [];
      try {
        const exist = await readJSONViaFetch(`${PREFIX}/index.json`);
        if (Array.isArray(exist)) {
          idx = exist.filter(s => s !== slug && s !== slugRaw);
        }
      } catch {}
      await writeJSON(`${PREFIX}/index.json`, idx);
      return jsonOK({ ok: true, removed: slug, index: idx });
    }

    return badRequest('METHOD_NOT_ALLOWED', 405);
  } catch (err) {
    console.error('[articles slug handler]', err);
    return notFound('ARTICLE_HANDLER_ERROR');
  }
}
