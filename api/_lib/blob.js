// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

// Tunables with sensible defaults; override via env in deployment
const OP_TIMEOUT = Number(process.env.BLOB_OP_TIMEOUT_MS || 4000); // ms
const OP_RETRIES = Number(process.env.BLOB_OP_RETRIES || 2);
const OP_RETRY_DELAY_MS = Number(process.env.BLOB_OP_RETRY_DELAY_MS || 500);

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN || undefined;
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

// 添加超时函数
function timeoutPromise(promise, ms) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
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

// 添加重试机制
async function withRetry(operation, maxRetries = OP_RETRIES, delay = OP_RETRY_DELAY_MS) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`[Blob] Attempt ${i+1} of ${maxRetries}`);
      return await operation();
    } catch (error) {
      console.warn(`[Blob] Attempt ${i+1} failed:`, error.message);
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export async function writeJSON(pathname, data, opts = {}) {
  try {
    console.log(`[Blob] Writing to ${pathname}`);
    const body = JSON.stringify(data, null, 2);
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const res = await withRetry(() =>
      timeoutPromise(
        put(pathname, body, {
          access: 'public',
          contentType: 'application/json; charset=utf-8',
          token: requireToken()
        }),
        timeout
      )
    , retries, retryDelay);
    console.log(`[Blob] Write successful: ${pathname}`);
    return res;
  } catch (e) {
    console.error('[Blob] Write failed:', e);
    throw e;
  }
}

// 其他函数也类似添加超时、重试和日志记录
export async function deleteObject(pathname, opts = {}) {
  try {
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    return await withRetry(() =>
      timeoutPromise(
        del(pathname, { token: requireToken() }),
        timeout
      )
    , retries, retryDelay);
  } catch (e) {
    console.error('[blob.deleteObject] fail:', e);
    throw e;
  }
}

export async function readJSONViaFetch(pathname, opts = {}) {
  try {
    const token = requireToken();
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const dir = pathname.includes('/')
      ? pathname.slice(0, pathname.lastIndexOf('/') + 1)
      : '';

    const items = await withRetry(() =>
      timeoutPromise(
        list({ prefix: dir, token }),
        timeout
      )
    , retries, retryDelay);
    
    const hit = items?.blobs?.find(b => b.pathname === pathname);
    if (!hit) throw new Error('NOT_FOUND');

    const r = await withRetry(() =>
      timeoutPromise(
        fetch(hit.url, { cache: 'no-store' }),
        timeout
      )
    , retries, retryDelay);
    
    if (!r.ok) throw new Error('FETCH_FAILED');
    return await r.json();
  } catch (e) {
    if (e && e.message) throw e;
    console.error('[blob.readJSONViaFetch] fail:', e);
    throw new Error('FETCH_FAILED');
  }
}

export async function listByPrefix(prefix, opts = {}) {
  try {
    const timeout = Number(opts.timeoutMs || OP_TIMEOUT);
    const retries = Number(opts.retries ?? OP_RETRIES);
    const retryDelay = Number(opts.retryDelayMs || OP_RETRY_DELAY_MS);
    const it = await withRetry(() =>
      timeoutPromise(
        list({ prefix, token: requireToken() }),
        timeout
      )
    , retries, retryDelay);
    return it?.blobs ?? [];
  } catch (e) {
    console.error('[blob.listByPrefix] fail:', e);
    return [];
  }
}

// ✅ 关键：把 SDK 的 list 也导出，供 app.js 作为后备调用
export { list };
