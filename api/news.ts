// /api/news.js —— Vercel Serverless (ESM)
export default async function handler(req, res) {
  const Parser = (await import('rss-parser')).default;

  // 高质量新闻源（可再加）
  const FEEDS = [
    { site: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
    { site: 'Reuters',   url: 'https://feeds.reuters.com/reuters/businessNews' },
    { site: 'WSJ',       url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml' },
    { site: 'FT',        url: 'https://www.ft.com/?format=rss' },
    { site: 'CoinDesk',  url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { site: 'FXStreet',  url: 'https://www.fxstreet.com/rss' }
  ];

  const parser = new Parser({
    headers: { 'User-Agent': 'Mozilla/5.0 TTLNewsBot/1.0' }
  });

  const koize = (t = '') => {
    // 轻量“韩文化”：常见词替换，保持标题原意
    const map = {
      'U.S.': '미국', 'US ': '미국 ', 'U.S ': '미국 ',
      'China': '중국', 'Japan': '일본', 'Korea': '한국',
      'stocks': '주식', 'stock': '주식', 'equities': '주식',
      'bonds': '채권', 'oil': '유가', 'gold': '금', 'copper': '구리',
      'bitcoin': '비트코인', 'crypto': '크립토',
      'rate': '금리', 'rates': '금리', 'yield': '수익률',
      'inflation': '물가', 'CPI': 'CPI', 'PPI': 'PPI',
      'jobs': '고용', 'payrolls': '고용', 'Fed': '연준', 'ECB': 'ECB'
    };
    let r = t;
    for (const [en, ko] of Object.entries(map)) {
      r = r.replace(new RegExp(en, 'gi'), ko);
    }
    return r;
  };

  const out = [];
  for (const src of FEEDS) {
    try {
      const feed = await parser.parseURL(src.url);
      for (const it of (feed.items || [])) {
        out.push({
          site: src.site,
          title: it.title || '',
          link: it.link || it.guid || '',
          isoDate: it.isoDate || it.pubDate || new Date().toISOString(),
          summaryKo: `[${src.site}] ${koize(it.title || '')}`
        });
      }
    } catch (e) {
      // 静默跳过单个源
    }
  }

  // 去重（link + 标题粗归一）
  const seen = new Set();
  const dedup = [];
  for (const n of out) {
    const k = (n.link || '') + '|' + (n.title || '').toLowerCase().replace(/\s+/g, '');
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(n);
  }

  // 排序后先取最多 30 条
  dedup.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  const latest = dedup.slice(0, 30);

  // 允许用 query 控制条数（默认 5，强制夹在 3–5）
  const url = new URL(req.url, 'http://localhost');
  const q = Number(url.searchParams.get('n'));
  const want = Number.isFinite(q) ? q : 5;
  const N = Math.max(3, Math.min(5, want));

  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  return res.status(200).json(latest.slice(0, N));
}
