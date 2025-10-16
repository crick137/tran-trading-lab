// api/daily-brief/[slug].js
import { writeJSON, readJSONViaFetch, deleteObject } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX = `${PREFIX}/index.json`;

/**
 * Handler for /daily-brief/:slug.json
 * 支持 GET 和 DELETE
 *
 * 注意：在 edge runtime 中，req 是 Web Request-like 对象（含 req.url）
 */
export default async function handler(req) {
  try {
    const url = new URL(req.url);
    // pathname 可能是 /api/daily-brief/2025-10-01.json 或者 /daily-brief/2025-10-01.json
    // 取最后一个 path segment 并去掉 .json 后缀
    const parts = url.pathname.split('/');
    let last = parts.pop() || parts.pop(); // 处理末尾可能有空项
    if (!last) return badRequest('MISSING_SLUG');
    const slug = last.replace(/\.json$/i, '').trim();
    if (!slug) return badRequest('MISSING_SLUG');

    // ========== GET ==========
    if (req.method === 'GET') {
      try {
        const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
        return jsonOK(data);
      } catch (err) {
        // 读取不到正文时返回 404
        return badRequest('NOT_FOUND', 404);
      }
    }

    // ========== DELETE ==========
    if (req.method === 'DELETE') {
      // 认证（requireAuth 返回一个 Response-like 错误或 falsy）
      const unauthorized = requireAuth(req);
      if (unauthorized) return unauthorized;

      // 删除正文：如果 deleteObject 抛错则捕获并返回 500
      try {
        await deleteObject(`${PREFIX}/${slug}.json`);
      } catch (err) {
        console.error('deleteObject error:', err);
        return badRequest('DELETE_BODY_FAILED', 500);
      }

      // 更新 index.json：兼容 index 条目为 string 或 object 的情况
      try {
        let idx = [];
        try {
          idx = await readJSONViaFetch(INDEX);
        } catch (e) {
          // 读取不到 index.json 的情况：把 idx 保持为空数组
          idx = [];
        }

        if (!Array.isArray(idx)) idx = [];

        const filtered = idx.filter(item => {
          // item 可能是 "slug" 或 { slug: "slug", ... } 或其他结构
          if (typeof item === 'string') return item !== slug;
          if (item && typeof item === 'object') {
            // 尝试用 item.slug 或 item.id 或 item.name 等常见字段
            const candidate = (item.slug || item.id || item.name);
            if (typeof candidate === 'string') return candidate !== slug;
            // 如果无法确定则保留该条（避免误删）
            return true;
          }
          // 非标准项：保留（安全策略）
          return true;
        });

        // 只有在真正变化时才写回，减少无意义写操作
        const changed = filtered.length !== idx.length;
        if (changed) {
          try {
            await writeJSON(INDEX, filtered);
          } catch (err) {
            console.error('writeJSON index error:', err);
            // 已删除正文，但索引更新失败 —— 返回 500 并说明情况
            return badRequest('INDEX_UPDATE_FAILED', 500);
          }
        }

        return jsonOK({ ok: true, slug, deleted: true, indexUpdated: changed });
      } catch (err) {
        console.error('delete flow error:', err);
        return badRequest('DELETE_FAILED', 500);
      }
    }

    // 不支持的 method
    return badRequest('NOT_ALLOWED', 405);
  } catch (err) {
    console.error('handler top-level error:', err);
    return badRequest('INTERNAL_ERROR', 500);
  }
}

export const config = {
  runtime: 'edge',
};
