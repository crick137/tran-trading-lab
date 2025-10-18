// api/daily-brief/index.js
import { readList, writeJSON } from '../_lib/blob.js';
import { jsonOK, badRequest, okOptions, methodNotAllowed } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX  = `${PREFIX}/index.json`;

/** 将 slug 尝试按 YYYY-MM-DD 倒序；非日期格式自然排在后面 */
function sortSlugsDesc(slugs) {
  const toKey = (s) => {
    const d = String(s || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '0000-00-00';
  };
  const uniq = Array.from(new Set((slugs || []).filter(Boolean)));
  return uniq.sort((a, b) => (toKey(a) > toKey(b) ? -1 : toKey(a) < toKey(b) ? 1 : 0));
}

/** 从实际 Blob 目录重建索引 */
async function rebuildIndex() {
  const list = await readList(`${PREFIX}/`);
  const items = list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
    .map(b => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''));
  return sortSlugsDesc(items);
}

export default async function handler(req) {
  const { method } = req;

  // CORS 预检
  if (method === 'OPTIONS') return okOptions();

  if (method === 'GET') {
    try {
      const items = await rebuildIndex();
      return jsonOK(items);
    } catch (err) {
      console.error('[GET] daily-brief/index', err);
      return badRequest('INDEX_READ_ERROR', 500);
    }
  }

  // 可选：手动重建并回写 /daily-brief/index.json
  if (method === 'POST') {
    try {
      const items = await rebuildIndex();
      await writeJSON(INDEX, items);
      return jsonOK({ ok: true, total: items.length, index: items });
    } catch (err) {
      console.error('[POST] daily-brief/index', err);
      return badRequest('INDEX_REBUILD_ERROR', 500);
    }
  }

  return methodNotAllowed();
}
