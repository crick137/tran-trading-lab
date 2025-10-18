// api/daily-brief/[slug].js
import { writeJSON, readJSONViaFetch, deleteObject } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, methodNotAllowed } from '../_lib/http.js';

const PREFIX = 'daily-brief';
const INDEX = `${PREFIX}/index.json`;

function getSlugFromReq(req) {
  const url = new URL(req.url);
  // 形如 /api/daily-brief/2025-10-18.json
  const raw = url.pathname.split('/').pop() || '';
  return raw.replace(/\.json$/i, '').trim();
}

/** 将 slug 尝试按 YYYY-MM-DD 倒序排序；非该格式的保持相对顺序 */
function sortSlugsDesc(slugs) {
  const toKey = (s) => {
    // 只取前 10 位尝试匹配 YYYY-MM-DD
    const d = (s || '').slice(0, 10);
    // 有效的简单判断：4位年-2位月-2位日
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    // 不可排序的给极小键，放在末尾
    return '0000-00-00';
  };
  // 先去重再排序
  const uniq = Array.from(new Set(slugs.filter(Boolean)));
  return uniq.sort((a, b) => {
    const ka = toKey(a);
    const kb = toKey(b);
    // 时间新的在前
    if (ka === kb) return 0;
    return ka > kb ? -1 : 1;
  });
}

async function readIndexSafe() {
  try {
    const data = await readJSONViaFetch(INDEX);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function handler(req) {
  const slug = getSlugFromReq(req);
  if (!slug) return badRequest('MISSING_SLUG');

  // -------- GET: 公开读取 --------
  if (req.method === 'GET') {
    try {
      const data = await readJSONViaFetch(`${PREFIX}/${slug}.json`);
      return jsonOK(data);
    } catch {
      return badRequest('NOT_FOUND', 404);
    }
  }

  // -------- PUT: 写入/覆盖（需鉴权）--------
  if (req.method === 'PUT') {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    let incoming = null;
    try {
      incoming = await req.json();
    } catch {
      return badRequest('INVALID_JSON');
    }

    // 允许任意结构；但强制写入 slug 与 updatedAt
    const payload = {
      ...incoming,
      slug,
      updatedAt: new Date().toISOString(),
    };

    // 写正文
    await writeJSON(`${PREFIX}/${slug}.json`, payload);

    // 维护索引：置顶 + 尝试按日期倒序
    const idx = await readIndexSafe();
    const next = sortSlugsDesc([slug, ...idx]);

    await writeJSON(INDEX, next);

    return jsonOK({ ok: true, slug, path: `${PREFIX}/${slug}.json` });
  }

  // -------- DELETE: 删除（需鉴权）--------
  if (req.method === 'DELETE') {
    const unauthorized = requireAuth(req);
    if (unauthorized) return unauthorized;

    // 删除正文（不存在也不报错）
    try { await deleteObject(`${PREFIX}/${slug}.json`); } catch {}

    // 更新索引
    const idx = await readIndexSafe();
    const filtered = idx.filter(s => s !== slug);
    await writeJSON(INDEX, filtered);

    return jsonOK({ ok: true, deleted: slug });
  }

  // 其他方法：405
  return methodNotAllowed();
}
