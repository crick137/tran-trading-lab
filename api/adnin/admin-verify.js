// /api/admin/verify.js
import crypto from 'crypto';

const COOKIE_NAME = 'tran_admin_token';

function makeToken(password, secret) {
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  const jar = {};
  raw.split(';').forEach(pair => {
    const i = pair.indexOf('=');
    if (i > 0) {
      const k = pair.slice(0, i).trim();
      const v = pair.slice(i + 1).trim();
      if (k) jar[k] = v;
    }
  });
  return jar;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(405).send(JSON.stringify({ error: 'Method not allowed' }));
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const AUTH_SECRET = process.env.AUTH_SECRET || 'please-change-me';

  if (!ADMIN_PASSWORD) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(500).send(JSON.stringify({ error: 'Server misconfigured' }));
  }

  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  const expected = makeToken(ADMIN_PASSWORD, AUTH_SECRET);

  if (token && token === expected) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(200).send(JSON.stringify({ ok: true }));
  }

  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  return res.status(401).send(JSON.stringify({ error: '未授权' }));
}
