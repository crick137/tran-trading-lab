// api/analyses/index.js
import { readList, writeJSON } from '../_lib/blob.js';
import { jsonOK, badRequest, okOptions, methodNotAllowed } from '../_lib/http.js';

const PREFIX = 'analyses';
const INDEX  = `${PREFIX}/index.json`;

/** 统一从实际文件重建索引，避免重复/脏数据 */
async function rebuildIndex() {
  const list = await readList(`${PREFIX}/`);
  return list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
    .map(b => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''))
    .sort((a, b) => (a > b ? -1 : 1)); // 逆序：新在前
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
      console.error(`[GET] ${PREFIX}/index`, err);
      return badRequest('INDEX_READ_ERROR', 500);
    }
  }

  // 可选：手动重建并写回 index.json（前端或脚本触发）
  if (method === 'POST') {
    try {
      const items = await rebuildIndex();
      await writeJSON(INDEX, items);
      return jsonOK({ ok: true, total: items.length, index: items });
    } catch (err) {
      console.error(`[POST] ${PREFIX}/index`, err);
      return badRequest('INDEX_REBUILD_ERROR', 500);
    }
  }

  return methodNotAllowed();
}
