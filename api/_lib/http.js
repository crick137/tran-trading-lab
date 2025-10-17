// /api/_lib/http.js
import crypto from 'crypto';

const COOKIE_NAME    = 'tran_admin_token';
const ADMIN_TOKEN    = process.env.ADMIN_TOKEN || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AUTH_SECRET    = process.env.AUTH_SECRET || 'please-change-me';

function hmac(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(req) {
  const header = (req.headers?.get?.('cookie')) || req.headers?.cookie || '';
  const out = {};
  header.split(';').map(s => s.trim()).forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1));
  });
  return out;
}

export function withCORS(init = {}) {
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'authorization,content-type,x-auth',
    ...(init.headers || {}),
  };
  return { ...init, headers };
}

export function jsonOK(data, init = {}) {
  return new Response(JSON.stringify(data), withCORS({
    status: init.status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) }
  }));
}

export function badRequest(message = 'BAD_REQUEST', status = 400) {
  return new Response(JSON.stringify({ error: message }), withCORS({
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  }));
}

export function requireAuth(req) {
  if (req.method === 'OPTIONS') return null;

  // Bearer 令牌
  let header = req.headers?.get?.('authorization') || req.headers?.authorization || '';
  let token = '';
  if (header && /^Bearer\s+/i.test(header)) token = header.replace(/^Bearer\s+/i, '').trim();

  // x-auth 兜底
  if (!token) {
    const x = req.headers?.get?.('x-auth') || req.headers?.['x-auth'] || req.headers?.['X-AUTH'];
    if (x) token = String(x).trim();
  }

  // Cookie（基于 ADMIN_PASSWORD 的 HMAC）
  const cookies = parseCookies(req);
  const cookieVal = cookies[COOKIE_NAME];
  const validCookie = cookieVal && ADMIN_PASSWORD ? cookieVal === hmac(ADMIN_PASSWORD, AUTH_SECRET) : false;

  const allowDev = !ADMIN_TOKEN && !ADMIN_PASSWORD && (process.env.NODE_ENV !== 'production');
  const ok = allowDev || (ADMIN_TOKEN && token === ADMIN_TOKEN) || validCookie;

  if (!ok) return badRequest('Unauthorized', 401);
  return null;
}

export function issueLoginCookie(password) {
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return { ok: false, setCookie: null };
  const val = hmac(ADMIN_PASSWORD, AUTH_SECRET);
  const cookie = `${COOKIE_NAME}=${encodeURIComponent(val)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*7}`;
  return { ok: true, setCookie: cookie };
}

export function clearLoginCookie() {
  const expired = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  return expired;
}
