// api/research/syllabus.js
import { get, put } from '@vercel/blob';

const PATH = 'research/syllabus.json';

function authOK(req){
  const token = process.env.ADMIN_TOKEN;
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return token && m && m[1] === token;
}

// GET -> 302 到线上 JSON；不存在则 404
export async function GET(){
  try{
    const res = await get(PATH);
    if (!res?.downloadUrl) throw 0;
    return Response.redirect(res.downloadUrl, 302);
  }catch{
    return new Response(JSON.stringify({ error:'Not found' }), { status:404 });
  }
}

// POST -> { syllabus: [...] }
export async function POST(req){
  if (!authOK(req)) return new Response(JSON.stringify({error:'Unauthorized'}), { status:401 });
  const d = await req.json();
  if (!Array.isArray(d.syllabus)) {
    return new Response(JSON.stringify({ error:'syllabus must be array' }), { status:400 });
  }
  const payload = { syllabus: d.syllabus, updatedAt: new Date().toISOString() };
  await put(PATH, JSON.stringify(payload, null, 2), { access:'public', contentType:'application/json' });
  return new Response(JSON.stringify({ ok:true }), { headers:{ 'content-type':'application/json; charset=utf-8' }});
}
