// api/market-news/index.js
import { list, put } from '@vercel/blob';
const PREFIX = 'market-news/';

function authOK(req){
  const token = process.env.ADMIN_TOKEN;
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return token && m && m[1] === token;
}

// GET -> 返回 [{id}, ...]（倒序）; 详情用 /market-news/:id.json 再取
export async function GET() {
  const rows = [];
  const it = await list({ prefix: PREFIX });
  for (const f of it.blobs) {
    if (!f.pathname.endsWith('.json')) continue;
    if (f.pathname === `${PREFIX}index.json`) continue;
    const id = f.pathname.replace(PREFIX,'').replace(/\.json$/,'');
    rows.push({ id });
  }
  rows.sort((a,b)=> a.id>b.id?1:-1).reverse();
  return new Response(JSON.stringify(rows, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

/**
 * POST body:
 * { id, title, source, url, date, tags:[], summary, bullets:[] }
 */
export async function POST(req){
  if (!authOK(req)) return new Response(JSON.stringify({error:'Unauthorized'}), { status:401 });
  const d = await req.json();
  const id = (d.id||'').trim();
  if (!id) return new Response(JSON.stringify({error:'id required'}), { status:400 });

  const item = {
    id,
    title: d.title || id,
    source: d.source || '',
    url: d.url || '',
    date: d.date || new Date().toISOString(),
    tags: Array.isArray(d.tags) ? d.tags : [],
    summary: d.summary || '',
    bullets: Array.isArray(d.bullets) ? d.bullets : [],
    updatedAt: new Date().toISOString()
  };

  const path = `${PREFIX}${id}.json`;
  const res = await put(path, JSON.stringify(item, null, 2), {
    access: 'public',
    contentType: 'application/json'
  });
  return new Response(JSON.stringify({ ok:true, url: res.url }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
