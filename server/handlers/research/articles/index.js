import { writeJSON, readList, readJSONViaFetch, del } from '../../_lib/blob.js';
import { jsonOK, badRequest, notFound } from '../../_lib/http.js';

const PREFIX = 'research/articles';
const INDEX  = `${PREFIX}/index.json`;

export default async function handler(req) {
  const { method } = req;

  /* ---------------- GET ---------------- */
  if (method === 'GET') {
    try {
      const blobs = await readList(`${PREFIX}/`);
      const items = blobs
        .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
        .map(b => b.pathname.replace(`${PREFIX}/`, '').replace('.json', ''))
        .sort((a, b) => (a > b ? -1 : 1));
      return jsonOK(items);
    } catch (err) {
      console.error(`[GET] ${PREFIX}`, err);
      return badRequest('INDEX_READ_ERROR');
    }
  }

  /* ---------------- POST (发布) ---------------- */
  if (method === 'POST') {
    try {
      const payload = await req.json();
      let { slug } = payload || {};
      if (!slug) return badRequest('MISSING_SLUG');
      slug = slug.replace(/[\\/]+/g, '-'); // 防止路径嵌套问题

      await writeJSON(`${PREFIX}/${slug}.json`, payload);

      // 更新索引
      let idx = [];
      try {
        const exist = await readJSONViaFetch(INDEX);
        if (Array.isArray(exist)) idx = exist;
      } catch {}
      if (!idx.includes(slug)) idx.unshift(slug);

      await writeJSON(INDEX, idx);
      return jsonOK({ ok: true, slug, index: idx });
    } catch (err) {
      console.error(`[POST] ${PREFIX}`, err);
      return badRequest('POST_ERROR');
    }
  }

  /* ---------------- DELETE (删除) ---------------- */
  if (method === 'DELETE') {
    try {
      const payload = await req.json();
      let { slug } = payload || {};
      if (!slug) return badRequest('MISSING_SLUG');
      slug = slug.replace(/[\\/]+/g, '-');

      // 删除文件
      await del(`${PREFIX}/${slug}.json`);

      // 更新 index.json
      let idx = [];
      try {
        const exist = await readJSONViaFetch(INDEX);
        if (Array.isArray(exist)) {
          idx = exist.filter(s => s !== slug);
        }
      } catch {}
      await writeJSON(INDEX, idx);

      return jsonOK({ ok: true, removed: slug, index: idx });
    } catch (err) {
      console.error(`[DELETE] ${PREFIX}`, err);
      return badRequest('DELETE_ERROR');
    }
  }

  return notFound('METHOD_NOT_ALLOWED');
}
