// api/analyses/[slug].js
// 功能：读取/写入/删除单条 analyses/<slug>.json，并维护 analyses/index.json
// 依赖：@vercel/blob（list/put/del） + 本项目的 http 工具

import { list, put, del as blobDel } from '@vercel/blob';
import { jsonOK, badRequest, notFound, methodNotAllowed, readBody, okOptions } from '../_lib/http.js';

const PREFIX = 'analyses';
const KEY = (slug) => `${PREFIX}/${slug}.json`;
const INDEX_KEY = `${PREFIX}/index.json`;

// 维护索引：把 analyses/ 下所有 .json（排除 index.json）汇总为数组并倒序
async function updateIndex() {
  const it = await list({ prefix: `${PREFIX}/` });
  const items = it.blobs
    .filter((b) => b.pathname.endsWith('.json') && b.pathname !== INDEX_KEY)
    .map((b) => b.pathname.replace(`${PREFIX}/`, '').replace(/\.json$/i, ''))
    .sort((a, b) => (a > b ? -1 : 1));
  await put(INDEX_KEY, JSON.stringify(items, null, 2), {
    contentType: 'application/json; charset=utf-8',
  });
  return items;
}

// ========== 通用工具 ==========
function getSlugFromParams(req, params) {
  // Next.js App Router 会传 { params }；但为兼容性也从 URL 兜底
  const slug = params?.slug
    ?? new URL(req.url).pathname.split('/').pop()?.replace(/\.json$/i, '');
  return (slug || '').trim();
}

// ========== 预检 ==========
export async function OPTIONS() {
  return okOptions();
}

// ========== 读取 ==========
export async function GET(req, ctx = {}) {
  const slug = getSlugFromParams(req, ctx.params);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  const it = await list({ prefix: KEY(slug) });
  const file = it.blobs.find((b) => b.pathname === KEY(slug));
  if (!file) return notFound('NOT_FOUND');

  // 拉取远端 JSON 内容返回（避免 302，对前端更友好）
  try {
    const resp = await fetch(file.url, { cache: 'no-store' });
    if (!resp.ok) return notFound('NOT_FOUND');
    const data = await resp.json();
    return jsonOK(data);
  } catch {
    // 若远端读取失败，退回 302（可选逻辑）
    return Response.redirect(file.url, 302);
  }
}

// ========== 新建/更新 ==========
export async function POST(req, ctx = {}) {
  // 与 PUT 等价：写入 <slug>.json
  return PUT(req, ctx);
}

export async function PUT(req, ctx = {}) {
  const slug = getSlugFromParams(req, ctx.params);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  const body = await readBody(req, null);
  if (!body || typeof body !== 'object') {
    return badRequest('INVALID_JSON_BODY', 400);
  }

  try {
    await put(KEY(slug), JSON.stringify(body, null, 2), {
      contentType: 'application/json; charset=utf-8',
    });
    const idx = await updateIndex();
    return jsonOK({ ok: true, slug, total: idx.length });
  } catch (e) {
    console.error('PUT write error:', e);
    return badRequest('WRITE_FAILED', 500);
  }
}

// ========== 删除 ==========
export async function DELETE(req, ctx = {}) {
  const slug = getSlugFromParams(req, ctx.params);
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try {
    await blobDel(KEY(slug));
    const idx = await updateIndex();
    return jsonOK({ ok: true, deleted: slug, total: idx.length });
  } catch (e) {
    console.error('DELETE error:', e);
    return badRequest('DELETE_FAILED', 500);
  }
}

// ========== 兜底（仅防直调默认导出）==========
export default async function handler(req, ctx) {
  const m = req.method?.toUpperCase();
  if (m === 'GET') return GET(req, ctx);
  if (m === 'POST') return POST(req, ctx);
  if (m === 'PUT') return PUT(req, ctx);
  if (m === 'DELETE') return DELETE(req, ctx);
  if (m === 'OPTIONS') return OPTIONS(req, ctx);
  return methodNotAllowed();
}
