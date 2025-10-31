// /server/handlers/research/articles/[...slug].js
import { readJSONViaFetch } from '../../../_lib/blob.js';
import { jsonOK, notFound, badRequest } from '../../../_lib/http.js';

const PREFIX = 'research/articles';

export default async function handler(req) {
  const { method } = req;
  if (method !== 'GET') return badRequest('METHOD_NOT_ALLOWED', 405);

  try {
    // 解析 slug 路径数组
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const idx = pathParts.indexOf('articles');
    const slugParts = pathParts.slice(idx + 1);
    const slug = slugParts.join('/').replace(/\.json$/, '');

    // 拼接 Blob key
    const key = `${PREFIX}/${slug}.json`;
    const data = await readJSONViaFetch(key);

    if (!data) return notFound('ARTICLE_NOT_FOUND');
    return jsonOK(data);
  } catch (err) {
    console.error('[GET] research/articles/[...slug]', err);
    return notFound('ARTICLE_READ_ERROR');
  }
}
