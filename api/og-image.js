// api/og-image.js
export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const raw = searchParams.get('url');
    if (!raw) {
      res.status(400).json({ error: 'url required' });
      return;
    }
    const target = decodeURIComponent(raw);

    // 抓取目标页面
    const r = await fetch(target, {
      // 尽量模拟常见浏览器，提升被允许抓取的概率
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.8'
      },
      redirect: 'follow'
    });

    const finalURL = r.url; // 处理跳转后的最终地址
    const html = await r.text();

    // 简单提取函数
    const pick = (re) => {
      const m = html.match(re);
      return m && m[1] ? m[1].trim() : '';
    };

    // 优先级：og:image > twitter:image > itemprop=image > link[image_src]
    let img =
      pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      pick(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      pick(/<meta[^>]+name=["']twitter:image(:src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      pick(/<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      pick(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i) ||
      '';

    // 处理相对地址
    if (img) {
      try { img = new URL(img, finalURL).toString(); } catch {}
    }

    // 缓存策略：边缘 1 小时 + 回源容错 1 天
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    res.status(200).json({ image: img || '' });
  } catch (e) {
    res.status(200).json({ image: '' });
  }
}
