// api/_lib/http.js

// 统一 JSON 成功返回
export function jsonOK(data = {}, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

// 统一错误返回（JSON）
export function badRequest(error = 'BAD_REQUEST', status = 400, headers = {}) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

// 去掉发布口令/鉴权 —— 永远放行
export function requireAuth(_req) {
  return null; // 永远允许
}

/* 如果你将来想恢复“有环境变量才鉴权”，用这个替换上面的 requireAuth：

export function requireAuth(req) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const AUTH_SECRET    = process.env.AUTH_SECRET || '';
  if (!ADMIN_PASSWORD && !AUTH_SECRET) return null; // 未配置→放行

  // 例如简单 Bearer 校验（按需改写）
  const auth = req.headers.get('authorization') || '';
  const ok = auth === `Bearer ${AUTH_SECRET}`;
  if (!ok) return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), {
    status: 401, headers: { 'content-type': 'application/json; charset=utf-8' }
  });
  return null;
}
*/
