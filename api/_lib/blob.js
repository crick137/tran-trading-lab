// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

/* ---------------- Tunables ---------------- */
const OP_TIMEOUT = Number(process.env.BLOB_OP_TIMEOUT_MS || 4000); // ms
const OP_RETRIES = Number(process.env.BLOB_OP_RETRIES || 2);
const OP_RETRY_DELAY_MS = Number(process.env.BLOB_OP_RETRY_DELAY_MS || 500);

/* ---------------- Token Utilities ---------------- */
function getToken() {
  const direct = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN;
  if (direct) return direct;
  try {
    for (const [k, v] of Object.entries(process.env || {})) {
      if (/_READ_WRITE_TOKEN$/i.test(k) && v) return v;
    }
  } catch {}
  return undefined;
}

function requireToken() {
  const t = getToken();
  if (!t) {
    const msg = '[Blob] Missing BLOB_READ_WRITE_TOKEN (or BLOB_RW_TOKEN)';
    console.error(msg);
    throw new Error('BLOB_TOKEN_MISSING');
  }
  return t;
}

/* ---------------- Helpers ---------------- */
function timeoutPromise(promise, ms) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    promise
      .then((res) => {
        clearTimeout(timeoutId);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

async function withRetry(operation, maxRetries = OP_RETRIES, delay = OP_RETRY_DELAY_MS) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) console.log(`[Blob] Retry ${i + 1}/${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`[Blob] Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

/* ---------------- Core Ops ---------------- */

// 写入 JSON 文件
export async function writeJSON(pathname, data, opts = {}) {
  try {
    console.log(`[Blob] Writing to ${pathname}`);
    const body = JSON.stringify(data, null, 2);
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const res = await withRetry(
      () =>
        timeoutPromise(
          put(pathname, body, {
            access: 'public',
            contentType: 'application/json; charset=utf-8',
            token: requireToken(),
          }),
          timeout
        ),
      retries,
      retryDelay
    );
    console.log(`[Blob] Write successful: ${pathname}`);
    return res;
  } catch (e) {
    console.error('[Blob] Write failed:', e);
    throw e;
  }
}

// 删除单个文件
export async function deleteObject(pathname, opts = {}) {
  try {
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const res = await withRetry(
      () =>
        timeoutPromise(
          del(pathname, { token: requireToken() }),
          timeout
        ),
      retries,
      retryDelay
    );
    console.log(`[Blob] Deleted: ${pathname}`);
    return res;
  } catch (e) {
    console.error('[Blob] Delete failed:', e);
    throw e;
  }
}

// ⚙️ 为旧逻辑提供兼容别名
export { deleteObject as del };

// 从远程读取 JSON 文件
export async function readJSONViaFetch(pathname, opts = {}) {
  try {
    const token = requireToken();
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);

    const dir = pathname.includes('/')
      ? pathname.slice(0, pathname.lastIndexOf('/') + 1)
      : '';

    const items = await withRetry(
      () => timeoutPromise(list({ prefix: dir, token }), timeout),
      retries,
      retryDelay
    );

    const hit = items?.blobs?.find((b) => b.pathname === pathname);
    if (!hit) throw new Error('NOT_FOUND');

    const r = await withRetry(
      () => timeoutPromise(fetch(hit.url, { cache: 'no-store' }), timeout),
      retries,
      retryDelay
    );

    if (!r.ok) throw new Error('FETCH_FAILED');
    return await r.json();
  } catch (e) {
    console.error('[Blob] readJSONViaFetch error:', e.message);
    throw e;
  }
}

// 按前缀列出文件
export async function listByPrefix(prefix, opts = {}) {
  try {
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const it = await withRetry(
      () => timeoutPromise(list({ prefix, token: requireToken() }), timeout),
      retries,
      retryDelay
    );
    return it?.blobs ?? [];
  } catch (e) {
    console.error('[Blob] listByPrefix fail:', e);
    return [];
  }
}

// 直接导出 list() 以便外部使用
export { list };

// 根据 URL 删除（用于异步上传后立即清理）
export async function deleteByUrl(url, opts = {}) {
  try {
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const res = await withRetry(
      () =>
        timeoutPromise(
          del(url, { token: requireToken() }),
          timeout
        ),
      retries,
      retryDelay
    );
    console.log(`[Blob] Deleted by URL: ${url}`);
    return res;
  } catch (e) {
    console.error('[Blob] deleteByUrl fail:', e);
    throw e;
  }
}
