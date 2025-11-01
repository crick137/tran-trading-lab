// runtime: nodejs（需要 BLOB_READ_WRITE_TOKEN）
// 功能：GET 取文档、PUT 新建/更新文档并维护 index、DELETE 删除并维护 index
export const config = { runtime: 'nodejs' };

import { del } from '@vercel/blob';
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const PREFIX = 'analyses';
const INDEX  = `${PREFIX}/index.json`;

// 把 slug 写入 index（去重，置顶，按字符串倒序兜底排序）
async function upsertIntoIndex(slug){
  let idx = [];
  try { const exist = await readJSONViaFetch(INDEX); if (Array.isArray(exist)) idx = exist; } catch {}
  const seen = new Set();
  const next = [slug, ...idx].filter(s=>{
    const key = (typeof s === 'string') ? s : (s?.slug || s?.id || '');
    if (!key || key === slug && seen.has(slug)) return false;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
  // 倒序（让“大的”在前），如果是日期/时间风格会更靠前
  next.sort((a,b)=> (a>b?-1:1));
  await writeJSON(INDEX, next);
  return next;
}

// 从 index 移除 slug
async function removeFromIndex(slug){
  let idx = [];
  try { const exist = await readJSONViaFetch(INDEX); if (Array.isArray(exist)) idx = exist; } catch {}
  const next = idx.filter(s => (typeof s === 'string') ? s !== slug : (s?.slug !== slug));
  await writeJSON(INDEX, next);
  return next;
}

export async function GET(req, { params }) {
  const slugRaw = params?.slug || '';
  const slug = slugRaw.replace(/\.json$/i, '');
  if (!slug) return badRequest('INVALID_SLUG', 400);

  try{
    // 直接读取 JSON 返回（不重定向，避免跨域/缓存问题）
    const doc = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
    if (!doc) return badRequest('NOT_FOUND', 404);
    return jsonOK(doc);
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
    // 写文档
    await writeJSON(`${PREFIX}/${slug}.json`, payload);
    // 维护索引
    await upsertIntoIndex(slug);
    return jsonOK({ ok:true, slug });
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
    await del(`${PREFIX}/${slug}.json`);
    await removeFromIndex(slug);
    return jsonOK({ ok:true, slug });
  }catch(err){
    console.error(`[DELETE] ${PREFIX}/${slug}`, err);
    return badRequest('DELETE_ERROR', 500);
  }
}
