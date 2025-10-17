// /api/market-news/index.js
import { writeJSON, readJSONViaFetch } from '../_lib/blob.js';
import { jsonOK, badRequest, requireAuth, withCORS } from '../_lib/http.js';

const PREFIX = 'market-news';
const INDEX  = `${PREFIX}/index.json`;

function normalize(item) {
  return {
    id: item.id,
    title: item.title || '',
    source: item.source || '',
    url: item.url || '',
    date: item.date || new Date().toISOString(),
    tags: Array.isArray(item.tags) ? item.tags : [],
    summary: item.summary || '',
    bullets: Array.isArray(item.bullets) ? item.bullets : [],
  };
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', withCORS({ status: 204 }));

  // GET 列表
  if (req.method === 'GET') {
    try {
      const idx = await readJSONViaFetch(INDEX);
      return jsonOK(Array.isArray(idx) ? idx : []);
    } catch {
      return jsonOK([]); // 初次为空
    }
  }

  // POST 写入/更新一条并维护 index.json
  if (req.method === 'POST') {
    const unauthorized = requireAuth(req); if (unauthorized) return unauthorized;
    let payload; try { payload = await req.json(); } catch { return badRequest('INVALID_JSON'); }
    if (!payload || !payload.id) return badRequest('MISSING_ID');

    const item = normalize(payload);

    // 写正文
    await writeJSON(`${PREFIX}/${item.id}.json`, item);

    // 更新索引：去重，按 date 或 id 逆序
    let idx = [];
    try { idx = await readJSONViaFetch(INDEX); } catch {}
    idx = Array.isArray(idx) ? idx : [];
    const map = new Map(idx.map(x => [x.id || x, x]));
    map.set(item.id, { id: item.id, title: item.title, date: item.date });
    const newIdx = Array.from(map.values()).sort((a,b)=>{
      const da = new Date(a.date||a.id).getTime();
      const db = new Date(b.date||b.id).getTime();
      return isNaN(db-da) ? String(b.id).localeCompare(String(a.id)) : db - da;
    });
    await writeJSON(INDEX, newIdx);

    return jsonOK({ ok: true, id: item.id });
  }

  return badRequest('METHOD_NOT_ALLOWED', 405);
}
