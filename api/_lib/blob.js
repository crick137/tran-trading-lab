// /api/_lib/blob.js
import { put, list, del } from '@vercel/blob';

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_RW_TOKEN || undefined;
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
async function withRetry(operation, maxRetries = 3, delay = 1000) {
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

export async function writeJSON(pathname, data) {
  try {
    console.log(`[Blob] Writing to ${pathname}`);
    const body = JSON.stringify(data, null, 2);
    const res = await withRetry(() => 
      timeoutPromise(
        put(pathname, body, {
          access: 'public',
          contentType: 'application/json; charset=utf-8',
          token: getToken()
        }),
        10000 // 10秒超时
      )
    );
    console.log(`[Blob] Write successful: ${pathname}`);
    return res;
  } catch (e) {
    console.error('[Blob] Write failed:', e);
    throw e;
  }
}

// 其他函数也类似添加超时、重试和日志记录
export async function deleteObject(pathname) {
  try {
    return await withRetry(() => 
      timeoutPromise(
        del(pathname, { token: getToken() }),
        10000 // 10秒超时
      )
    );
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

    const items = await withRetry(() => 
      timeoutPromise(
        list({ prefix: dir, token: getToken() }),
        10000 // 10秒超时
      )
    );
    
    const hit = items?.blobs?.find(b => b.pathname === pathname);
    if (!hit) throw new Error('NOT_FOUND');

    const r = await withRetry(() => 
      timeoutPromise(
        fetch(hit.url, { cache: 'no-store' }),
        10000 // 10秒超时
      )
    );
    
    if (!r.ok) throw new Error('FETCH_FAILED');
    return await r.json();
  } catch (e) {
    if (e && e.message) throw e;
    console.error('[blob.readJSONViaFetch] fail:', e);
    throw new Error('FETCH_FAILED');
  }
}

export async function listByPrefix(prefix) {
  try {
    const it = await withRetry(() => 
      timeoutPromise(
        list({ prefix, token: getToken() }),
        10000 // 10秒超时
      )
    );
    return it?.blobs ?? [];
  } catch (e) {
    console.error('[blob.listByPrefix] fail:', e);
    return [];
  }
}

// ✅ 关键：把 SDK 的 list 也导出，供 app.js 作为后备调用
export { list };