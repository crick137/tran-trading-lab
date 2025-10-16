// api/market-news/[id].js
import { list } from '@vercel/blob';
const PREFIX = 'market-news/';

export async function GET(req, { params }){
  const { id } = params || {};
  if (!id) return new Response(JSON.stringify({error:'Invalid id'}), { status:400 });
  const it = await list({ prefix: `${PREFIX}${id}.json` });
  const file = it.blobs.find(b => b.pathname === `${PREFIX}${id}.json`);
  if (!file) return new Response(JSON.stringify({error:'Not found'}), { status:404 });
  return Response.redirect(file.url, 302);
}
