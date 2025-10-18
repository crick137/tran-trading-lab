// api/research/articles/index.js
import { readList, writeJSON } from '../../_lib/blob.js';
import { jsonOK, badRequest, okOptions, methodNotAllowed } from '../../_lib/http.js';

const PREFIX = 'research/articles';
const INDEX  = `${PREFIX}/index.json`;

/** 从实际 Blob 目录重建索引（按 slug 逆序，最新/字母后序在前） */
async function rebuildIndex() {
  const list = await readList(`${PREFIX}/`);
  return list
    .filter(b => b.pathname.endsWith('.json') && b.pathname !== INDEX)
    .map(b => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''))
    .sort((a, b) => (a > b ? -1 : 1));
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
      console.error('[GET] research/articles/index', err);
      return badRequest('INDEX_READ_ERROR', 500);
    }
  }

  // 手动重建并写回 index.json（可选，用于脚本或面板按钮）
  if (method === 'POST') {
    try {
      const items = await rebuildIndex();
      await writeJSON(INDEX, items);
      return jsonOK({ ok: true, total: items.length, index: items });
    } catch (err) {
      console.error('[POST] research/articles/index', err);
      return badRequest('INDEX_REBUILD_ERROR', 500);
    }
  }

  return methodNotAllowed();
}
