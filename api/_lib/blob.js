// api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

export async function writeJSON(path, data) {
  const body = JSON.stringify(data, null, 2);
  // public 方便前端直接 GET 读取；也可改成 'private'
  const { url, pathname } = await put(path, body, {
    access: 'public',
    contentType: 'application/json; charset=utf-8',
  });
  return { url, pathname };
}

export async function readList(prefix) {
  // 列出某目录下的所有对象
  const { blobs } = await list({ prefix });
  return blobs;
}

export async function deleteObject(path) {
  // 删除单个对象
  await del(path);
}

export async function readJSONViaFetch(publicPath) {
  // public 对象可以直接 fetch
  const res = await fetch(`https://blob.vercel-storage.com/${publicPath}`);
  if (!res.ok) throw new Error('NOT_FOUND');
  return res.json();
}
