// api/daily-brief/[slug].json.js
// 无密码 · GET 单条 / DELETE 单条 · 带 CORS 与 OPTIONS 预检

import { get, del } from '@vercel/blob';
import { jsonOK, badRequest, okOptions, methodNotAllowed } from '../_lib/http.js';

const DIR = 'daily-brief';

function getSlugFromUrl(url) {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/daily-brief\/(.+)\.json$/i);
    return m ? m[1] : '';
  } catch {
    return '';
  }
}

// 预检（CORS）
export async function OPTIONS() {
  return okOptions();
}

// 获取单条（给“昨日复用”或预览用）
export async function GET(req) {
  const slug = getSlugFromUrl(req.url);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try {
    const blob = await get(`${DIR}/${slug}.json`);
    if (!blob) return badRequest('NOT_FOUND', 404);

    const resp = await fetch(blob.url, { cache: 'no-store' });
    if (!resp.ok) return badRequest('NOT_FOUND', 404);

    const data = await resp.json();
    return jsonOK(data, { headers: { 'cache-control': 'no-store' } });
  } catch (e) {
    console.error('[GET daily-brief item] error:', e);
    return badRequest('READ_FAILED', 500);
  }
}

// 删除（“删除该日期”按钮调用）
export async function DELETE(req) {
  const slug = getSlugFromUrl(req.url);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try {
    await del(`${DIR}/${slug}.json`);
    return jsonOK({ ok: true, deleted: slug }, { headers: { 'cache-control': 'no-store' } });
  } catch (e) {
    console.error('[DELETE daily-brief item] error:', e);
    return badRequest('DELETE_FAILED', 500);
  }
}

// 兼容默认导出（若运行时仍走 default）
export default async function handler(req) {
  const m = req.method?.toUpperCase();
  if (m === 'OPTIONS') return OPTIONS(req);
  if (m === 'GET')     return GET(req);
  if (m === 'DELETE')  return DELETE(req);
  return methodNotAllowed();
}
