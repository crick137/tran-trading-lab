// api/daily-brief/index.js
import { list, put } from '@vercel/blob';

const BUCKET_PREFIX = 'daily-brief/';

function authOk(req) {
  const token = process.env.ADMIN_TOKEN;
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return token && m && m[1] === token;
}

// GET  -> 返回 ["2025-10-16", "2025-10-15", ...]（倒序）
export async function GET() {
  const items = [];
  const it = await list({ prefix: BUCKET_PREFIX });
  for (const f of it.blobs) {
    if (!f.pathname.endsWith('.json')) continue;
    if (f.pathname === `${BUCKET_PREFIX}index.json`) continue;
    const slug = f.pathname.replace(BUCKET_PREFIX, '').replace(/\.json$/, '');
    items.push(slug);
  }
  items.sort().reverse();
  return new Response(JSON.stringify(items, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

// POST -> 创建/更新指定 slug（默认今天）
export async function POST(req) {
  if (!authOk(req)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const data = await req.json();
  const slug = (data.slug || new Date().toISOString().slice(0,10)).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'Invalid slug, expect YYYY-MM-DD' }), { status: 400 });
  }

  const payload = {
    slug,
    title: data.title || `Daily Brief ${slug}`,
    bullets: Array.isArray(data.bullets) ? data.bullets : [],
    schedule: Array.isArray(data.schedule) ? data.schedule : [],
    chart: {
      symbol: data.chart?.symbol || data.symbol || 'FX:XAUUSD',
      interval: data.chart?.interval || data.interval || '60'
    },
    updatedAt: new Date().toISOString()
  };

  const path = `${BUCKET_PREFIX}${slug}.json`;
  const putRes = await put(path, JSON.stringify(payload, null, 2), {
    access: 'public',
    contentType: 'application/json'
  });

  return new Response(JSON.stringify({ ok: true, url: putRes.url }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
