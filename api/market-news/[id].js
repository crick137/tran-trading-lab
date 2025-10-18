// /api/market-news/[id].js
import { writeJSON, deleteObject, readJSONViaFetch } from '../_lib/blob.js';
import {
  jsonOK, badRequest, okOptions, methodNotAllowed, readBody
} from '../_lib/http.js';

const PREFIX = 'market-news';

function getId(req) {
  const raw = new URL(req.url).pathname.split('/').pop() || '';
  return raw.replace(/\.json$/i, '').trim();
}

// --- CORS 预检 ---
export async function OPTIONS() {
  return okOptions();
}

// --- 读取单条 ---
export async function GET(req) {
  const id = getId(req);
  if (!id) return badRequest('MISSING_ID', 400);

  try {
    const data = await readJSONViaFetch(`${PREFIX}/${id}.json`);
    return jsonOK(data);
  } catch {
    return badRequest('NOT_FOUND', 404);
  }
}

// --- 新建（与 PUT 等价）---
export async function POST(req) {
  return PUT(req);
}

// --- 写入/覆盖单条 ---
export async function PUT(req) {
  const id = getId(req);
  if (!id) return badRequest('MISSING_ID', 400);

  const payload = await readBody(req, null);
  if (!payload || typeof payload !== 'object') {
    return badRequest('INVALID_JSON', 400);
  }

  try {
    await writeJSON(`${PREFIX}/${id}.json`, payload);
    return jsonOK({ ok: true, id, path: `${PREFIX}/${id}.json` });
  } catch (e) {
    console.error('[PUT market-news]', e);
    return badRequest('WRITE_FAILED', 500);
  }
}

// --- 删除单条 ---
export async function DELETE(req) {
  const id = getId(req);
  if (!id) return badRequest('MISSING_ID', 400);

  try {
    await deleteObject(`${PREFIX}/${id}.json`);
    return jsonOK({ ok: true, deleted: id });
  } catch (e) {
    console.error('[DELETE market-news]', e);
    return badRequest('DELETE_FAILED', 500);
  }
}

// --- 兜底（兼容默认导出调用）---
export default async function handler(req) {
  const m = req.method?.toUpperCase();
  if (m === 'OPTIONS') return OPTIONS(req);
  if (m === 'GET')     return GET(req);
  if (m === 'POST')    return POST(req);
  if (m === 'PUT')     return PUT(req);
  if (m === 'DELETE')  return DELETE(req);
  return methodNotAllowed();
}
