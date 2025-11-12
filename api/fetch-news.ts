import RSSParser from 'rss-parser';
import { kv } from '@vercel/kv';

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceId: string;
  publishedAt: string;
  summary?: string;
};

const parser = new RSSParser({
  headers: { 'User-Agent': 'tran-trading-lab/1.0 (+https://example.com)' },
  timeout: 15000
});

// 你可以随时增删。单个源失败不会影响整体。
const SOURCES = [
  { id: 'tc',      title: 'TechCrunch',                  url: 'https://techcrunch.com/feed/' },
  { id: 'mw',      title: 'MarketWatch Top Stories',     url: 'https://www.marketwatch.com/rss/topstories' },
  { id: 'reutTop', title: 'Reuters Top News',            url: 'https://feeds.reuters.com/reuters/topNews' },
  { id: 'reutBiz', title: 'Reuters Business',            url: 'https://feeds.reuters.com/reuters/businessNews' },
  { id: 'ftWorld', title: 'Financial Times - World',     url: 'https://www.ft.com/world?format=rss' },
  { id: 'cnbc',    title: 'CNBC Top News',               url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { id: 'coind',   title: 'CoinDesk',                    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { id: 'verge',   title: 'The Verge',                   url: 'https://www.theverge.com/rss/index.xml' }
];

function safeIso(d?: string) {
  const t = d ? Date.parse(d) : NaN;
  return Number.isFinite(t) ? new Date(t).toISOString() : new Date().toISOString();
}

function hash(input: string) {
  // 简易 hash，够用即可
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export default async function handler(_: any, res: any) {
  try {
    const perSource = await Promise.all(
      SOURCES.map(async (src) => {
        try {
          const feed = await parser.parseURL(src.url);
          const items: NewsItem[] = (feed.items || []).map((it) => {
            const url = (it.link || it.guid || '').trim();
            return {
              id: hash(url || (it.title ?? '') + (it.pubDate ?? '')),
              title: (it.title ?? '').trim(),
              url,
              source: src.title,
              sourceId: src.id,
              publishedAt: safeIso((it as any).isoDate || it.pubDate),
              summary: (it as any).contentSnippet || (it as any).summary || undefined
            };
          });
          return items;
        } catch (e) {
          console.error(`[RSS] ${src.title} failed:`, (e as Error).message);
          return [] as NewsItem[];
        }
      })
    );

    // 扁平 + 去重 + 排序 + 限制数量
    const flat = perSource.flat();
    const seen = new Set<string>();
    const deduped: NewsItem[] = [];
    for (const it of flat) {
      const key = it.url || `${it.title}#${it.publishedAt}`;
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(it);
    }
    deduped.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    const limited = deduped.slice(0, 200);

    const payload = { updatedAt: new Date().toISOString(), items: limited };

    // 写入 Vercel KV（需在项目环境变量里配置 KV_REST_API_URL / KV_REST_API_TOKEN）
    await kv.set('news:latest', JSON.stringify(payload), { ex: 60 * 60 }); // 缓存1小时

    return res.status(200).json({ ok: true, count: limited.length, ...payload });
  } catch (err) {
    console.error('[cron/fetch-news] fatal:', (err as Error).message);
    return res.status(500).json({ ok: false, error: 'fetch failed' });
  }
}
