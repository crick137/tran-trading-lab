// api/research/syllabus.js  —— 无鉴权 GET/POST 同一文件
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const FILE = 'research/syllabus.json';

export default async function handler(req) {
  try {
    if (req.method === 'GET') {
      try {
        const data = await readJSONViaFetch(FILE);
        return jsonOK(data);
      } catch {
        return jsonOK({ syllabus: [] }); // 不存在则返回空数组
      }
    }

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        const syllabus = Array.isArray(body?.syllabus) ? body.syllabus : null;
        if (!Array.isArray(syllabus)) return badRequest('INVALID_SYLLABUS_ARRAY');
        await writeJSON(FILE, { syllabus, updatedAt: new Date().toISOString() });
        return jsonOK({ ok: true });
      } catch (err) {
        console.error('[POST syllabus] error:', err);
        return badRequest('POST_ERROR');
      }
    }

    return badRequest('METHOD_NOT_ALLOWED', 405);
  } catch (e) {
    console.error('[syllabus] server error:', e);
    return badRequest('SERVER_ERROR', 500);
  }
}
