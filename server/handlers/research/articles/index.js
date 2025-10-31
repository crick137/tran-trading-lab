// /server/handlers/research/articles/[slug].js
import { readJSONViaFetch } from '../../../_lib/blob.js';
import { jsonOK, notFound, badRequest } from '../../../_lib/http.js';

const PREFIX = 'research/articles';

export default async function handler(req) {
  const { method } = req;
  if (method !== 'GET') {
    return badRequest('METHOD_NOT_ALLOWED', 405);
  }

  try {
    // slug 形如 "2025/10/27" 或 "2025-10-27"
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const slug = parts.slice(-1)[0].replace('.json', '');

    // 有时路径带多层目录
    const slugPath = parts.slice(parts.indexOf('articles') + 1).join('/');
    const key = `${PREFIX}/${slugPath.replace('.json','')}.json`;

    const data = await readJSONViaFetch(key);
    if (!data) return notFound('ARTICLE_NOT_FOUND');
    return jsonOK(data);
  } catch (err) {
    console.error('[GET] articles/[slug]', err);
    return notFound('ARTICLE_READ_ERROR');
  }
}
