// /api/admin/logout.js
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  const cookie = [
    'tran_admin_token=',
    'Path=/',
    'Max-Age=0',
    `Expires=${new Date(0).toUTCString()}`,
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : null,
  ].filter(Boolean).join('; ');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': cookie,
    },
  });
}
