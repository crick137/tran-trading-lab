import { put, list, del } from '@vercel/blob';

// Tunables...
const OP_TIMEOUT = Number(process.env.BLOB_OP_TIMEOUT_MS || 4000);
const OP_RETRIES = Number(process.env.BLOB_OP_RETRIES || 2);
const OP_RETRY_DELAY_MS = Number(process.env.BLOB_OP_RETRY_DELAY_MS || 500);

// ...前半部分保持不变...

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

// 兼容导出别名（修复 index.js import del）
export { deleteObject as del };

// ...其余 readJSONViaFetch、listByPrefix 保持不变...
