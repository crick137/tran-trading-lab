// api/analyses/index.js
import { list, put } from '@vercel/blob';

const BUCKET_PREFIX = 'analyses/';

function authOk(req) {
  const token = process.env.ADMIN_TOKEN;
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return token && m && m[1] === token;
}

// GET -> 返回 [{slug,title,symbol,tf,date,tags,bias}, ...]（倒序）
export async function GET() {
  const out = [];
  const it = await list({ prefix: BUCKET_PREFIX });

  // 并发抓取元信息（数量不大时可行）
  const jobs = it.blobs
    .filter(f => f.pathname.endsWith('.json') && f.pathname !== `${BUCKET_PREFIX}index.json`)
    .map(async (f) => {
      const slug = f.pathname.replace(BUCKET_PREFIX, '').replace(/\.json$/, '');
      try {
        const resp = await fetch(f.url);
        const d = await resp.json();
        out.push({
          slug,
          title: d.title || slug,
          symbol: d.symbol || d.chart?.symbol || '',
          tf: d.tf || '',
          date: d.date || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          bias: d.bias || 'neutral'
        });
      } catch {
        out.push({ slug, title: slug, symbol: '', tf: '', date: '', tags: [], bias: 'neutral' });
      }
    });

  await Promise.all(jobs);
  out.sort((a,b)=> (a.slug > b.slug ? 1 : -1)).reverse();

  return new Response(JSON.stringify(out, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

/**
 * POST 创建/更新一条分析
 * body 见前文（slug/title/symbol/tf/date/tags/bias/supports/resistances/context/view/invalidation/chart）
 */
export async function POST(req) {
  if (!authOk(req)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const d = await req.json();
  const slug = (d.slug || '').trim();
  if (!slug) return new Response(JSON.stringify({ error: 'slug is required' }), { status: 400 });

  const payload = {
    slug,
    title: d.title || slug,
    symbol: d.symbol || '',
    tf: d.tf || '',
    date: d.date || new Date().toISOString().slice(0,10),
    tags: Array.isArray(d.tags) ? d.tags : [],
    bias: d.bias || 'neutral',
    supports: Array.isArray(d.supports) ? d.supports : [],
    resistances: Array.isArray(d.resistances) ? d.resistances : [],
    context: d.context || '',
    view: d.view || '',
    invalidation: d.invalidation || '',
    chart: {
      symbol: d.chart?.symbol || d.symbol || '',
      interval: d.chart?.interval || '60'
    },
    updatedAt: new Date().toISOString()
  };

  const path = `${BUCKET_PREFIX}${slug}.json`;
  const putRes = await put(path, JSON.stringify(payload, null, 2), {
    contentType: 'application/json',
    access: 'public'
  });

  return new Response(JSON.stringify({ ok: true, url: putRes.url }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
