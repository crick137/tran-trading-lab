// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN || undefined;
}

export async function writeJSON(pathname, data) {
  try {
    const body = JSON.stringify(data, null, 2);
    const res = await put(pathname, body, {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      token: getToken()
    });
    return res;
  } catch (e) {
    console.error('[blob.writeJSON] fail:', e);
    throw e;
  }
}

export async function deleteObject(pathname) {
  try {
    return await del(pathname, { token: getToken() });
  } catch (e) {
    console.error('[blob.deleteObject] fail:', e);
    throw e;
  }
}

export async function readJSONViaFetch(pathname) {
  try {
    const dir = pathname.includes('/')
      ? pathname.slice(0, pathname.lastIndexOf('/') + 1)
      : '';

    const items = await list({ prefix: dir, token: getToken() });
    const hit = items?.blobs?.find(b => b.pathname === pathname);
    if (!hit) throw new Error('NOT_FOUND');

    const r = await fetch(hit.url, { cache: 'no-store' });
    if (!r.ok) throw new Error('FETCH_FAILED');
    return await r.json();
  } catch (e) {
    if (e && e.message) throw e;
    console.error('[blob.readJSONViaFetch] fail:', e);
    throw new Error('FETCH_FAILED');
  }
}

export async function listByPrefix(prefix) {
  const it = await list({ prefix, token: getToken() });
  return it?.blobs ?? [];
}

// ✅ 关键：把 SDK 的 list 也导出，供 app.js 作为后备调用
export { list };
