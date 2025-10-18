// api/_lib/http.js
// 统一的 JSON 响应与鉴权工具（适配 Vercel Edge/Node 运行时）

/** 构造 JSON Response（200） */
export function jsonOK(data, init = {}) {
  return new Response(JSON.stringify(data ?? {}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    },
    ...init
  });
}

/** 构造错误 JSON Response（默认 400） */
export function badRequest(message = 'BAD_REQUEST', status = 400, init = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    },
    ...init
  });
}

/** 404 */
export function notFound(message = 'NOT_FOUND', init = {}) {
  return badRequest(message, 404, init);
}

/** 405 */
export function methodNotAllowed(message = 'METHOD_NOT_ALLOWED', init = {}) {
  return badRequest(message, 405, init);
}

/** 读取 Bearer Token（返回纯 token 字符串或空字符串） */
export function getBearerToken(req) {
  try {
    const h = req?.headers?.get?.('authorization') || req?.headers?.get?.('Authorization') || '';
    if (!h) return '';
    if (/^bearer\s/i.test(h)) return h.replace(/^bearer\s/i, '').trim();
    // 兼容 "Authorization: <token>" 的非常规写法
    return h.trim();
  } catch {
    return '';
  }
}

/**
 * 鉴权：
 * - 从 Authorization: Bearer <token> 读取
 * - 与 process.env.ADMIN_PASSWORD 匹配
 * - 若设置了 ALLOW_PUBLISH=true 或 PUBLISH_NO_AUTH=true 则跳过鉴权（仅开发/内网）
 * 返回 null 表示通过；返回 Response 表示未通过
 */
export function requireAuth(req) {
  try {
    // 开发便捷开关（生产不要开）
    if (
      (typeof process !== 'undefined' && process.env && (
        process.env.ALLOW_PUBLISH === 'true' ||
        process.env.PUBLISH_NO_AUTH === 'true'
      ))
    ) {
      return null; // bypass for dev
    }

    const ADMIN_PASSWORD =
      (typeof process !== 'undefined' && process.env && process.env.ADMIN_PASSWORD) || '';

    if (!ADMIN_PASSWORD) {
      // 为避免误放行，这里直接报 500；如需在本地无密码也能测试，可改成 return null;
      return badRequest('SERVER_NO_ADMIN_PASSWORD', 500);
    }

    const token = getBearerToken(req);
    if (!token || token !== ADMIN_PASSWORD) {
      return badRequest('UNAUTHORIZED', 401);
    }

    return null;
  } catch (err) {
    console.error?.('requireAuth error:', err);
    return badRequest('AUTH_ERROR', 500);
  }
}

/**
 * 可选：包装一个 handler，自动加上 CORS（如你需要跨域调用）
 * 用法：
 *   export default withCORS(async (req) => { ... })
 */
export function withCORS(handler, opts = {}) {
  const allowOrigin = opts.allowOrigin || '*';
  const allowHeaders = opts.allowHeaders || 'Content-Type, Authorization';
  const allowMethods = opts.allowMethods || 'GET,POST,PUT,DELETE,OPTIONS';

  return async function corsWrapped(req) {
    // 预检请求
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Headers': allowHeaders,
          'Access-Control-Allow-Methods': allowMethods
        }
      });
    }

    const res = await handler(req);
    // 补充 CORS 头
    const headers = new Headers(res.headers);
    headers.set('Access-Control-Allow-Origin', allowOrigin);
    headers.set('Access-Control-Allow-Headers', allowHeaders);
    headers.set('Access-Control-Allow-Methods', allowMethods);

    return new Response(res.body, {
      status: res.status,
      headers
    });
  };
}

/** （可选）安全解析 JSON 请求体 */
export async function readJSON(req, fallback = null) {
  try {
    return await req.json();
  } catch {
    return fallback;
  }
}
