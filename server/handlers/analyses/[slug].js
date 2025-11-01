// runtime: nodejs（需要 BLOB_READ_WRITE_TOKEN）
// 功能：GET 取文档、PUT 新建/更新文档（slug 规范化）并强制重建 index、DELETE 删除（双路径尝试）并强制重建 index
export const config = { runtime: 'nodejs' };

import { del, list } from '@vercel/blob';
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const PREFIX = 'analyses';
const INDEX  = `${PREFIX}/index.json`;

const normalizeSlug = (s='') => String(s).trim().replace(/[\\/]+/g, '-');

async function rebuildIndexFromStorage(){
  const it = await list({ prefix: `${PREFIX}/` });
  const slugs = (it?.blobs||[])
    .map(b => b.pathname)
    .filter(p => p.startsWith(`${PREFIX}/`) && p.endsWith('.json') && p !== INDEX)
    .map(p => p.slice(PREFIX.length + 1, -'.json'.length))
    .sort((a,b)=> (a>b?-1:1)); // 倒序
  await writeJSON(INDEX, slugs);
  return slugs;
}

export async function GET(req, { params }) {
  const slugRaw = params?.slug || '';
  const slug = slugRaw.replace(/\.json$/i, '');
  if (!slug) return badRequest('INVALID_SLUG', 400);

  try{
    // 先试原始，再试规范化后的
    try {
      const doc = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
      return jsonOK(doc ?? {});
    } catch {
      const safe = normalizeSlug(slug);
      const doc2 = await readJSONViaFetch(`${PREFIX}/${safe}.json`);
      return jsonOK(doc2 ?? {});
    }
  }catch(e){
    return badRequest('NOT_FOUND', 404);
  }
}

export async function PUT(req, { params }) {
  const slugRaw = params?.slug || '';
  const slug = slugRaw.replace(/\.json$/i, '');
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try{
    const payload = await req.json();
    const safe = normalizeSlug(slug);

    // 统一写入规范化后的路径
    await writeJSON(`${PREFIX}/${safe}.json`, payload);

    // 最稳妥：发布后强制重建索引（避免历史脏数据残留）
    await rebuildIndexFromStorage();

    return jsonOK({ ok:true, slug: safe });
  }catch(err){
    console.error(`[PUT] ${PREFIX}/${slug}`, err);
    return badRequest('PUT_ERROR', 500);
  }
}

export async function DELETE(req, { params }) {
  const slugRaw = params?.slug || '';
  const slug = slugRaw.replace(/\.json$/i, '');
  if (!slug) return badRequest('MISSING_SLUG', 400);

  try{
    // 同时尝试删除原始与规范化两种路径
    const candidates = new Set([
      `${PREFIX}/${slug}.json`,
      `${PREFIX}/${normalizeSlug(slug)}.json`,
    ]);
    let deletedAny = false;
    for (const key of candidates) {
      try { await del(key); deletedAny = true; } catch {}
    }

    // 强制重建索引，确保前台列表立刻同步
    const items = await rebuildIndexFromStorage();

    return jsonOK({ ok:true, slug, deleted: deletedAny, indexCount: items.length });
  }catch(err){
    console.error(`[DELETE] ${PREFIX}/${slug}`, err);
    return badRequest('DELETE_ERROR', 500);
  }
}
