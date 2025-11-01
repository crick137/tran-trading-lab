// runtime: nodejs（需要 BLOB_READ_WRITE_TOKEN）
// 功能：GET 读取索引（若不存在则重建并写回）；POST 强制重建索引
export const config = { runtime: 'nodejs' };

import { list } from '@vercel/blob';
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest } from '../_lib/http.js';

const PREFIX = 'analyses';
const INDEX  = `${PREFIX}/index.json`;

async function computeSlugsFromStorage(){
  const it = await list({ prefix: `${PREFIX}/` });
  const slugs = (it?.blobs||[])
    .map(b => b.pathname)
    .filter(p => p.startsWith(`${PREFIX}/`) && p.endsWith('.json') && p !== INDEX)
    .map(p => p.slice(PREFIX.length + 1, -'.json'.length)) // remove "analyses/" and ".json"
    .sort((a,b)=> (a>b?-1:1)); // 倒序
  return slugs;
}

export async function GET() {
  try{
    // 先尝试读现有 index
    try{
      const exist = await readJSONViaFetch(INDEX);
      if (Array.isArray(exist)) return jsonOK(exist);
    }catch{}
    // 没有就重建并写回
    const slugs = await computeSlugsFromStorage();
    await writeJSON(INDEX, slugs);
    return jsonOK(slugs);
  }catch(err){
    console.error(`[GET] ${PREFIX}/index.json`, err);
    return badRequest('INDEX_READ_ERROR', 500);
  }
}

// 可选：手动重建索引（例如后台“刷新索引”按钮调用）
export async function POST() {
  try{
    const slugs = await computeSlugsFromStorage();
    await writeJSON(INDEX, slugs);
    return jsonOK({ ok:true, count: slugs.length, items: slugs });
  }catch(err){
    console.error(`[POST] ${PREFIX}/index.json`, err);
    return badRequest('POST_ERROR', 500);
  }
}
