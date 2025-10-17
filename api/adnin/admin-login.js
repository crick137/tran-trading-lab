// /api/admin/login.js
import crypto from 'crypto';

const COOKIE_NAME = 'tran_admin_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 天

function makeToken(password, secret) {
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(405).send(JSON.stringify({ error: 'Method not allowed' }));
  }

  // 解析 JSON body（兼容纯文本和对象）
  let body = {};
  try {
    body = typeof req.body === 'object' && req.body !== null
      ? req.body
      : JSON.parse(req.body || '{}');
  } catch {}

  const password = body?.password || '';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const AUTH_SECRET = process.env.AUTH_SECRET || 'please-change-me';

  if (!ADMIN_PASSWORD) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(500).send(JSON.stringify({ error: 'Server misconfigured' }));
  }

  if (password !== ADMIN_PASSWORD) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(401).send(JSON.stringify({ error: '密码错误' }));
  }

  const token = makeToken(ADMIN_PASSWORD, AUTH_SECRET);
  const cookieParts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    `Max-Age=${TOKEN_TTL_SECONDS}`,
    `Expires=${new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toUTCString()}`,
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : null,
  ].filter(Boolean);

  res.setHeader('set-cookie', cookieParts.join('; '));
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  return res.status(200).send(JSON.stringify({ ok: true }));
}
