// /api/market-news/index.js
import { readList, writeJSON } from '../_lib/blob.js';
import { jsonOK, badRequest, okOptions, methodNotAllowed } from '../_lib/http.js';

const PREFIX = 'market-news';
const INDEX  = `${PREFIX}/index.json`;

/** 将 id 尝试按“日期开头”的形式倒序；否则自然排在后面 */
function sortIdsDesc(ids) {
  const toKey = (s) => {
    const d = String(s || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '0000-00-00';
  };
  const uniq = Array.from(new Set((ids || []).filter(Boolean)));
  return uniq.sort((a, b) => (toKey(a) > toKey(b) ? -1 : toKey(a) < toKey(b) ? 1 : 0));
}

/** 从实际 Blob 目录重建索引，避免脏/重复 */
async function rebuildIndex() {
  const list = await readList(`${PREFIX}/`);
  const items = list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
    .map(b => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''));
  return sortIdsDesc(items);
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
      console.error('[GET] market-news/index', err);
      return badRequest('INDEX_READ_ERROR', 500);
    }
  }

  // 可选：手动重建并写回 index.json（脚本或面板触发）
  if (method === 'POST') {
    try {
      const items = await rebuildIndex();
      await writeJSON(INDEX, items);
      return jsonOK({ ok: true, total: items.length, index: items });
    } catch (err) {
      console.error('[POST] market-news/index', err);
      return badRequest('INDEX_REBUILD_ERROR', 500);
    }
  }

  return methodNotAllowed();
}
