// api/research/syllabus.js —— 无鉴权：GET / POST / PUT，同文件
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, okOptions, methodNotAllowed, readBody } from '../_lib/http.js';

const FILE = 'research/syllabus.json';

// 预检（CORS）
export async function OPTIONS() {
  return okOptions();
}

// 读取
export async function GET() {
  try {
    const data = await readJSONViaFetch(FILE);
    return jsonOK(data, { headers: { 'cache-control': 'no-store' } });
  } catch {
    // 文件不存在时返回空数组结构
    return jsonOK({ syllabus: [] }, { headers: { 'cache-control': 'no-store' } });
  }
}

// 写入（POST 与 PUT 等价）
export async function POST(req) {
  try {
    const body = await readBody(req, {});
    const syllabus = Array.isArray(body?.syllabus) ? body.syllabus : null;
    if (!Array.isArray(syllabus)) return badRequest('INVALID_SYLLABUS_ARRAY', 400);

    await writeJSON(FILE, { syllabus, updatedAt: new Date().toISOString() });
    return jsonOK({ ok: true }, { headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    console.error('[POST syllabus] error:', err);
    return badRequest('POST_ERROR', 500);
  }
}

export async function PUT(req) {
  return POST(req);
}

// 兼容默认导出（若运行时仍走 default）
export default async function handler(req) {
  const m = req.method?.toUpperCase();
  if (m === 'OPTIONS') return OPTIONS(req);
  if (m === 'GET')     return GET(req);
  if (m === 'POST')    return POST(req);
  if (m === 'PUT')     return PUT(req);
  return methodNotAllowed();
}
