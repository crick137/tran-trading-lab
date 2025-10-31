// /server/handlers/research/articles/[slug].js
import { writeJSON, readJSONViaFetch, deleteObject } from '../../../_lib/blob.js';
import { jsonOK, notFound, badRequest } from '../../../_lib/http.js';

const PREFIX = 'research/articles';

export default async function handler(req) {
  const { method } = req;
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop().replace('.json', '');

  if (!slug) return badRequest('MISSING_SLUG');

  try {
    /* -------- GET -------- */
    if (method === 'GET') {
      const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
      return jsonOK(data || {});
    }

    /* -------- PUT (保存/发布) -------- */
    if (method === 'PUT') {
      const payload = await req.json();
      // 防止目录嵌套
      const safeSlug = slug.replace(/[\\/]+/g, '-');
      await writeJSON(`${PREFIX}/${safeSlug}.json`, payload);

      // 更新 index.json
      let idx = [];
      try {
        const idxRes = await readJSONViaFetch(`${PREFIX}/index.json`);
        if (Array.isArray(idxRes)) idx = idxRes;
      } catch {}
      if (!idx.includes(safeSlug)) idx.unshift(safeSlug);
      await writeJSON(`${PREFIX}/index.json`, idx);

      return jsonOK({ ok: true, slug: safeSlug, index: idx });
    }

    /* -------- DELETE -------- */
    if (method === 'DELETE') {
      const safeSlug = slug.replace(/[\\/]+/g, '-');
      await deleteObject(`${PREFIX}/${safeSlug}.json`);
      let idx = [];
      try {
        const idxRes = await readJSONViaFetch(`${PREFIX}/index.json`);
        if (Array.isArray(idxRes)) {
          idx = idxRes.filter(s => s !== safeSlug);
        }
      } catch {}
      await writeJSON(`${PREFIX}/index.json`, idx);
      return jsonOK({ ok: true, removed: safeSlug, index: idx });
    }

    return badRequest('METHOD_NOT_ALLOWED', 405);
  } catch (err) {
    console.error('[articles slug handler]', err);
    return notFound('ARTICLE_HANDLER_ERROR');
  }
}
