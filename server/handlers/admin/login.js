// /api/admin/login.js
import { withCORS, jsonOK, badRequest, issueLoginCookie } from '../_lib/http.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));

  if (req.method !== 'POST') return badRequest('METHOD_NOT_ALLOWED', 405);

  let payload = {};
  try { payload = await req.json(); } catch {}
  const pwd = (payload.password || '').trim();
  const { ok, setCookie } = issueLoginCookie(pwd);
  if (!ok) return badRequest('INVALID_PASSWORD', 401);

  return new Response(JSON.stringify({ ok: true }), withCORS({
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(setCookie ? { 'set-cookie': setCookie } : {})
    }
  }));
}