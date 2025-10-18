// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

/**
 * 读取环境里的 RW Token（如果没绑定 Store 时做后备）
 */
function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN || undefined;
}

/**
 * 写入 JSON 到 Vercel Blob
 * - 优先使用绑定的 Store
 * - 若未绑定，则尝试使用环境变量 BLOB_READ_WRITE_TOKEN
 */
export async function writeJSON(pathname, data) {
  try {
    const body = JSON.stringify(data, null, 2);
    const res = await put(pathname, body, {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      token: getToken() // 没有绑定 Store 时启用
    });
    return res;
  } catch (e) {
    console.error('[blob.writeJSON] fail:', e);
    throw e;
  }
}

/**
 * 删除对象
 */
export async function deleteObject(pathname) {
  try {
    return await del(pathname, { token: getToken() });
  } catch (e) {
    console.error('[blob.deleteObject] fail:', e);
    throw e;
  }
}

/**
 * 读取 JSON：先 list 找 URL，再 fetch
 * - 若文件不存在，抛 NOT_FOUND
 * - 若取回失败，抛 FETCH_FAILED
 */
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
    // 让上层能通过 message 区分 NOT_FOUND / FETCH_FAILED
    if (e && e.message) throw e;
    console.error('[blob.readJSONViaFetch] fail:', e);
    throw new Error('FETCH_FAILED');
  }
}

/**
 * 按前缀列出（返回 items.blobs 数组）
 */
export async function listByPrefix(prefix) {
  const it = await list({ prefix, token: getToken() });
  return it?.blobs ?? [];
}
