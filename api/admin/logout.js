export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // 清 Cookie
  res.setHeader('Set-Cookie', [
    'tran_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure'
  ]);
  return res.status(200).json({ ok: true });
}
