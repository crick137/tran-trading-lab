// api/_lib/http.js
const ADMIN = process.env.ADMIN_TOKEN || '';

export function requireAuth(req) {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m || m[1] !== ADMIN) {
    return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return null; // ok
}

export function jsonOK(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json', ...init.headers },
  });
}

export function badRequest(msg = 'BAD_REQUEST', status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
