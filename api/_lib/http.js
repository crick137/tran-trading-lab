// /api/_lib/http.js
import crypto from 'crypto';

const COOKIE_NAME      = 'tran_admin_token';
const ADMIN_TOKEN      = process.env.ADMIN_TOKEN || '';              // 兼容旧的 Bearer 口令
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD || '';           // 前置密码（登录遮罩）
const AUTH_SECRET      = process.env.AUTH_SECRET || 'please-change-me'; // Cookie 签名盐

function makeToken(password, secret) {
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

function parseCookies(req) {
  // 兼容 Web 标准 Request 和 Node 风格 headers
  const raw = req.headers?.get
    ? (req.headers.get('cookie') || '')
    : (req.headers.cookie || '');
  const jar = {};
  (raw || '').split(';').forEach(pair => {
    const i = pair.indexOf('=');
    if (i > 0) {
      const k = pair.slice(0, i).trim();
      const v = pair.slice(i + 1).trim();
      if (k) jar[k] = v;
    }
  });
  return jar;
}

/**
 * 双通道认证：
 *  - Cookie 校验：当配置了 ADMIN_PASSWORD & AUTH_SECRET 时生效
 *  - Bearer 校验：兼容你之前的 ADMIN_TOKEN 口令
 *
 * 用法保持不变：
 *   const unauthorized = requireAuth(req);
 *   if (unauthorized) return unauthorized;
 */
export function requireAuth(req) {
  // 1) Cookie 签名校验
  let cookieOK = false;
  if (ADMIN_PASSWORD && AUTH_SECRET) {
    const cookies  = parseCookies(req);
    const token    = cookies[COOKIE_NAME];
    const expected = makeToken(ADMIN_PASSWORD, AUTH_SECRET);
    cookieOK = !!token && token === expected;
  }

  // 2) Bearer ADMIN_TOKEN 兼容校验
  const authHeader = req.headers?.get
    ? (req.headers.get('authorization') || '')
    : (req.headers.authorization || '');
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const bearerOK = !!(m && ADMIN_TOKEN && m[1] === ADMIN_TOKEN);

  if (!(cookieOK || bearerOK)) {
    return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  return null; // 通过
}

export function jsonOK(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export function badRequest(msg = 'BAD_REQUEST', status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
