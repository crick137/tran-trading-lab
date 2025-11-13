// === api/app.js (stable indexes + robust delete + og:image + auth bypass cookie + force-delete) ===
export const config = { runtime: 'nodejs' };

import { jsonOK, badRequest, requireAuth as _requireAuth } from './_lib/http.js';
import {
  writeJSON, readJSONViaFetch, deleteObject,
  listByPrefix as _listByPrefix, deleteByUrl, list as _listRaw,
} from './_lib/blob.js';
import { DEFAULT_SYLLABUS } from '../data/syllabus.js';

const ENABLE_CORS = false;
const ok  = (d,s=200)=>jsonOK(d,s);
const err = (m='BAD_REQUEST',s=400)=>badRequest(m,s);

function withHeaders(init={}) {
  const h=new Headers(init.headers||{});
  if (ENABLE_CORS){
    h.set('access-control-allow-origin','*');
    h.set('access-control-allow-methods','GET,POST,PUT,DELETE,OPTIONS');
    h.set('access-control-allow-headers','content-type,authorization,cookie');
  }
  return {...init, headers:h};
}
function getHeader(req,name){
  const h=req.headers||{};
  const k=String(name).toLowerCase();
  if (typeof h.get==='function') return h.get(name);
  return h[k]||h[name]||null;
}
function getURL(req){
  try{
    if (req.url && String(req.url).startsWith('http')) return new URL(req.url);
    const proto=getHeader(req,'x-forwarded-proto')||'https';
    const host =getHeader(req,'x-forwarded-host')||getHeader(req,'host')||'localhost';
    const path =req.url||'/';
    return new URL(`${proto}://${host}${path.startsWith('/')?'':'/'}${path}`);
  }catch{
    return new URL('https://localhost/api/ping');
  }
}
async function readBody(req){
  try{
    const ct=(getHeader(req,'content-type')||'').toLowerCase();
    if (typeof req.json==='function' && ct.includes('application/json')) return await req.json();
    if (typeof req.text==='function'){ const t=await req.text(); return t?JSON.parse(t):{}; }
    let data=''; if (req.readable){ for await (const ch of req) data+=ch; return data?JSON.parse(data):{}; }
    return {};
  }catch{ return {}; }
}

async function listByPrefix(prefix){
  try{
    if (typeof _listByPrefix==='function') return await _listByPrefix(prefix);
    const it = await _listRaw({ prefix });
    return it?.blobs ?? [];
  }catch{ return []; }
}
const normPath=p=>p.length>1&&p.endsWith('/')?p.slice(0,-1):p;
const readIndexJson=async p=>{ try{ return await readJSONViaFetch(p,{timeoutMs:2000,retries:1,retryDelayMs:200}); }catch{ return []; } };

async function upsertIndex(prefix,key){
  const INDEX=`${prefix}/index.json`;
  let arr=[]; try{ arr=await readIndexJson(INDEX);}catch{}
  if (!Array.isArray(arr)) arr=[];
  arr=[key, ...arr.filter(x=>x!==key)];
  try{ await writeJSON(INDEX,arr,{timeoutMs:2000,retries:1,retryDelayMs:200}); }catch(e){ console.warn('[INDEX] upsertIndex failed',e?.message||e); }
}
async function upsertAnalysesIndex(prefix,meta){
  const INDEX=`${prefix}/index.json`;
  let arr=[]; try{ arr=await readIndexJson(INDEX);}catch{}
  if (!Array.isArray(arr)) arr=[];
  arr=arr.map(x=> typeof x==='string'?{slug:x}: (x&&typeof x==='object'?x:null)).filter(Boolean);
  arr=arr.filter(x=>x.slug!==meta.slug);
  arr.unshift(meta);
  try{ await writeJSON(INDEX,arr,{timeoutMs:2000,retries:1,retryDelayMs:200}); }catch(e){ console.warn('[INDEX] upsertAnalysesIndex failed',e?.message||e); }
}
// 删除索引：兼容 ["slug"] 和 [{slug,...}]
async function removeFromIndex(prefix,key){
  const INDEX=`${prefix}/index.json`;
  let arr=[]; try{ arr=await readIndexJson(INDEX);}catch{}
  if (!Array.isArray(arr)) arr=[];
  const K=String(key);
  arr=arr.filter(x=>{
    if (typeof x==='string') return x!==K;
    if (x && typeof x==='object'){
      const s=String(x.slug??x.id??'');
      return s!==K;
    }
    return true;
  });
  try{ await writeJSON(INDEX,arr,{timeoutMs:2000,retries:1,retryDelayMs:200}); }catch(e){ console.warn('[INDEX] removeFromIndex failed',e?.message||e); }
}

async function ensureDeleted(prefix,slug){
  const FILE=`${prefix}/${slug}.json`;
  for(let i=0;i<3;i++){
    const blobs=await listByPrefix(`${prefix}/`);
    const hit=(blobs||[]).find(b=>b.pathname===FILE);
    if (!hit) return true;
    try{ await deleteObject(FILE,{timeoutMs:3000,retries:1,retryDelayMs:200}); }catch{}
    try{ if(hit.url) await deleteByUrl(hit.url,{timeoutMs:3000,retries:1,retryDelayMs:200}); }catch{}
    await new Promise(r=>setTimeout(r,400));
  }
  const after=await listByPrefix(`${prefix}/`);
  return !(after||[]).some(b=>b.pathname===FILE);
}

function requireAuthIfConfigured(req){
  if (!process.env.ADMIN_PASSWORD) return null;
  try{
    const cookie=getHeader(req,'cookie')||'';
    if (cookie && /(?:^|;\s*)tran_admin=ok(?:;|$)/.test(cookie)) return null; // cookie 会话视为已登录
  }catch{}
  return _requireAuth(req); // 走 Authorization: Bearer <password>
}

// 索引兜底：永远返回 200 + []
async function stableIndex(prefix){
  try{
    const blobs=await listByPrefix(`${prefix}/`);
    const items=(blobs||[])
      .filter(b=>b.pathname && b.pathname.endsWith('.json'))
      .map(b=> b.pathname.replace(`${prefix}/`,'').replace('.json',''))
      .filter(s=>s && s!=='index')
      .sort((a,b)=>(a>b?-1:1));
    return ok(items);
  }catch{ return ok([]); }
}

/* ---------- Admin ---------- */
async function handleAdmin(req, pathname){
  const sub=pathname.replace('/api/admin','')||'';
  if (sub==='/login' && req.method==='POST'){
    const body=await readBody(req);
    const pass=body?.password||body?.pwd||'';
    if (!process.env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD_NOT_SET',500);
    if (pass!==process.env.ADMIN_PASSWORD) return err('INVALID_PASSWORD',401);
    return ok({ ok:true, token:'ok' });
  }
  if (sub==='/verify' && req.method==='GET')  return ok({ authed:true });
  if (sub==='/logout' && req.method==='POST') return ok({ ok:true });
  return err('ADMIN_NO_ROUTE',404);
}

/* ---------- 管理员强制删除（支持完整路径 analyses/2025/10/27.json） ---------- */
async function handleForceDelete(req){
  const unauthorized = requireAuthIfConfigured(req);
  if (unauthorized) return unauthorized;

  const body = await readBody(req);
  let p = String(body?.path || body?.p || '').replace(/^\/+/, '');
  if (!p) return err('MISSING_PATH', 400);
  if (!/^analyses\//.test(p)) return err('INVALID_PATH', 400);
  if (!p.endsWith('.json')) p += '.json';

  const slug = p.replace(/^analyses\//, '').replace(/\.json$/, '');

  try { await deleteObject(p); } catch {}
  try { await ensureDeleted('analyses', slug); } catch {}
  try { await removeFromIndex('analyses', slug); } catch {}

  return ok({ deleted: true, path: p, slug });
}

/* ---------- 通用 CRUD ---------- */
async function genericHandler(req, pathname, PREFIX){
  try{
    const p=normPath(pathname);
    console.log(`[API] ${req.method} ${pathname} (PREFIX: ${PREFIX})`);

    // 索引
    if ([`/api/${PREFIX}`, `/api/${PREFIX}/index`, `/api/${PREFIX}/index.json`].includes(p)){
      try{
        if (PREFIX==='research/articles') return await stableIndex(PREFIX);
        const idx   = await readIndexJson(`${PREFIX}/index.json`);
        const blobs = await listByPrefix(`${PREFIX}/`);
        const blobNames = new Set((blobs||[])
          .filter(b=>b.pathname && b.pathname.endsWith('.json'))
          .map(b=> b.pathname.replace(`${PREFIX}/`,'').replace('.json',''))
          .filter(s=> s && s!=='index'));
        if (Array.isArray(idx) && idx.length){
          const normalized = idx.map(x => (typeof x==='string') ? x : (x&&x.slug)?x.slug:'').filter(Boolean);
          const filtered   = normalized.filter(s=> blobNames.has(s));
          const missing    = Array.from(blobNames).filter(s=> !normalized.includes(s));
          const items      = filtered.concat(missing).filter(Boolean).sort((a,b)=>(a>b?-1:1));
          return ok(items);
        }
        return ok(Array.from(blobNames).sort((a,b)=>(a>b?-1:1)));
      }catch{ return ok([]); }
    }

    // 单项
    const m=p.match(new RegExp(`^/api/${PREFIX}/([^/]+?)(?:\\.json)?$`));
    if (!m) return err(`${PREFIX.toUpperCase()}_NO_ROUTE`,404);
    const slug=m[1];
    const FILE=`${PREFIX}/${slug}.json`;

    if (req.method==='GET'){
      if (PREFIX==='research/articles'){
        const dateToNested=s=>{ const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})_?$/); return m?`${m[1]}/${m[2]}/${m[3]}`:null; };
        const nestedToDash=s=> s && s.replace(/\//g,'-');
        const dash=slug.replace(/[\\\/]+/g,'-').replace(/_+$/,'');
        const nested=dateToNested(dash)||dateToNested(slug)||null;
        const cands=Array.from(new Set([ slug,dash,slug.replace(/_+$/,''), nested||'', nested?nestedToDash(nested):'' ].filter(Boolean)));
        for (const s of cands){ try{ return ok(await readJSONViaFetch(`${PREFIX}/${s}.json`)); }catch{} }
        return err('NOT_FOUND',404);
      }
      const cands=Array.from(new Set([
        slug,
        (function(){ try{ return decodeURIComponent(slug);}catch{ return slug; }})(),
        (function(){ try{ const o=decodeURIComponent(slug); return decodeURIComponent(o);}catch{ return slug; }})()
      ].filter(Boolean)));
      for (const s of cands){ try{ return ok(await readJSONViaFetch(`${PREFIX}/${s}.json`)); }catch{} }
      return err('NOT_FOUND',404);
    }

    if (['PUT','POST'].includes(req.method)){
      const unauthorized=requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      const body=await readBody(req);
      try{
        await writeJSON(FILE, body);
        try{
          if (PREFIX==='analyses'){
            const meta={
              slug,
              title: body?.title || slug,
              symbol: body?.symbol || body?.chart?.symbol || '',
              tf: body?.tf || '',
              date: body?.date || '',
              tags: Array.isArray(body?.tags) ? body.tags : [],
              bias: body?.bias || ''
            };
            await upsertAnalysesIndex(PREFIX, meta);
          } else {
            await upsertIndex(PREFIX, slug);
          }
        }catch(e){ console.warn('[API] index update error', e?.message||e); }
        return ok({ saved:true, slug });
      }catch(e){
        return err(e?.message||'WRITE_FAILED',500);
      }
    }

    if (req.method==='DELETE'){
      const unauthorized=requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
      if (PREFIX==='research/articles'){
        const dateToNested=s=>{ const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})_?$/); return m?`${m[1]}/${m[2]}/${m[3]}`:null; };
        const dash=slug.replace(/[\\\/]+/g,'-').replace(/_+$/,'');
        const nested=dateToNested(dash)||dateToNested(slug)||null;
        const variants=Array.from(new Set([ slug,dash,slug.replace(/_+$/,''), nested||'' ].filter(Boolean)));
        let any=false;
        for (const s of variants){
          try{ await deleteObject(`${PREFIX}/${s}.json`); any=true; }catch{}
          try{ await ensureDeleted(PREFIX, s);}catch{}
          try{ await removeFromIndex(PREFIX, s);}catch{}
        }
        return ok({ deleted:any, slug });
      }
      try{ await deleteObject(FILE); }catch(e){ return err(e?.message||'DELETE_FAILED',500); }
      try{ const gone=await ensureDeleted(PREFIX, slug); if (!gone) return err('DELETE_VERIFY_FAILED',500); }catch{}
      try{ await removeFromIndex(PREFIX, slug); }catch{}
      return ok({ deleted:true, slug });
    }

    return err('METHOD_NOT_ALLOWED',405);
  }catch(e){
    console.error('[API] genericHandler error:', e);
    return err('INTERNAL_ERROR',500);
  }
}

/* ---------- Research 只读 ---------- */
async function handleResearch(req, pathname){
  const p=normPath(pathname);
  if (req.method!=='GET') return err('METHOD_NOT_ALLOWED',405);

  if (/^\/api\/research\/syllabus(?:\.json)?$/.test(p)){
    try{
      const data=await readJSONViaFetch('research/syllabus.json');
      if (Array.isArray(data?.syllabus) && data.syllabus.length) return ok(data);
    }catch{}
    try{ await writeJSON('research/syllabus.json',{ syllabus:DEFAULT_SYLLABUS, updatedAt:new Date().toISOString() }); }catch(e){ console.warn('[syllabus seed] persist fail',e?.message||e); }
    return ok({ syllabus:DEFAULT_SYLLABUS });
  }
  if (/^\/api\/research\/articles(?:\.json)?$/.test(p)){
    try{ return ok(await readJSONViaFetch('research/articles/index.json')); }
    catch{ return ok([]); }
  }
  return err('RESEARCH_NO_ROUTE',404);
}
async function handleResearchSyllabusWrite(req){
  if (!['PUT','POST','DELETE'].includes(req.method)) return err('METHOD_NOT_ALLOWED',405);
  const unauthorized=requireAuthIfConfigured(req); if (unauthorized) return unauthorized;
  try{
    let syllabus=[];
    if (req.method==='DELETE') syllabus=[];
    else{
      const body=await readBody(req);
      const raw=Array.isArray(body?.syllabus)?body.syllabus : Array.isArray(body)?body : null;
      if (!Array.isArray(raw)) return err('INVALID_SYLLABUS_ARRAY',400);
      syllabus=raw;
    }
    await writeJSON('research/syllabus.json',{ syllabus, updatedAt:new Date().toISOString() });
    return ok({ saved:true, count:syllabus.length });
  }catch(e){ return err('SYLLABUS_WRITE_FAILED',500); }
}

/* ---------- og:image 提取 ---------- */
async function handleOgImage(urlObj){
  const target=urlObj.searchParams.get('url')||'';
  if (!target) return err('MISSING_URL',400);
  try{
    const r=await fetch(target,{ redirect:'follow', headers:{ 'user-agent':'Mozilla/5.0 TTL-Bot' }});
    const html=await r.text();
    const pick=re=>{ const m=html.match(re); return m && m[1] ? m[1] : ''; };
    const og = pick(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) || pick(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    const tw = pick(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)   || pick(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*>/i);
    const linkImg = pick(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    const image = og || tw || linkImg || '';
    return ok({ image: image || null });
  }catch(e){
    console.warn('[og-image] fail', e?.message||e);
    return ok({ image:null });
  }
}

/* ---------- 统一响应适配 ---------- */
async function sendNodeResponse(res,out){
  if (out && typeof out==='object' && typeof out.text==='function' && out.headers){
    const status=out.status||200; const headersObj={};
    try{ for (const [k,v] of out.headers.entries()) headersObj[k]=v; }catch{}
    const body=await out.text();
    res.writeHead(status, headersObj); res.end(body); return;
  }
  res.setHeader('content-type','application/json; charset=utf-8');
  res.statusCode=200; res.end(JSON.stringify(out??{}));
}

/* ---------- 主入口 ---------- */
export default async function handler(req,res){
  try{
    const url=getURL(req); const pathname=normPath(url.pathname||'/');

    if (req.method==='OPTIONS') return sendNodeResponse(res, new Response(null, withHeaders({status:204})));
    if (req.method==='HEAD')    return sendNodeResponse(res, new Response(null, withHeaders({status:200})));

    if (req.method==='GET' && pathname==='/api/ping'){
      return sendNodeResponse(res, ok({ ok:true, ts:Date.now(), runtime:'node', env:process.env.VERCEL_ENV||'local' }));
    }

    let out;
    // 显式稳定索引
    if (pathname==='/api/daily-brief/index.json' && req.method==='GET') out = await stableIndex('daily-brief');
    else if (pathname==='/api/research/articles/index.json' && req.method==='GET') out = await stableIndex('research/articles');

    // 管理接口
    else if (pathname === '/api/admin/force-delete' && req.method === 'POST') out = await handleForceDelete(req);
    else if (pathname.startsWith('/api/admin')) out = await handleAdmin(req, pathname);

    // 业务资源
    else if (pathname.startsWith('/api/daily-brief')) out = await genericHandler(req, pathname, 'daily-brief');
    else if (pathname.startsWith('/api/analyses')) out = await genericHandler(req, pathname, 'analyses');

    // 兼容发稿 POST 到多个路径
    else if ((req.method==='POST') && (pathname==='/_api/market-news' || pathname==='/api/market-news' || pathname==='/api/market-news/index' || pathname==='/api/market-news/index.json')){
      const unauthorized=requireAuthIfConfigured(req); if (unauthorized) out=unauthorized; else{
        const body=await readBody(req); const id=body?.id||body?.slug;
        if (!id) out=err('MISSING_ID',400);
        else{
          try{ await writeJSON(`market-news/${id}.json`, body); }catch{ out=err('WRITE_FAILED',500); }
          if (!out){ try{ await upsertIndex('market-news',id);}catch{} out=ok({ saved:true, id }); }
        }
      }
    }
    else if (pathname.startsWith('/api/market-news')) out = await genericHandler(req, pathname, 'market-news');
    else if (pathname.startsWith('/api/research/syllabus')){
      if (req.method==='GET') out=await handleResearch(req, pathname);
      else out=await handleResearchSyllabusWrite(req);
    }
    else if (pathname.startsWith('/api/research/articles/')) out = await genericHandler(req, pathname, 'research/articles');
    else if (pathname==='/api/research/articles' || pathname==='/api/research/articles.json') out = await handleResearch(req, pathname);
    else if (pathname.startsWith('/api/research')) out = await handleResearch(req, pathname);

    else if (pathname==='/api/og-image' && req.method==='GET') out = await handleOgImage(url);
    else out = err('NO_ROUTE',404);

    return sendNodeResponse(res, out);
  }catch(e){
    console.error('[API] Critical error:', e);
    return sendNodeResponse(res, err('INTERNAL_ERROR',500));
  }
}
