// ===== /public/js/admin-main.js (rev: 2025-11-01) =====
// Admin interactions: tabs, diagnostics, CRUD helpers (UX-only)

const Admin = window.Admin || {};
const $  = Admin.$  || ((sel, root=document)=> (root||document).querySelector(sel));
const $$ = Admin.$$ || ((sel, root=document)=> Array.from((root||document).querySelectorAll(sel)));

let __ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function __setToken(v){
  __ADMIN_TOKEN = v || '';
  if (v) sessionStorage.setItem('tran_admin_token', v);
  else sessionStorage.removeItem('tran_admin_token');
}

/* ---------------- Fetch Wrapper ---------------- */
async function __apiFetch(url, init={}){
  const opts = { credentials:'include', cache:'no-store', ...init };
  if (!opts.method) opts.method = 'GET';
  const headers = new Headers(opts.headers || {});
  if (__ADMIN_TOKEN) headers.set('Authorization', 'Bearer '+__ADMIN_TOKEN);
  if (!headers.has('content-type') && typeof opts.body === 'string') {
    headers.set('content-type', 'application/json;charset=utf-8');
  }
  opts.headers = headers;
  const ctrl = new AbortController();
  const timer = setTimeout(()=>{ try{ctrl.abort()}catch{} }, 12000);
  opts.signal = ctrl.signal;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null; try { data = JSON.parse(text) } catch {}
    return { res, ok: res.ok, status: res.status, data, text };
  } finally { clearTimeout(timer); }
}
function unwrapResponse(r, ctx){
  if (!r.ok) {
    const msg = (r.data && (r.data.error || r.data.message)) || r.text || ctx || ('HTTP '+r.status);
    throw new Error(msg);
  }
  return r.data;
}

/* ---------------- Utils ---------------- */
const today = () => new Date().toISOString().slice(0,10);
const splitLines = v => (v||'').split('\n').map(s=>s.trim()).filter(Boolean);
const joinLines  = a => Array.isArray(a)? a.join('\n'): '';
const safeStringify = v => { try{ return JSON.stringify(v,null,2) }catch{ return '' } };
const escapeHTML = s => String(s??'').replace(/[&<>"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));

/* 强制无缓存 JSON 拉取（用于读取静态或 API 索引） */
async function fetchJSONNoCache(url){
  const u = url + (url.includes('?')?'&':'?') + '_t=' + Date.now();
  const r = await fetch(u, { cache: 'no-store', credentials: 'include' });
  if (!r.ok) throw new Error('HTTP '+r.status);
  return r.json();
}

/* 索引/文档读取（统一从 /api 前缀拿，天然可被服务端实时重建） */
async function fetchIndex(prefix){
  // 走 API，并带时间戳，避免 CDN 命中旧副本
  const r = await __apiFetch(`/api/${prefix}/index.json?_=${Date.now()}`);
  return unwrapResponse(r,'FETCH_INDEX_FAILED');
}
async function fetchDocument(prefix, slug){
  const r = await __apiFetch(`/api/${prefix}/${encodeURIComponent(slug)}.json?_=${Date.now()}`);
  return unwrapResponse(r,'FETCH_DOCUMENT_FAILED');
}

/* 将列表渲染到“线上列表”视图 */
function setIndexView(target, list){
  if (!target) return;
  try{
    target.textContent = JSON.stringify(list ?? [], null, 2);
  }catch{
    target.textContent = '[]';
  }
}

/* 从“线上列表”文本里做乐观更新：删除某项（后端慢半拍也能即时消失） */
function optimisticRemoveFromIndex(target, keyName, keyValue){
  if (!target) return;
  try{
    const cur = JSON.parse(target.textContent || '[]');
    if (!Array.isArray(cur)) return;
    const next = cur.filter(item=>{
      if (typeof item === 'string') return item !== keyValue;
      if (item && typeof item === 'object') {
        const k = (keyName in item) ? keyName : (item.slug ? 'slug' : (item.id ? 'id' : keyName));
        return item[k] !== keyValue;
      }
      return true;
    });
    if (next.length !== cur.length) {
      setIndexView(target, next);
    }
  }catch{}
}

/* 多路回退读取 JSON（前台/后台共用） */
async function getJSONWithFallbacks(urls){
  for (const u of urls){
    try{
      const r = await fetch(u + (u.includes('?')?'&':'?') + '_=' + Date.now(), {cache:'no-store'});
      if (r.ok) return await r.json();
    }catch{}
  }
  return null;
}

async function refreshIndexView(prefix, target){
  if (!target) return;
  target.textContent = '正在加载...';
  try{
    const list = await fetchIndex(prefix);
    setIndexView(target, list);
  }catch(e){ target.textContent = '失败: '+(e.message||e); }
}

/* ---- toast / dirty ---- */
let __DIRTY=false;
window.addEventListener('beforeunload', e=>{ if(__DIRTY){ e.preventDefault(); e.returnValue=''; }});
function toast(msg){
  let el=document.querySelector('.toast');
  if(!el){ el=document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el.__t); el.__t=setTimeout(()=>el.classList.remove('show'),2200);
}
function setDirty(on){ __DIRTY=!!on; document.querySelector('.tab-btn.active')?.classList.toggle('badge',__DIRTY); }

/* ---- Draft / Snap ---- */
const Draft={
  key:tab=>`ttl:admin:draft:${tab}`,
  load(tab){ try{ return JSON.parse(localStorage.getItem(Draft.key(tab))||'null'); }catch{return null;} },
  save(tab,data){ try{ localStorage.setItem(Draft.key(tab),JSON.stringify(data)); }catch{} },
  clear(tab){ localStorage.removeItem(Draft.key(tab)); },
};
const Snap={
  key:(tab,ts)=>`ttl:admin:snap:${tab}:${ts}`,
  save(tab,data){
    const ts=new Date().toISOString().split(':').join('').slice(0,15);
    try{ localStorage.setItem(Snap.key(tab,ts),JSON.stringify(data)); }catch{}
    toast(`已创建发布快照 ${ts}`);
  }
};
function collectFields(obj){
  const out={}; for(const [k,el] of Object.entries(obj||{})){
    if(!el) continue;
    out[k]=/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)? el.value:null;
  } return out;
}
function applyFields(obj,data){ if(!data) return; for(const [k,v] of Object.entries(data)){ if(obj[k] && typeof v==='string') obj[k].value=v; } }
function wireDraft(tab,fields,{onChange}={}){
  const cached=Draft.load(tab); if(cached) applyFields(fields,cached);
  const save=()=>{ Draft.save(tab,collectFields(fields)); setDirty(true); onChange&&onChange(); };
  let t=null;
  for(const el of Object.values(fields)){
    if(!el?.addEventListener) continue;
    el.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(save,250);});
    el.addEventListener('change',()=>{clearTimeout(t);t=setTimeout(save,0);});
  }
  return { clear(){ Draft.clear(tab); setDirty(false); }, snapshot(data){ Snap.save(tab,data); } };
}

/* ---- Textarea UX ---- */
function autosize(el){
  if(!el||el.dataset.autosizeBound==='1')return; el.dataset.autosizeBound='1';
  const fit=()=>{ el.style.height='auto'; el.style.height=(el.scrollHeight+2)+'px'; };
  el.addEventListener('input',fit,{passive:true}); fit();
}
function cleanPaste(el){
  if(!el||el.dataset.cleanPasteBound==='1')return; el.dataset.cleanPasteBound='1';
  el.addEventListener('paste',e=>{
    const t=e.clipboardData?.getData('text/plain'); if(!t)return;
    e.preventDefault(); const s=el.selectionStart,d=el.selectionEnd,v=el.value;
    el.value=v.slice(0,s)+t+v.slice(d); el.selectionStart=el.selectionEnd=s+t.length;
    el.dispatchEvent(new Event('input',{bubbles:true}));
  });
}
function attachCounter(el,where){
  if(!el||el.dataset.counterBound==='1')return; el.dataset.counterBound='1';
  let slot=where||Object.assign(document.createElement('div'),{className:'counter'});
  if(!where) el.insertAdjacentElement('afterend',slot);
  let raf=0; const update=()=>{ if(raf)cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{
    const txt=el.value||''; const lines=txt.split(/\r?\n/).filter(Boolean).length; slot.textContent=`${lines} 行 · ${txt.length} 字`;
  })};
  el.addEventListener('input',update,{passive:true}); update();
}
function renderPreviewText(raw){
  const val=(raw||'').trim(); if(!val)return'';
  const lines=val.split(/\r?\n/).filter(Boolean).map(s=>s.trim());
  return `<ul>${lines.map(s=>`<li>${s}</li>`).join('')}</ul>`;
}
function wireLivePreview(panel){
  if(!panel||panel.dataset.livePreviewBound==='1')return;
  const panes=$$('.preview-pane',panel); if(!panes.length)return;
  const src=$('textarea[data-preview],textarea',panel); if(!src)return;
  let raf=0; const render=()=>{const html=renderPreviewText(src.value);panes.forEach(p=>p.innerHTML=html);};
  const onInput=()=>{if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(render);};
  src.addEventListener('input',onInput,{passive:true}); panel.dataset.livePreviewBound='1'; render();
}
function initTextareaUX(scope=document){ $$('textarea',scope).forEach(ta=>{ autosize(ta); cleanPaste(ta); if(!ta.classList.contains('no-counter')) attachCounter(ta); }); }

/* ---- Tabs ---- */
const ACTIVE_TAB_KEY='ttl:admin:activeTab';
function activateTab(name){
  $$('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  $$('.tab-panel').forEach(p=>p.classList.toggle('active',p.id==='tab-'+name));
  localStorage.setItem(ACTIVE_TAB_KEY,name);
  const panel=$('#tab-'+name); if(panel){ initTextareaUX(panel); wireLivePreview(panel); }
}
function setupTabs(){
  $$('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.tab)));
  const saved=localStorage.getItem(ACTIVE_TAB_KEY),first=$$('.tab-btn')[0]?.dataset.tab;
  activateTab(saved||first);
}

/* ---------------- Diagnostics ---------------- */
function bindDiagnostics(){
  const btn=$('#run-diag'),wrap=$('#diag-wrap'),status=$('#diag-status'),out=$('#diag-output');
  if(!btn||!wrap)return;
  btn.addEventListener('click',async()=>{
    wrap.style.display='block'; if(status)status.textContent='正在运行诊断...'; if(out)out.textContent='';
    try{
      const r=await fetch('/api/admin/diag?_='+Date.now(),{credentials:'include',cache:'no-store'});
      const text=await r.text(); let j=null; try{ j=JSON.parse(text);}catch{}
      if(!r.ok) throw new Error((j&&j.error)||text||('HTTP '+r.status));
      if(status){ const env=j.env?.vercelEnv||'未知',token=j.tokenDetected?'令牌正常':'令牌缺失',conn=j.connectivity?.ok?'连通正常':('连接异常: '+(j.connectivity?.error||'n/a')); status.textContent=`Env: ${env} · ${token} · ${conn}`; }
      if(out) out.textContent=JSON.stringify(j,null,2);
    }catch(e){ if(status)status.textContent='诊断失败: '+(e.message||e); }
  });
}

/* ---------------- Daily Brief ---------------- */
function bindDailyBrief(){
  const fields={ slug:$('#b-slug'), title:$('#b-title'), bullets:$('#b-bullets'), schedule:$('#b-schedule'), symbol:$('#b-symbol'), interval:$('#b-interval') };
  const msg=$('#b-msg'),indexView=$('#b-index');
  const btnPublish=$('#b-publish'),btnDelete=$('#b-delete'),btnReuse=$('#b-reuse'),btnPreview=$('#b-preview'),btnClear=$('#b-clear'),btnRefresh=$('#b-refresh');

  initTextareaUX($('#tab-brief')); wireLivePreview($('#tab-brief'));
  const ensureDefaultSlug=()=>{ if(fields.slug && !fields.slug.value) fields.slug.value=today(); };
  const clearForm=()=>{ if(fields.slug)fields.slug.value=today(); ['title','bullets','schedule','symbol'].forEach(k=>fields[k]&&(fields[k].value='')); if(fields.interval)fields.interval.value='60'; };
  const populate=doc=>{ if(!doc)return; if(fields.slug)fields.slug.value=doc.slug||today(); if(fields.title)fields.title.value=doc.title||''; if(fields.bullets)fields.bullets.value=joinLines(doc.bullets); if(fields.schedule)fields.schedule.value=joinLines(doc.schedule); if(fields.symbol)fields.symbol.value=(doc.chart&&doc.chart.symbol)||doc.symbol||''; if(fields.interval)fields.interval.value=(doc.chart&&doc.chart.interval)||'60'; };

  wireDraft('brief',fields,{onChange(){ wireLivePreview($('#tab-brief')); }});
  attachCounter(fields.bullets); attachCounter(fields.schedule);

  ensureDefaultSlug(); refreshIndexView('daily-brief',indexView);

  btnPublish?.addEventListener('click',async()=>{
    ensureDefaultSlug(); if(msg) msg.textContent='正在发布...';
    try{
      const payload={ slug:(fields.slug?.value||today()).trim(), title:fields.title?.value?.trim()||undefined, bullets:splitLines(fields.bullets?.value||''), schedule:splitLines(fields.schedule?.value||''), chart:{ symbol:fields.symbol?.value?.trim()||undefined, interval:fields.interval?.value||'60' } };
      const r=await __apiFetch(`/api/daily-brief/${encodeURIComponent(payload.slug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功 ✓'; Draft.clear('brief'); await refreshIndexView('daily-brief',indexView);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e); }
  });

  btnDelete?.addEventListener('click',async()=>{
    ensureDefaultSlug(); const slug=fields.slug?.value?.trim(); if(!slug)return;
    if(!confirm(`确认删除每日简报：${slug}？`))return;
    if(msg) msg.textContent='正在删除...';
    try{
      const r=await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`,{method:'DELETE'});
      unwrapResponse(r,'DELETE_FAILED');
      if(msg) msg.textContent='删除成功 ✓';
      // 乐观更新
      optimisticRemoveFromIndex(indexView, 'slug', slug);
      // 然后强刷一次，确保与服务端一致
      await refreshIndexView('daily-brief',indexView);
      Draft.clear('brief');
    }catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e); }
  });

  btnReuse?.addEventListener('click',async()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('daily-brief'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.slug; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('daily-brief',latest); populate(doc||{}); if(fields.slug) fields.slug.value=today();
      if(msg) msg.textContent=`已载入 ${latest}，Slug 自动改为今日。`; wireLivePreview($('#tab-brief'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e); }
  });

  btnPreview?.addEventListener('click',()=>{ ensureDefaultSlug(); const slug=fields.slug?.value?.trim()||today(); window.open(`/#/daily-brief/${encodeURIComponent(slug)}`,'_blank','noopener'); });
  btnClear?.addEventListener('click',()=>{ clearForm(); Draft.clear('brief'); if(msg) msg.textContent=''; wireLivePreview($('#tab-brief')); });
  btnRefresh?.addEventListener('click',()=> refreshIndexView('daily-brief',indexView));
}

/* ---------------- Research Articles ---------------- */
function bindResearchArticles(){
  const f={ slug:$('#ra-slug'), title:$('#ra-title'), excerpt:$('#ra-excerpt'), tags:$('#ra-tags'), hero:$('#ra-hero'), body:$('#ra-body') };
  const msg=$('#ra-msg'), idx=$('#ra-index');
  const btn={ publish:$('#ra-publish'), delete:$('#ra-delete'), reuse:$('#ra-reuse'), preview:$('#ra-preview'), clear:$('#ra-clear'), refresh:$('#ra-refresh') };

  initTextareaUX($('#tab-articles')); wireLivePreview($('#tab-articles'));
  attachCounter(f.excerpt); attachCounter(f.body);
  const draft=wireDraft('research-articles',f,{onChange(){wireLivePreview($('#tab-articles'));}});

  const clear=()=>{ ['slug','title','excerpt','tags','hero','body'].forEach(k=>f[k]&&(f[k].value='')); };
  const fill=doc=>{ if(!doc)return; f.slug&&(f.slug.value=doc.slug||''); f.title&&(f.title.value=doc.title||''); f.excerpt&&(f.excerpt.value=doc.excerpt||''); f.tags&&(f.tags.value=Array.isArray(doc.tags)?doc.tags.join(', '):''); f.hero&&(f.hero.value=doc.hero||''); f.body&&(f.body.value=doc.body||''); };

  refreshIndexView('research/articles', idx);

  btn.publish?.addEventListener('click', async ()=>{
    const slugRaw=f.slug?.value?.trim(); if(!slugRaw) return msg && (msg.textContent='请输入 slug');
    const safeSlug=slugRaw.replace(/[\\/]+/g,'-');
    if(msg) msg.textContent='正在发布...';
    try{
      const payload={ slug:safeSlug, title:f.title?.value?.trim()||undefined, excerpt:f.excerpt?.value?.trim()||undefined, tags:splitLines((f.tags?.value||'').replace(/,/g,'\n')), hero:f.hero?.value?.trim()||undefined, date:new Date().toISOString(), body:f.body?.value||'' };
      const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(safeSlug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功 ✓'; draft.clear(); await refreshIndexView('research/articles', idx);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e); }
  });

  btn.delete?.addEventListener('click', async ()=>{
    const slugRaw=f.slug?.value?.trim(); if(!slugRaw) return msg && (msg.textContent='请输入 slug');
    const safeSlug=slugRaw.replace(/[\\/]+/g,'-');
    if(!confirm(`确认删除研究文章：${safeSlug}？`)) return;
    if(msg) msg.textContent='正在删除...';
    try{
      const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(safeSlug)}.json`,{method:'DELETE'});
      unwrapResponse(r,'DELETE_FAILED');
      if(msg) msg.textContent='删除成功 ✓';
      optimisticRemoveFromIndex(idx,'slug',safeSlug);
      await refreshIndexView('research/articles', idx);
      draft.clear();
    }catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e); }
  });

  btn.reuse?.addEventListener('click', async ()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('research/articles'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.slug; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('research/articles', latest); fill(doc||{}); if(f.slug&&doc?.slug) f.slug.value=`${doc.slug}-${today()}`;
      if(msg) msg.textContent=`已载入 ${latest}，Slug 已追加今日日期。`; wireLivePreview($('#tab-articles'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e); }
  });

  btn.preview?.addEventListener('click', ()=>{ const slug=f.slug?.value?.trim(); if(!slug)return; const safeSlug=slug.replace(/[\\/]+/g,'-'); window.open(`/#/articles/${encodeURIComponent(safeSlug)}`,'_blank','noopener'); });
  btn.clear?.addEventListener('click', ()=>{ clear(); draft.clear(); if(msg) msg.textContent=''; wireLivePreview($('#tab-articles')); });
  btn.refresh?.addEventListener('click', ()=> refreshIndexView('research/articles', idx));
}

/* ---------------- Analyses ---------------- */
function bindAnalyses(){
  const f = {
    slug:$('#a-slug'), title:$('#a-title'), symbol:$('#a-symbol'), tf:$('#a-tf'),
    date:$('#a-date'), bias:$('#a-bias'), tags:$('#a-tags'),
    supports:$('#a-supports'), resistances:$('#a-resistances'),
    context:$('#a-context'), view:$('#a-view'), invalidation:$('#a-invalidation'),
    chartSymbol:$('#a-chart-symbol'), chartInterval:$('#a-chart-interval')
  };
  const msg = $('#a-msg'), idx = $('#a-index');

  initTextareaUX($('#tab-analyses')); wireLivePreview($('#tab-analyses'));
  attachCounter(f.supports); attachCounter(f.resistances);
  attachCounter(f.context);  attachCounter(f.view);
  const draft = wireDraft('analyses', f, { onChange(){ wireLivePreview($('#tab-analyses')); } });

  const clear = ()=>{ for(const k in f){ if(f[k] && f[k].tagName) f[k].value=''; } if(f.chartInterval) f.chartInterval.value='60'; };
  const fill  = (d={})=>{
    f.slug&&(f.slug.value=d.slug||'');
    f.title&&(f.title.value=d.title||'');
    f.symbol&&(f.symbol.value=d.symbol||'');
    f.tf&&(f.tf.value=d.tf||d.timeframe||'');
    f.date&&(f.date.value=d.date||'');
    f.bias&&(f.bias.value=d.bias||'neutral');
    f.tags&&(f.tags.value=Array.isArray(d.tags)? d.tags.join(', '):'');
    f.supports&&(f.supports.value=(Array.isArray(d.supports)? d.supports.join('\n'):(d.supports||'')));
    f.resistances&&(f.resistances.value=(Array.isArray(d.resistances)? d.resistances.join('\n'):(d.resistances||'')));
    f.context&&(f.context.value=d.context||'');
    f.view&&(f.view.value=d.view||'');
    f.invalidation&&(f.invalidation.value=d.invalidation||'');
    f.chartSymbol&&(f.chartSymbol.value=(d.chart&&d.chart.symbol)||'');
    f.chartInterval&&(f.chartInterval.value=(d.chart&&d.chart.interval)||'60');
  };

  // 首次渲染索引
  refreshIndexView('analyses', idx);

  // 发布
  $('#a-publish')?.addEventListener('click', async ()=>{
    const slug = (f.slug?.value||'').trim();
    if(!slug){ msg && (msg.textContent='请输入 slug'); return; }
    msg && (msg.textContent='正在发布...');
    try{
      const payload = {
        slug,
        title: f.title?.value?.trim()||undefined,
        symbol: f.symbol?.value?.trim()||undefined,
        tf: f.tf?.value?.trim()||undefined,
        date: f.date?.value?.trim()||new Date().toISOString().slice(0,10),
        bias: f.bias?.value||'neutral',
        tags: splitLines((f.tags?.value||'').replace(/,/g,'\n')),
        supports: splitLines(f.supports?.value||''),
        resistances: splitLines(f.resistances?.value||''),
        context: f.context?.value||'',
        view: f.view?.value||'',
        invalidation: f.invalidation?.value||'',
        chart: { symbol: f.chartSymbol?.value?.trim()||undefined, interval: f.chartInterval?.value||'60' }
      };
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, {
        method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
      });
      unwrapResponse(r,'PUBLISH_FAILED');
      msg && (msg.textContent='发布成功 ✓');
      draft.clear();
      await refreshIndexView('analyses', idx);
    }catch(e){ msg && (msg.textContent='发布失败: '+(e.message||e)); }
  });

  // 删除
  $('#a-delete')?.addEventListener('click', async ()=>{
    const slug = (f.slug?.value||'').trim(); if(!slug) return;
    if(!confirm(`确认删除市场分析：${slug}？`)) return;
    msg && (msg.textContent='正在删除...');
    try{
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
      unwrapResponse(r,'DELETE_FAILED');
      msg && (msg.textContent='删除成功 ✓');
      // 乐观更新 + 强刷
      optimisticRemoveFromIndex(idx,'slug',slug);
      await refreshIndexView('analyses', idx);
    }catch(e){ msg && (msg.textContent='删除失败: '+(e.message||e)); }
  });

  // 载入线上最新
  $('#a-reuse')?.addEventListener('click', async ()=>{
    msg && (msg.textContent='正在载入线上数据...');
    try{
      const list = await fetchIndex('analyses');
      if(!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0]==='string' ? list[0] : (list[0]?.slug);
      const doc = await fetchDocument('analyses', latest);
      fill(doc||{});
      msg && (msg.textContent=`已载入 ${latest}。`);
    }catch(e){ msg && (msg.textContent='载入线上数据失败: '+(e.message||e)); }
  });

  $('#a-preview')?.addEventListener('click', ()=>{
    const slug = (f.slug?.value||'').trim(); if(!slug) return;
    window.open(`/#/analyses/${encodeURIComponent(slug)}`,'_blank','noopener');
  });
  $('#a-clear')?.addEventListener('click', ()=>{ clear(); draft.clear(); msg && (msg.textContent=''); });
  $('#a-refresh')?.addEventListener('click', ()=> refreshIndexView('analyses', idx));
}

/* ---------------- Market News ---------------- */
function bindMarketNews(){
  const f = {
    id: $('#n-id'), title: $('#n-title'), source: $('#n-source'),
    url: $('#n-url'), date: $('#n-date'), tags: $('#n-tags'),
    summary: $('#n-summary'), bullets: $('#n-bullets')
  };
  const msg = $('#n-msg'), idx = $('#n-index');

  initTextareaUX($('#tab-news')); wireLivePreview($('#tab-news'));
  attachCounter(f.summary); attachCounter(f.bullets);
  const draft = wireDraft('market-news', f, { onChange(){ wireLivePreview($('#tab-news')); } });

  const clear = ()=>{ for(const k in f){ if(f[k] && f[k].tagName) f[k].value=''; } };
  const fill  = (d={})=>{
    f.id&&(f.id.value=d.id||'');
    f.title&&(f.title.value=d.title||'');
    f.source&&(f.source.value=d.source||d.provider||'');
    f.url&&(f.url.value=d.url||d.link||'');
    f.date&&(f.date.value=d.date||d.time||'');
    f.tags&&(f.tags.value=Array.isArray(d.tags)? d.tags.join(', '):'');
    f.summary&&(f.summary.value=d.summary||d.excerpt||'');
    f.bullets&&(f.bullets.value=(Array.isArray(d.bullets)? d.bullets.join('\n'): (d.bullets||'')));
  };

  // 首次渲染索引
  refreshIndexView('market-news', idx);

  // 发布（索引维护在服务端 POST /api/market-news/index.json）
  $('#n-publish')?.addEventListener('click', async ()=>{
    let id = (f.id?.value||'').trim();
    if(!id){
      const t = new Date();
      id = t.toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
      if(f.id) f.id.value = id;
    }
    msg && (msg.textContent='正在发布...');
    try{
      const payload = {
        id,
        title: f.title?.value?.trim()||'',
        source: f.source?.value?.trim()||'',
        url: f.url?.value?.trim()||'',
        date: f.date?.value?.trim()||new Date().toISOString(),
        tags: splitLines((f.tags?.value||'').replace(/,/g,'\n')),
        summary: f.summary?.value||'',
        bullets: splitLines(f.bullets?.value||'')
      };
      const r = await __apiFetch(`/api/market-news/index.json`, {
        method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
      });
      unwrapResponse(r,'PUBLISH_FAILED');
      msg && (msg.textContent='发布成功 ✓');
      draft.clear();
      await refreshIndexView('market-news', idx);
    }catch(e){ msg && (msg.textContent='发布失败: '+(e.message||e)); }
  });

  // 删除
  $('#n-delete')?.addEventListener('click', async ()=>{
    const id = (f.id?.value||'').trim(); if(!id) return;
    if(!confirm(`确认删除快讯：${id}？`)) return;
    msg && (msg.textContent='正在删除...');
    try{
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method:'DELETE' });
      unwrapResponse(r,'DELETE_FAILED');
      msg && (msg.textContent='删除成功 ✓');
      optimisticRemoveFromIndex(idx,'id',id);
      await refreshIndexView('market-news', idx);
    }catch(e){ msg && (msg.textContent='删除失败: '+(e.message||e)); }
  });

  // 载入线上最新
  $('#n-reuse')?.addEventListener('click', async ()=>{
    msg && (msg.textContent='正在载入线上数据...');
    try{
      const list = await fetchIndex('market-news');
      if(!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0]==='string' ? list[0] : (list[0]?.id || list[0]?.slug);
      const doc = await fetchDocument('market-news', latest);
      fill(doc||{});
      msg && (msg.textContent=`已载入 ${latest}。`);
    }catch(e){ msg && (msg.textContent='载入线上数据失败: '+(e.message||e)); }
  });

  $('#n-preview')?.addEventListener('click', ()=>{
    const id = (f.id?.value||'').trim(); if(!id) return;
    window.open(`/#/market-news/${encodeURIComponent(id)}`,'_blank','noopener');
  });
  $('#n-clear')?.addEventListener('click', ()=>{ clear(); draft.clear(); msg && (msg.textContent=''); });
  $('#n-refresh')?.addEventListener('click', ()=> refreshIndexView('market-news', idx));
}

/* ---------------- Syllabus（前后台共用 /research/syllabus.json） ---------------- */
function bindSyllabus(){
  const wrap = $('#lesson-list');
  const msgEl = $('#lesson-list-msg');

  const f = {
    level: $('#lesson-level'),
    name:  $('#lesson-name'),
    slug:  $('#lesson-slug'),
    title: $('#lesson-article-title'),
    excerpt: $('#lesson-article-excerpt'),
    tags: $('#lesson-article-tags'),
    hero: $('#lesson-article-hero'),
    body: $('#lesson-article-body'),
    msg: $('#lesson-msg')
  };

  const btn = {
    save:    $('#lesson-save'),
    del:     $('#lesson-delete'),
    preview: $('#lesson-preview'),
    open:    $('#lesson-open')
  };

  initTextareaUX($('#tab-syllabus'));
  wireLivePreview($('#tab-syllabus'));
  attachCounter(f.excerpt);
  attachCounter(f.body);

  let current = { group:null, lesson:null };

  const renderList = (syl)=>{
    wrap.innerHTML = '';
    const groups = Array.isArray(syl?.groups) ? syl.groups : [];
    if (!groups.length){
      msgEl && (msgEl.textContent = '加载失败：syllabus.json 结构为空或不符合 {groups:[{level,lessons:[...] }]}');
      return;
    }
    msgEl && (msgEl.textContent = '');
    groups.forEach((g, gi)=>{
      const sec = document.createElement('div');
      sec.className = 'lesson-group';
      sec.innerHTML = `<h4>${escapeHTML(g.level || `Group ${gi+1}`)}</h4>`;
      (g.lessons || []).forEach(ls=>{
        const b = document.createElement('button');
        b.className = 'lesson-item';
        b.innerHTML = `${escapeHTML(ls.name || ls.title || ls.slug || 'Lesson')}<span>${escapeHTML(ls.slug||'')}</span>`;
        b.addEventListener('click', ()=> select(g, ls, b));
        sec.appendChild(b);
      });
      wrap.appendChild(sec);
    });
  };

  const select = async (group, lesson, btnEl)=>{
    current = { group, lesson };
    $$('.lesson-item', wrap).forEach(x=>x.classList.toggle('active', x===btnEl));
    f.level.textContent = group?.level || '';
    f.name.textContent  = lesson?.name || lesson?.title || '';
    f.slug.value        = (lesson?.slug || '').trim();
    f.title.value       = (lesson?.name || lesson?.title || '');
    f.excerpt.value     = '';
    f.tags.value        = '';
    f.hero.value        = '';
    f.body.value        = '';
    // 若已存在同名文章，自动加载进来编辑
    if (lesson?.slug){
      try{
        const doc = await fetchDocument('research/articles', lesson.slug);
        if (doc){
          f.title.value   = doc.title   || f.title.value;
          f.excerpt.value = doc.excerpt || '';
          f.tags.value    = Array.isArray(doc.tags)? doc.tags.join(', ') : '';
          f.hero.value    = doc.hero    || '';
          f.body.value    = doc.body    || '';
        }
      }catch{}
    }
  };

  btn.save?.addEventListener('click', async ()=>{
    const slug = f.slug.value.trim();
    if (!slug){ f.msg.textContent = '请输入 slug'; return; }
    f.msg.textContent = '正在保存…';
    try{
      const payload = {
        slug,
        title: f.title.value.trim() || (current.lesson?.name || current.lesson?.title) || undefined,
        excerpt: f.excerpt.value.trim() || undefined,
        tags: splitLines((f.tags.value || '').replace(/,/g,'\n')),
        hero: f.hero.value.trim() || undefined,
        body: f.body.value || '',
        date: new Date().toISOString()
      };
      const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, {
        method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
      });
      unwrapResponse(r,'SAVE_FAILED');
      f.msg.textContent = '保存成功 ✓';
    }catch(e){ f.msg.textContent = '保存失败：' + (e.message||e); }
  });

  btn.del?.addEventListener('click', async ()=>{
    const slug = f.slug.value.trim();
    if (!slug){ f.msg.textContent = '请输入 slug'; return; }
    if (!confirm(`确认删除文章：${slug}？`)) return;
    f.msg.textContent = '正在删除…';
    try{
      const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
      unwrapResponse(r,'DELETE_FAILED');
      f.msg.textContent = '删除成功 ✓';
      optimisticRemoveFromIndex($('#ra-index'),'slug',slug);
      await refreshIndexView('research/articles', $('#ra-index'));
    }catch(e){ f.msg.textContent = '删除失败：' + (e.message||e); }
  });

  btn.preview?.addEventListener('click', ()=>{
    const slug = f.slug.value.trim();
    if (slug) window.open(`/#/articles/${encodeURIComponent(slug)}`,'_blank','noopener');
  });
  btn.open?.addEventListener('click', ()=>{
    const slug = f.slug.value.trim();
    if (slug) window.open(`/api/research/articles/${encodeURIComponent(slug)}.json`,'_blank','noopener');
  });

  (async ()=>{
    msgEl && (msgEl.textContent = '正在加载课程大纲…');
    const syl = await getJSONWithFallbacks([
      '/research/syllabus.json',
      '/server/research/syllabus.json',
      '/public/research/syllabus.json'
    ]);
    if (!syl){ msgEl && (msgEl.textContent = '加载失败：找不到 /research/syllabus.json'); return; }
    renderList(syl);
  })().catch(e=>{ msgEl && (msgEl.textContent = '加载失败：' + (e.message||e)); });
}

/* ---------------- Boot ---------------- */
let __BOOTED=false;
function boot(){
  if(__BOOTED) return; __BOOTED=true;
  try{
    setupTabs();
    bindDiagnostics();
    bindDailyBrief();
    bindResearchArticles();
    bindAnalyses();        // 市场分析
    bindMarketNews();      // 市场快讯
    bindSyllabus();        // 课程大纲
    console.log('[admin] booted');
  }catch(e){
    console.error('[admin] boot error:', e);
    toast('Admin 初始化失败：'+(e.message||e));
  }
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

window.Admin = { ...(window.Admin||{}), setToken:(t)=>{ __setToken(t); toast('Token 已更新'); } };
