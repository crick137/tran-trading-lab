// /api/admin/verify.js
import { withCORS, jsonOK, requireAuth } from '../_lib/http.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));
  // 只检查 Cookie/Token 是否有效
  const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
  return jsonOK({ ok: true });
}
