// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

export async function writeJSON(pathname, data) {
  const body = JSON.stringify(data, null, 2);
  const res = await put(pathname, body, {
    access: 'public',
    contentType: 'application/json; charset=utf-8'
  });
  return res;
}

export async function deleteObject(pathname) {
  return await del(pathname);
}

export async function readJSONViaFetch(pathname) {
  // 先列一下拿 URL
  const dir = pathname.includes('/') ? pathname.slice(0, pathname.lastIndexOf('/') + 1) : '';
  const items = await list({ prefix: dir });
  const hit = items.blobs.find(b => b.pathname === pathname);
  if (!hit) throw new Error('NOT_FOUND');
  const r = await fetch(hit.url, { cache: 'no-store' });
  if (!r.ok) throw new Error('FETCH_FAILED');
  return await r.json();
}

export async function listByPrefix(prefix) {
  const it = await list({ prefix });
  return it.blobs;
}