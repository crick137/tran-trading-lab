// /api/admin/logout.js
import { withCORS, jsonOK, clearLoginCookie } from '../_lib/http.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));
  if (req.method !== 'POST') return new Response('Method Not Allowed', withCORS({ status: 405 }));

  return new Response(JSON.stringify({ ok: true }), withCORS({
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': clearLoginCookie()
    }
  }));
}