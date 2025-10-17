// /api/research/syllabus.js
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, withCORS } from '../_lib/http.js';

const PATH = 'research/syllabus.json';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));

  if (req.method === 'GET') {
    try {
      const j = await readJSONViaFetch(PATH);
      return jsonOK(j);
    } catch {
      return jsonOK({ syllabus: [] });
    }
  }

  if (req.method === 'POST') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    let payload; try { payload = await req.json(); } catch { return badRequest('INVALID_JSON'); }
    const syllabus = Array.isArray(payload?.syllabus) ? payload.syllabus : null;
    if (!Array.isArray(syllabus)) return badRequest('SYLLABUS_MUST_BE_ARRAY');
    await writeJSON(PATH, { syllabus });
    return jsonOK({ ok: true });
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
