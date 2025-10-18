// api/analyses/[slug].js
import { list } from '@vercel/blob';
const BUCKET_PREFIX = 'analyses/';

export async function GET(req, { params }) {
  const { slug } = params || {};
  if (!slug) return new Response(JSON.stringify({ error: 'Invalid slug' }), { status: 400 });
  const it = await list({ prefix: `${BUCKET_PREFIX}${slug}.json` });
  const file = it.blobs.find(b => b.pathname === `${BUCKET_PREFIX}${slug}.json`);
  if (!file) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return Response.redirect(file.url, 302);
}