// /api/news.js  —— Node.js Serverless (ESM) 完整版
// 功能：并发抓取多个 RSS 源，去重 + 时间排序，支持 limit/offset/sites/q 等参数

import Parser from 'rss-parser';

const FEEDS = [
  { site: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
  { site: 'Reuters',   url: 'https://feeds.reuters.com/reuters/businessNews' },
  { site: 'WSJ',       url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml' },
  { site: 'FT',        url: 'https://www.ft.com/?format=rss' },
  { site: 'CoinDesk',  url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { site: 'FXStreet',  url: 'https://www.fxstreet.com/rss' }
];

// 简单并发控制
async function mapLimit(arr, limit, worker) {
  const out = new Array(arr.length);
  let i = 0;
  async function run() {
    while (i < arr.length) {
      const idx = i++;
      out[idx] = await worker(arr[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, arr.length) }, run));
  return out;
}

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 TTLNewsBot/1.0' }
});

// 8s 超时 fetch
async function fetchTextWithTimeout(url, { headers = {}, timeoutMs = 8000 } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers, signal: ctl.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

// 抓取并解析单个源
async function loadFeed(src) {
  try {
    // 自己 fetch 再 parseString，便于 timeout/headers 控制
    const xml = await fetchTextWithTimeout(src.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 TTLNewsBot/1.0' },
      timeoutMs: 8000
    });
    const feed = await parser.parseString(xml);
    const items = Array.isArray(feed?.items) ? feed.items : [];

    return items.map(it => {
      const title = String(it.title || '').trim();
      // 链接在不同源字段名可能不同
      const link = String(
        it.link || it.guid || it.id || (it['feedburner:origLink'] || '')
      ).trim();

      const dt = it.isoDate || it.pubDate || it.pubdate || it.date || it['dc:date'] || '';
      const isoDate = new Date(dt || Date.now()).toISOString();

      return { site: src.site, title, link, isoDate };
    }).filter(x => x.title && x.link);
  } catch {
    return []; // 单源失败不影响总体
  }
}

// 简单韩文化标题（保留原英文标题，只额外给个 summaryKo）
function koize(t = '') {
  const map = {
    'U.S.': '미국', 'US ': '미국 ', 'U.S ': '미국 ',
    'China': '중국', 'Japan': '일본', 'Korea': '한국',
    'stocks': '주식', 'stock': '주식', 'equities': '주식',
    'bonds': '채권', 'oil': '유가', 'gold': '금', 'copper': '구리',
    'bitcoin': '비트코인', 'crypto': '크립토',
    'rate': '금리', 'rates': '금리', 'yield': '수익률',
    'inflation': '물가', 'jobs': '고용', 'payrolls': '고용',
    'Fed': '연준', 'ECB': 'ECB'
  };
  let r = t;
  for (const [en, ko] of Object.entries(map)) {
    r = r.replace(new RegExp(en, 'gi'), ko);
  }
  return r;
}

// 归一化用于去重的 title key
function normTitle(t = '') {
  return t.toLowerCase().replace(/[\s\W_]+/g, '');
}
function originOf(u = '') {
  try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  // 解析查询参数
  const url = new URL(req.url, 'http://localhost');
  const limitQ  = Number(url.searchParams.get('n') || url.searchParams.get('limit') || '30');
  const limit   = Math.max(1, Math.min(200, Number.isFinite(limitQ) ? limitQ : 30));
  const pageQ   = Number(url.searchParams.get('page') || '0');
  const offsetQ = Number(url.searchParams.get('offset') || (Number.isFinite(pageQ) ? pageQ * limit : 0));
  const offset  = Math.max(0, Number.isFinite(offsetQ) ? offsetQ : 0);

  // 过滤源
  const sitesParam = (url.searchParams.get('sites') || '').trim();
  let sources = FEEDS;
  if (sitesParam) {
    const set = new Set(sitesParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
    sources = FEEDS.filter(f => set.has(f.site.toLowerCase()));
  }

  // 抓取（并发 4，避免被源限流）
  const lists = await mapLimit(sources, 4, src => loadFeed(src));
  let all = lists.flat();

  // 搜索过滤
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  if (q) {
    all = all.filter(it => it.title.toLowerCase().includes(q));
  }

  // 去重：按 域名 + 归一化标题
  const seen = new Set();
  const dedup = [];
  for (const n of all) {
    const k = `${originOf(n.link)}|${normTitle(n.title)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(n);
  }

  // 时间降序
  dedup.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

  // 追加 summaryKo 字段（保留原英文标题）
  const enriched = dedup.map(n => ({
    ...n,
    summaryKo: `[${n.site}] ${koize(n.title)}`
  }));

  const total = enriched.length;
  const slice = enriched.slice(offset, offset + limit);

  // 响应
  res.setHeader('content-type', 'application/json; charset=utf-8');
  // 需要强实时就 no-store；想要更快可以换成 s-maxage 缓存到边缘
  res.setHeader('cache-control', 'no-store');
  res.setHeader('X-Total-Count', String(total));
  res.status(200).json(slice);
}
