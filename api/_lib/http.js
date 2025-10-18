// api/_lib/http.js
// ✅ 无密码版：统一 JSON 响应 + CORS + 安全读 body
// - requireAuth 为 NO-OP，保证旧代码引用不报错
// - 提供 okOptions()/withCORS() 方便跨域与预检
// - 建议所有 API 在文件顶层：import { jsonOK, badRequest, readBody, okOptions } from '../_lib/http.js';

//
// ---------- 基础 JSON 响应 ----------
//
export function jsonOK(data, status = 200, init = {}) {
  return new Response(JSON.stringify(data ?? {}), {
    status,
    headers: corsHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
    ...init,
  });
}

export function badRequest(message = 'BAD_REQUEST', status = 400, init = {}) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: corsHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
    ...init,
  });
}

export function notFound(message = 'NOT_FOUND', init = {}) {
  return badRequest(message, 404, init);
}

export function methodNotAllowed(message = 'METHOD_NOT_ALLOWED', init = {}) {
  return badRequest(message, 405, init);
}

//
// ---------- CORS 工具 ----------
//
export function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extra,
  };
}

export function okOptions() {
  // 预检响应；有的浏览器/网关更喜欢 204，这里用 200 更直观
  return new Response(null, { status: 200, headers: corsHeaders() });
}

// 包装 handler 自动附加 CORS（可选）
export function withCORS(handler, opts = {}) {
  const allowOrigin  = opts.allowOrigin  ?? '*';
  const allowHeaders = opts.allowHeaders ?? 'Content-Type, Authorization';
  const allowMethods = opts.allowMethods ?? 'GET,POST,PUT,DELETE,OPTIONS';

  return async function corsWrapped(req) {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Headers': allowHeaders,
          'Access-Control-Allow-Methods': allowMethods,
        },
      });
    }

    const res = await handler(req);
    const headers = new Headers(res.headers);
    headers.set('Access-Control-Allow-Origin', allowOrigin);
    headers.set('Access-Control-Allow-Headers', allowHeaders);
    headers.set('Access-Control-Allow-Methods', allowMethods);

    return new Response(res.body, { status: res.status, headers });
  };
}

//
// ---------- 请求体读取 ----------
//
export async function readBody(req, fallback = null) {
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await req.json();
    const text = await req.text();
    try { return JSON.parse(text); } catch { return { text }; }
  } catch {
    return fallback;
  }
}

// 兼容：旧代码仍可能 import { requireAuth } —— 这里提供 NO-OP，永远通过
export function requireAuth(_req) {
  return null; // 无密码，无鉴权
}