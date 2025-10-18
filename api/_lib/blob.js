// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

/** 统一加上可选 Token（本地或未自动注入时用） */
function baseOptions() {
  return process.env.BLOB_READ_WRITE_TOKEN
    ? { token: process.env.BLOB_READ_WRITE_TOKEN }
    : {};
}

/** 规范化路径：去掉开头的 /，避免 put 报错 */
function normalize(pathname = '') {
  return pathname.replace(/^\/+/, '');
}

/** 写 JSON：公开可读，返回 { url, pathname } */
export async function writeJSON(pathname, data) {
  const key = normalize(pathname);
  const body = JSON.stringify(data, null, 2);

  const res = await put(key, body, {
    ...baseOptions(),
    access: 'public', // 让前台能直接 GET
    contentType: 'application/json'
  });

  // 统一返回，便于调试
  return { url: res.url, pathname: key };
}

/** 直接通过公共域名读取（无需 list()）：快、可靠 */
export async function readJSONViaFetch(pathname) {
  const key = normalize(pathname);
  const url = `https://public.blob.vercel-storage.com/${key}`;

  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) {
    // 404 => NOT_FOUND，其他 => FETCH_FAILED
    if (r.status === 404) throw new Error(`NOT_FOUND: ${key}`);
    throw new Error(`FETCH_FAILED: ${key} [${r.status}]`);
  }
  return await r.json();
}

/** 删除对象（需要 RW 权限） */
export async function deleteObject(pathname) {
  const key = normalize(pathname);
  return await del(key, baseOptions());
}

/** 前缀列举（需要 RW 或项目已注入权限） */
export async function listByPrefix(prefix = '') {
  const it = await list({ prefix: normalize(prefix) }, baseOptions());
  return it.blobs; // [{ pathname, size, uploadedAt, url, ... }]
}

/** （可选）判断是否存在：用 HEAD，不走 list() */
export async function exists(pathname) {
  const key = normalize(pathname);
  const url = `https://public.blob.vercel-storage.com/${key}`;
  const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
  return r.ok;
}
