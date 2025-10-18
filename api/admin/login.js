export const config = { runtime: 'nodejs' };

function readJSON(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD_NOT_SET' });
  }

  const { password = '' } = await readJSON(req);
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'INVALID_PASSWORD' });
  }

  // 登录成功，发会话 Cookie（30 天）
  const cookie = [
    `tran_admin=ok`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${60 * 60 * 24 * 30}`,
    `Secure`,
  ].join('; ');
  res.setHeader('Set-Cookie', cookie);

  return res.status(200).json({ ok: true });
}
