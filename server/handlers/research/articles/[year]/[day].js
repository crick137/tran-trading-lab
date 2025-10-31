// /server/handlers/research/articles/[year]/[month]/[day].js
import { readJSONViaFetch } from '../../../../_lib/blob.js';
import { jsonOK, notFound, badRequest } from '../../../../_lib/http.js';

const PREFIX = 'research/articles';

export default async function handler(req) {
  if (req.method !== 'GET') return badRequest('METHOD_NOT_ALLOWED', 405);
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const year = pathParts.at(-3);
    const month = pathParts.at(-2);
    const day = pathParts.at(-1).replace('.json', '');
    const key = `${PREFIX}/${year}/${month}/${day}.json`;

    const data = await readJSONViaFetch(key);
    if (!data) return notFound('ARTICLE_NOT_FOUND');
    return jsonOK(data);
  } catch (err) {
    console.error('[GET] articles/[year]/[month]/[day]', err);
    return notFound('ARTICLE_READ_ERROR');
  }
}
