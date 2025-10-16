// api/_lib/blob.js (ESM)
import { put, list } from '@vercel/blob';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // Vercel 环境变量
if (!TOKEN) {
  console.warn('Missing BLOB_READ_WRITE_TOKEN (set in Vercel → Settings → Environment Variables)');
}

// 写入（公开可读）
export async function writeJSON(pathname, data) {
  const body = JSON.stringify(data, null, 2);
  const { url } = await put(pathname, body, {
    access: 'public',
    contentType: 'application/json; charset=utf-8',
    token: TOKEN
  });
  return url;
}

// 列表（按前缀）
export async function listByPrefix(prefix) {
  // @vercel/blob 的 pathname 形如 "folder/file.json"
  const out = [];
  let cursor;
  do {
    const resp = await list({ prefix, token: TOKEN, cursor });
    out.push(...resp.blobs);
    cursor = resp.cursor;
  } while (cursor);
  return out;
}

// 读 JSON（通过 blob 的公开 URL fetch）
export async function readJSONByUrl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Not Found');
  return r.json();
}

// 读 JSON（通过列出来的 pathname 获取 url 再读）
export async function readJSONByPath(prefix, name) {
  const files = await listByPrefix(prefix);
  const item = files.find(b => b.pathname === `${prefix}${name}`);
  if (!item) throw new Error('Not Found');
  return readJSONByUrl(item.url);
}

// 签名校验（简单 Bearer）
export function assertAuth(req) {
  const header = req.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  const ok = !!token && token === (process.env.ADMIN_TOKEN || '');
  if (!ok) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'content-type': 'application/json' }
    });
  }
  return null;
}

// 工具：按日期/时间降序排序
export function sortDescBy(a, b, key) {
  const va = a[key] || '';
  const vb = b[key] || '';
  return vb.localeCompare(va);
}
