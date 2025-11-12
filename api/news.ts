import { kv } from '@vercel/kv';
import RSSParser from 'rss-parser';

const parser = new RSSParser({ timeout: 12000 });

export default async function handler(req: any, res: any) {
  try {
    // 先读缓存
    const cached = await kv.get<string>('news:latest');
    if (cached) {
      const data = JSON.parse(cached);
      // 支持简单过滤：?q=keyword&limit=50&sourceId=reutTop
      const url = new URL(req.url, 'http://x');
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 200);
      const sourceId = url.searchParams.get('sourceId') || '';

      let items = data.items as any[];
      if (q) items = items.filter((it) => (it.title || '').toLowerCase().includes(q) || (it.summary || '').toLowerCase().includes(q));
      if (sourceId) items = items.filter((it) => it.sourceId === sourceId);

      return res.status(200).json({ updatedAt: data.updatedAt, items: items.slice(0, limit) });
    }

    // 若缓存不存在（首次冷启动或过期），兜底：触发一次轻量抓取（以 TechCrunch 为例）
    const feed = await parser.parseURL('https://techcrunch.com/feed/');
    const items = (feed.items || []).slice(0, 20).map((it) => ({
      id: (it.guid || it.link || it.title || Math.random().toString(36).slice(2)),
      title: it.title,
      url: it.link || it.guid,
      source: 'TechCrunch',
      sourceId: 'tc',
      publishedAt: (it as any).isoDate || it.pubDate || new Date().toISOString(),
      summary: (it as any).contentSnippet || (it as any).summary
    }));

    const payload = { updatedAt: new Date().toISOString(), items };
    await kv.set('news:latest', JSON.stringify(payload), { ex: 60 * 15 }); // 15分钟
    return res.status(200).json(payload);
  } catch (err) {
    console.error('[api/news] error:', (err as Error).message);
    return res.status(500).json({ error: 'unavailable' });
  }
}
