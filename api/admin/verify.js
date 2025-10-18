export const config = { runtime: 'nodejs' };

function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  const map = Object.fromEntries(
    raw.split(';').map(s => s.trim().split('=').map(decodeURIComponent)).filter(a => a[0])
  );
  return map[name] || '';
}

export default async function handler(req, res) {
  // 允许 GET 与 HEAD
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authed = getCookie(req, 'tran_admin') === 'ok';
  return res.status(200).json({ authed });
}
