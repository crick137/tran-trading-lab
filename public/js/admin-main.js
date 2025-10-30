// public/js/admin-main.js
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

/* ---------------- Fetch ---------------- */
async function __apiFetch(url, init={}){
  if (window.Admin && typeof window.Admin.apiFetch === 'function') {
    return window.Admin.apiFetch(url, init);
  }
  const opts = { credentials:'include', cache:'no-store', ...init };
  if (!opts.method) opts.method = 'GET';
  const headers = new Headers(opts.headers || {});
  if (__ADMIN_TOKEN) headers.set('Authorization', 'Bearer '+__ADMIN_TOKEN);
  if (!headers.has('content-type') && typeof opts.body === 'string') {
    headers.set('content-type', 'application/json;charset=utf-8');
  }
  opts.headers = headers;
  const ctrl = new AbortController();
  const t = setTimeout(()=>{ try{ctrl.abort()}catch{} }, 12000);
  opts.signal = ctrl.signal;
  try{
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null; try{ data = JSON.parse(text) }catch{}
    return { res, ok:res.ok, status:res.status, data, text };
  }finally{ clearTimeout(t) }
}
function unwrapResponse(r, ctx){
  if (!r.ok) {
    const m = (r.data && (r.data.error || r.data.message)) || r.text || ctx || ('HTTP '+r.status);
    throw new Error(m);
  }
  return r.data;
}

/* ---------------- Utils ---------------- */
const today = () => new Date().toISOString().slice(0,10);
const splitLines = v => (v||'').split('\n').map(s=>s.trim()).filter(Boolean);
const joinLines  = a => Array.isArray(a) ? a.join('\n') : '';
const safeStringify = v => { try{ return JSON.stringify(v,null,2) }catch{ return '' } };

async function fetchIndex(prefix){
  const r = await __apiFetch(`/api/${prefix}/index.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_INDEX_FAILED');
}
async function fetchDocument(prefix, slug){
  const r = await __apiFetch(`/api/${prefix}/${encodeURIComponent(slug)}.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_DOCUMENT_FAILED');
}
async function refreshIndexView(prefix, target){
  if (!target) return;
  target.textContent = '正在加载...';
  try{
    const list = await fetchIndex(prefix);
    target.textContent = JSON.stringify(list, null, 2);
  }catch(e){ target.textContent = '失败: '+(e.message||e) }
}

/* ---- toast / dirty ---- */
let __DIRTY=false;
window.addEventListener('beforeunload', e=>{ if(__DIRTY){ e.preventDefault(); e.returnValue=''; }});
function toast(msg){
  let el = document.querySelector('.toast');
  if(!el){ el=document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el.__t); el.__t=setTimeout(()=>el.classList.remove('show'),2200);
}
function setDirty(on){ __DIRTY=!!on; document.querySelector('.tab-btn.active')?.classList.toggle('badge', __DIRTY); }

/* ---- Draft / Snap ---- */
const Draft = {
  key:tab=>`ttl:admin:draft:${tab}`,
  load(tab){ try{ return JSON.parse(localStorage.getItem(Draft.key(tab))||'null') }catch{ return null } },
  save(tab,data){ try{ localStorage.setItem(Draft.key(tab), JSON.stringify(data)) }catch{} },
  clear(tab){ localStorage.removeItem(Draft.key(tab)) },
};
const Snap = {
  key:(tab,ts)=>`ttl:admin:snap:${tab}:${ts}`,
  save(tab,data){
    const ts = new Date().toISOString().split(':').join('').slice(0,15);
    try{ localStorage.setItem(Snap.key(tab,ts), JSON.stringify(data)) }catch{}
    toast(`已创建发布快照 ${ts}`);
  }
};
function collectFields(obj){
  const out={}; for(const [k,el] of Object.entries(obj||{})){
    if(!el) continue; out[k] = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)? el.value : null;
  } return out;
}
function applyFields(obj,data){ if(!data) return; for(const [k,v] of Object.entries(data)){ if(obj[k] && typeof v==='string') obj[k].value=v; } }
function wireDraft(tab, fields, {onChange}={}){
  const cached = Draft.load(tab); if(cached) applyFields(fields, cached);
  const save=()=>{ Draft.save(tab, collectFields(fields)); setDirty(true); onChange && onChange(); };
  let t=null;
  for(const el of Object.values(fields)){
    if(!el?.addEventListener) continue;
    el.addEventListener('input', ()=>{ clearTimeout(t); t=setTimeout(save,250); });
    el.addEventListener('change', ()=>{ clearTimeout(t); t=setTimeout(save,0); });
  }
  return { clear(){ Draft.clear(tab); setDirty(false); }, snapshot(data){ Snap.save(tab,data); } };
}

/* ---- Textarea UX (bind once) ---- */
function autosize(el){
  if(!el || el.dataset.autosizeBound==='1') return; el.dataset.autosizeBound='1';
  const fit=()=>{ el.style.height='auto'; el.style.height=(el.scrollHeight+2)+'px'; };
  el.addEventListener('input', fit, {passive:true}); fit();
}
function cleanPaste(el){
  if(!el || el.dataset.cleanPasteBound==='1') return; el.dataset.cleanPasteBound='1';
  el.addEventListener('paste', e=>{
    const t=e.clipboardData?.getData('text/plain'); if(!t) return;
    e.preventDefault(); const s=el.selectionStart, d=el.selectionEnd, v=el.value;
    el.value = v.slice(0,s)+t+v.slice(d); el.selectionStart=el.selectionEnd=s+t.length;
    el.dispatchEvent(new Event('input',{bubbles:true}));
  });
}
function attachCounter(el, where){
  if(!el || el.dataset.counterBound==='1') return; el.dataset.counterBound='1';
  let slot = where || Object.assign(document.createElement('div'),{className:'counter'});
  if(!where) el.insertAdjacentElement('afterend',slot);
  let raf=0; const update=()=>{ if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{
    const txt=el.value||''; const lines=txt.split(/\r?\n/).filter(Boolean).length; slot.textContent=`${lines} 行 · ${txt.length} 字`;
  })};
  el.addEventListener('input', update, {passive:true}); update();
}

/* ---- Inline toolbar (bold / italic / quote / code / list / split) ---- */
function insertAtCursor(el, before = '', after = '') {
  el.focus();
  const s = el.selectionStart ?? el.value.length;
  const e = el.selectionEnd ?? el.value.length;
  const v = el.value;
  const selected = v.slice(s, e);
  if (before === '• ') {
    const head = v.slice(0, s);
    const body = v.slice(s, e);
    const tail = v.slice(e);
    const lines = body.split(/\r?\n/).map(x => x ? '• ' + x.replace(/^([•\-\*]\s+)/, '') : '• ');
    const txt = lines.join('\n');
    el.value = head + txt + tail;
    const pos = head.length + txt.length;
    el.setSelectionRange(pos, pos);
  } else {
    el.value = v.slice(0, s) + before + selected + after + v.slice(e);
    const pos = s + before.length + selected.length + after.length;
    el.setSelectionRange(pos, pos);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
function bindInlineToolbar(scope) {
  const root = scope || document;
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-md]');
    if (!btn) return;
    const container = btn.closest('.field, .editor, .grid, .card, .section, .tab-panel') || root;
    const ta = container.querySelector('textarea');
    if (!ta) return;
    const cmd = btn.dataset.md;
    switch (cmd) {
      case 'bold':   insertAtCursor(ta, '**', '**'); break;
      case 'italic': insertAtCursor(ta, '*', '*'); break;
      case 'quote':  insertAtCursor(ta, '> ', ''); break;
      case 'code':   insertAtCursor(ta, '`', '`'); break;
      case 'list':   insertAtCursor(ta, '• ', ''); break;
      case 'split': {
        const block = [
          '::: cols',
          ':: left',
          '左栏内容……',
          ':: right',
          '右栏内容……',
          ':::',
          ''
        ].join('\n');
        insertAtCursor(ta, block, '');
        break;
      }
      default: return;
    }
  });
}

/* ---- Live preview (throttled) ---- */
function renderPreviewText(raw){
  const val=(raw||'').trim(); if(!val) return '';
  if (typeof window.md==='function'){ try{ return window.md(val) }catch{} }
  const lines = val.split(/\r?\n/).filter(Boolean).map(s=>s.trim());
  return `<ul>${lines.map(s=>`<li>${s}</li>`).join('')}</ul>`;
}
function wireLivePreview(panel){
  if(!panel || panel.dataset.livePreviewBound==='1') return;
  const panes = $$('.preview-pane', panel); if(!panes.length) return;
  const src = $('textarea[data-preview], textarea', panel); if(!src) return;
  let raf=0, last=0;

  const render = () => {
    const val = src.value || '';
    if (val.length > 10000) {
      panes.forEach(p => p.innerHTML = '<em>内容较长，已暂停实时预览。</em>');
      return;
    }
    let html = '';
    try { html = renderPreviewText(val); } catch {}
    panes.forEach(p => p.innerHTML = html);
  };

  const onInput = () => {
    const now = performance.now();
    if (now - last < 120) {
      if (!raf) raf = requestAnimationFrame(() => { last = performance.now(); raf = 0; render(); });
      return;
    }
    last = now;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); });
  };

  src.addEventListener('input', onInput, { passive: true });
  panel.dataset.livePreviewBound='1';
  render();
}

/* ---- Shortcuts ---- */
document.addEventListener('keydown', e=>{
  const isMac=/Mac|iPhone|iPad/.test(navigator.platform), mod=isMac?e.metaKey:e.ctrlKey;
  if(mod && e.key.toLowerCase()==='s'){ e.preventDefault(); document.querySelector('.tab-panel.active .primary')?.click(); }
  if(mod && e.key.toLowerCase()==='k'){ e.preventDefault(); document.querySelector('.tab-panel.active [id$="-preview"]')?.click(); }
  if(mod && e.key.toLowerCase()==='l'){ e.preventDefault(); document.querySelector('.tab-panel.active [id$="-reuse"]')?.click(); }
  if(e.key==='Escape'){ document.getElementById('modal-close')?.click(); }
});

/* ---------------- Tabs ---------------- */
const ACTIVE_TAB_KEY='ttl:admin:activeTab';
function activateTab(name){
  $$('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
  $$('.tab-panel').forEach(p=>p.classList.toggle('active', p.id==='tab-'+name));
  localStorage.setItem(ACTIVE_TAB_KEY,name);
  const panel = $('#tab-'+name); if(panel){ initTextareaUX(panel); wireLivePreview(panel); bindInlineToolbar(panel); }
}
function setupTabs(){
  $$('.tab-btn').forEach(btn=> btn.addEventListener('click', ()=>activateTab(btn.dataset.tab)));
  const saved = localStorage.getItem(ACTIVE_TAB_KEY), first = $$('.tab-btn')[0]?.dataset.tab;
  activateTab(saved||first);
}

/* ---------------- Diagnostics ---------------- */
function bindDiagnostics(){
  const btn=$('#run-diag'), wrap=$('#diag-wrap'), status=$('#diag-status'), out=$('#diag-output');
  if(!btn||!wrap) return;
  btn.addEventListener('click', async ()=>{
    wrap.style.display='block'; if(status) status.textContent='正在运行诊断...'; if(out) out.textContent='';
    try{
      const r=await fetch('/api/admin/diag?_='+Date.now(),{credentials:'include',cache:'no-store'}); const text=await r.text();
      let j=null; try{ j=JSON.parse(text) }catch{}
      if(!r.ok) throw new Error((j&&j.error)||text||('HTTP '+r.status));
      if(status){ const env=j.env?.vercelEnv||'未知', token=j.tokenDetected?'令牌正常':'令牌缺失', conn=j.connectivity?.ok?'连通正常':('连接异常: '+(j.connectivity?.error||'n/a')); status.textContent=`Env: ${env} · ${token} · ${conn}`; }
      if(out) out.textContent=JSON.stringify(j,null,2);
    }catch(e){ if(status) status.textContent='诊断失败: '+(e.message||e); }
  });
}

/* ---------------- Daily Brief ---------------- */
function bindDailyBrief(){
  const fields={ slug:$('#b-slug'), title:$('#b-title'), bullets:$('#b-bullets'), schedule:$('#b-schedule'), symbol:$('#b-symbol'), interval:$('#b-interval') };
  const msg=$('#b-msg'), indexView=$('#b-index');
  const btnPublish=$('#b-publish'), btnDelete=$('#b-delete'), btnReuse=$('#b-reuse'), btnPreview=$('#b-preview'), btnClear=$('#b-clear'), btnRefresh=$('#b-refresh');

  initTextareaUX($('#tab-brief')); wireLivePreview($('#tab-brief')); bindInlineToolbar($('#tab-brief'));
  const ensureDefaultSlug=()=>{ if(fields.slug && !fields.slug.value) fields.slug.value=today(); };
  const clearForm=()=>{ if(fields.slug)fields.slug.value=today(); ['title','bullets','schedule','symbol'].forEach(k=>fields[k]&&(fields[k].value='')); if(fields.interval)fields.interval.value='60'; };
  const populate=doc=>{ if(!doc) return; if(fields.slug)fields.slug.value=doc.slug||today(); if(fields.title)fields.title.value=doc.title||''; if(fields.bullets)fields.bullets.value=joinLines(doc.bullets); if(fields.schedule)fields.schedule.value=joinLines(doc.schedule); if(fields.symbol)fields.symbol.value=(doc.chart&&doc.chart.symbol)||doc.symbol||''; if(fields.interval)fields.interval.value=(doc.chart&&doc.chart.interval)||'60'; };

  wireDraft('brief', fields, { onChange(){ wireLivePreview($('#tab-brief')); }});
  attachCounter(fields.bullets); attachCounter(fields.schedule);

  ensureDefaultSlug(); refreshIndexView('daily-brief', indexView);

  btnPublish?.addEventListener('click', async ()=>{
    ensureDefaultSlug(); if(msg) msg.textContent='正在发布...';
    try{
      const payload={ slug:(fields.slug?.value||today()).trim(), title:fields.title?.value?.trim()||undefined, bullets:splitLines(fields.bullets?.value||''), schedule:splitLines(fields.schedule?.value||''), chart:{ symbol:fields.symbol?.value?.trim()||undefined, interval:fields.interval?.value||'60' } };
      const r=await __apiFetch(`/api/daily-brief/${encodeURIComponent(payload.slug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功'; Draft.clear('brief'); await refreshIndexView('daily-brief', indexView);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e) }
  });

  btnDelete?.addEventListener('click', async ()=>{
    ensureDefaultSlug(); const slug=fields.slug?.value?.trim(); if(!slug) return;
    if(!confirm(`确认删除每日简报：${slug}？`)) return;
    if(msg) msg.textContent='正在删除...';
    try{ const r=await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`,{method:'DELETE'}); unwrapResponse(r,'DELETE_FAILED'); if(msg) msg.textContent='删除成功'; Draft.clear('brief'); await refreshIndexView('daily-brief', indexView);}catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e) }
  });

  btnReuse?.addEventListener('click', async ()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('daily-brief'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.slug; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('daily-brief', latest); populate(doc||{}); if(fields.slug) fields.slug.value=today();
      if(msg) msg.textContent=`已载入 ${latest}，Slug 自动改为今日。`; wireLivePreview($('#tab-brief'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e) }
  });

  btnPreview?.addEventListener('click', ()=>{ ensureDefaultSlug(); const slug=fields.slug?.value?.trim()||today(); window.open(`/#/daily-brief/${encodeURIComponent(slug)}`,'_blank','noopener'); });
  btnClear?.addEventListener('click', ()=>{ clearForm(); Draft.clear('brief'); if(msg) msg.textContent=''; wireLivePreview($('#tab-brief')); });
  btnRefresh?.addEventListener('click', ()=> refreshIndexView('daily-brief', indexView));
}

/* ---------------- Analyses ---------------- */
function bindAnalyses(){
  const f={ slug:$('#a-slug'), title:$('#a-title'), symbol:$('#a-symbol'), tf:$('#a-tf'), date:$('#a-date'), bias:$('#a-bias'), tags:$('#a-tags'), supports:$('#a-supports'), resistances:$('#a-resistances'), context:$('#a-context'), view:$('#a-view'), invalidation:$('#a-invalidation'), chartSymbol:$('#a-chart-symbol'), chartInterval:$('#a-chart-interval') };
  const msg=$('#a-msg'), idx=$('#a-index');
  const btn={ publish:$('#a-publish'), delete:$('#a-delete'), reuse:$('#a-reuse'), preview:$('#a-preview'), clear:$('#a-clear'), refresh:$('#a-refresh') };

  initTextareaUX($('#tab-analyses')); wireLivePreview($('#tab-analyses')); bindInlineToolbar($('#tab-analyses'));
  [f.supports,f.resistances,f.context,f.view].forEach(attachCounter);
  const draft=wireDraft('analyses', f, { onChange(){ wireLivePreview($('#tab-analyses')); }});

  const clear=()=>{ if(f.slug)f.slug.value=''; if(f.title)f.title.value=''; if(f.symbol)f.symbol.value=''; if(f.tf)f.tf.value=''; if(f.date)f.date.value=today(); if(f.bias)f.bias.value='neutral'; ['tags','supports','resistances','context','view','invalidation','chartSymbol'].forEach(k=>f[k]&&(f[k].value='')); if(f.chartInterval)f.chartInterval.value='60'; };
  const fill=doc=>{ if(!doc) return; f.slug&&(f.slug.value=doc.slug||''); f.title&&(f.title.value=doc.title||''); f.symbol&&(f.symbol.value=doc.symbol||''); f.tf&&(f.tf.value=doc.tf||doc.interval||''); f.date&&(f.date.value=doc.date||today()); f.bias&&(f.bias.value=doc.bias||'neutral'); f.tags&&(f.tags.value=Array.isArray(doc.tags)?doc.tags.join(', '):''); f.supports&&(f.supports.value=joinLines(doc.supports)); f.resistances&&(f.resistances.value=joinLines(doc.resistances)); f.context&&(f.context.value=doc.context||''); f.view&&(f.view.value=doc.view||''); f.invalidation&&(f.invalidation.value=doc.invalidation||''); f.chartSymbol&&(f.chartSymbol.value=(doc.chart&&doc.chart.symbol)||doc.chartSymbol||doc.symbol||''); f.chartInterval&&(f.chartInterval.value=(doc.chart&&doc.chart.interval)||doc.chartInterval||'60'); };

  refreshIndexView('analyses', idx);

  btn.publish?.addEventListener('click', async ()=>{
    const slug=f.slug?.value?.trim(); if(!slug) return msg && (msg.textContent='请输入 slug');
    if(msg) msg.textContent='正在发布...';
    try{
      const payload={ slug, title:f.title?.value?.trim()||undefined, symbol:f.symbol?.value?.trim()||undefined, tf:f.tf?.value?.trim()||undefined, date:f.date?.value?.trim()||today(), bias:f.bias?.value||'neutral', tags:splitLines((f.tags?.value||'').replace(/,/g,'\n')), supports:splitLines(f.supports?.value||''), resistances:splitLines(f.resistances?.value||''), context:f.context?.value?.trim()||undefined, view:f.view?.value?.trim()||undefined, invalidation:f.invalidation?.value?.trim()||undefined, chart:{ symbol:f.chartSymbol?.value?.trim()||undefined, interval:f.chartInterval?.value||'60' } };
      const r=await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功'; draft.clear(); await refreshIndexView('analyses', idx);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e) }
  });

  btn.delete?.addEventListener('click', async ()=>{
    const slug=f.slug?.value?.trim(); if(!slug) return msg && (msg.textContent='请输入 slug');
    if(!confirm(`确认删除市场分析：${slug}？`)) return;
    if(msg) msg.textContent='正在删除...';
    try{ const r=await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`,{method:'DELETE'}); unwrapResponse(r,'DELETE_FAILED'); if(msg) msg.textContent='删除成功'; draft.clear(); await refreshIndexView('analyses', idx);}catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e) }
  });

  btn.reuse?.addEventListener('click', async ()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('analyses'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.slug; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('analyses', latest); fill(doc||{}); if(f.slug&&doc?.slug) f.slug.value=`${doc.slug}-${today()}`;
      if(msg) msg.textContent=`已载入 ${latest}，Slug 已追加今日日期。`; wireLivePreview($('#tab-analyses'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e) }
  });

  btn.preview?.addEventListener('click', ()=>{ const slug=f.slug?.value?.trim(); if(!slug) return; window.open(`/#/trade-journal?slug=${encodeURIComponent(slug)}`,'_blank','noopener'); });
  btn.clear?.addEventListener('click', ()=>{ clear(); draft.clear(); if(msg) msg.textContent=''; wireLivePreview($('#tab-analyses')); });
  btn.refresh?.addEventListener('click', ()=> refreshIndexView('analyses', idx));
}

/* ---------------- Market News ---------------- */
function bindNews(){
  const f={ id:$('#n-id'), title:$('#n-title'), source:$('#n-source'), url:$('#n-url'), date:$('#n-date'), tags:$('#n-tags'), summary:$('#n-summary'), bullets:$('#n-bullets') };
  const msg=$('#n-msg'), idx=$('#n-index');
  const btn={ publish:$('#n-publish'), delete:$('#n-delete'), reuse:$('#n-reuse'), preview:$('#n-preview'), clear:$('#n-clear'), refresh:$('#n-refresh') };

  initTextareaUX($('#tab-news')); wireLivePreview($('#tab-news')); bindInlineToolbar($('#tab-news'));
  attachCounter(f.summary); attachCounter(f.bullets);

  wireDraft('news', f, { onChange(){ wireLivePreview($('#tab-news')); }});

  const clear=()=>{ if(f.id)f.id.value=`${today()}-1`; ['title','source','url','tags','summary','bullets'].forEach(k=>f[k]&&(f[k].value='')); if(f.date)f.date.value=new Date().toISOString(); };
  const fill=doc=>{ if(f.id)f.id.value=doc.id||`${today()}-1`; if(f.title)f.title.value=doc.title||''; if(f.source)f.source.value=doc.source||''; if(f.url)f.url.value=doc.url||''; if(f.date)f.date.value=doc.date||new Date().toISOString(); if(f.tags)f.tags.value=Array.isArray(doc.tags)?doc.tags.join(', '):''; if(f.summary)f.summary.value=doc.summary||''; if(f.bullets)f.bullets.value=joinLines(doc.bullets); };

  clear(); refreshIndexView('market-news', idx);

  btn.publish?.addEventListener('click', async ()=>{
    const id=f.id?.value?.trim(); if(!id) return msg && (msg.textContent='请输入 ID');
    if(msg) msg.textContent='正在发布...';
    try{
      const payload={ id, title:f.title?.value?.trim()||undefined, source:f.source?.value?.trim()||undefined, url:f.url?.value?.trim()||undefined, date:f.date?.value?.trim()||new Date().toISOString(), tags:splitLines((f.tags?.value||'').replace(/,/g,'\n')), summary:f.summary?.value?.trim()||undefined, bullets:splitLines(f.bullets?.value||'') };
      const r=await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功'; Draft.clear('news'); await refreshIndexView('market-news', idx);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e) }
  });

  btn.delete?.addEventListener('click', async ()=>{
    const id=f.id?.value?.trim(); if(!id) return msg && (msg.textContent='请输入 ID');
    if(!confirm(`确认删除市场快讯：${id}？`)) return;
    if(msg) msg.textContent='正在删除...';
    try{ const r=await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`,{method:'DELETE'}); unwrapResponse(r,'DELETE_FAILED'); if(msg) msg.textContent='删除成功'; Draft.clear('news'); await refreshIndexView('market-news', idx);}catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e) }
  });

  btn.reuse?.addEventListener('click', async ()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('market-news'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.id; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('market-news', latest); fill(doc||{}); if(f.id) f.id.value=`${today()}-1`;
      if(msg) msg.textContent=`已载入 ${latest}，ID 已更新为今日。`; wireLivePreview($('#tab-news'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e) }
  });

  btn.preview?.addEventListener('click', ()=> window.open('/#/market-news','_blank','noopener'));
  btn.clear?.addEventListener('click', ()=>{ clear(); Draft.clear('news'); if(msg) msg.textContent=''; wireLivePreview($('#tab-news')); });
  btn.refresh?.addEventListener('click', ()=> refreshIndexView('market-news', idx));
}

/* ---------------- Research Syllabus ---------------- */
function bindResearchSyllabus(){
  const textarea=$('#r-json'), host=$('#r-structured'), msg=$('#r-msg');
  const btnLoad=$('#r-load'), btnSave=$('#r-save'), btnClear=$('#r-clear'), btnPreview=$('#r-preview'), btnAddLevel=$('#r-add-level'), btnExpandAll=$('#r-expand-all'), btnCollapseAll=$('#r-collapse-all'), btnSyncJson=$('#r-sync-json');
  if(!textarea && !host) return;

  initTextareaUX($('#tab-syllabus')); attachCounter(textarea); bindInlineToolbar($('#tab-syllabus'));
  let syllabusData=[]; const setMessage=t=>{ if(msg) msg.textContent=t||'' };

  const ensureLesson = (x={})=>({ name:x.name||'', link:x.link||'', type:x.type||'', duration:x.duration||'', desc:x.desc||'' });
  const ensureLevel  = (x={})=>({ level:x.level||'', desc:x.desc||'', icon:x.icon||'', lessons:(Array.isArray(x.lessons)&&x.lessons.length?x.lessons.map(ensureLesson):[ensureLesson()]), _collapsed:!!x._collapsed });
  const sanitize = data=> data.map(l=>({ level:l.level||'', desc:l.desc||'', icon:l.icon||'', lessons:(Array.isArray(l.lessons)?l.lessons:[]).map(ensureLesson) }));
  const syncTextarea=()=>{ if(textarea) textarea.value = safeStringify(sanitize(syllabusData)); };

  const moveLevel=(from,to)=>{ if(to<0||to>=syllabusData.length) return; const [it]=syllabusData.splice(from,1); syllabusData.splice(to,0,it); render(); syncTextarea(); };
  const moveLesson=(lv,from,to)=>{ const level=syllabusData[lv]; if(!level) return; if(to<0||to>=level.lessons.length) return; const [it]=level.lessons.splice(from,1); level.lessons.splice(to,0,it); render(); syncTextarea(); };

  const render=()=>{
    if(!host) return; host.innerHTML='';
    syllabusData.forEach((level, i)=>{
      syllabusData[i]=ensureLevel(level); const cur=syllabusData[i];
      const card=document.createElement('div'); card.className='syllabus-level'; if(cur._collapsed) card.classList.add('collapsed');
      const header=document.createElement('div'); header.className='syllabus-level-header';

      const levelInput=document.createElement('input'); levelInput.placeholder='Level name'; levelInput.value=cur.level; levelInput.addEventListener('input',e=>{cur.level=e.target.value; syncTextarea();}); header.appendChild(levelInput);
      const descInput=document.createElement('input');  descInput.placeholder='Description'; descInput.value=cur.desc; descInput.addEventListener('input',e=>{cur.desc=e.target.value; syncTextarea();}); header.appendChild(descInput);
      const iconInput=document.createElement('input');  iconInput.placeholder='Icon (emoji)'; iconInput.value=cur.icon; iconInput.addEventListener('input',e=>{cur.icon=e.target.value; syncTextarea();}); header.appendChild(iconInput);

      const actions=document.createElement('div'); actions.className='syllabus-level-actions';
      const addBtn=document.createElement('button'); addBtn.textContent='新增课程'; addBtn.onclick=()=>{cur.lessons.push(ensureLesson()); render(); syncTextarea();}; actions.appendChild(addBtn);
      const up=document.createElement('button'); up.textContent='上移'; up.disabled=i===0; up.onclick=()=>moveLevel(i,i-1); actions.appendChild(up);
      const down=document.createElement('button'); down.textContent='下移'; down.disabled=i===syllabusData.length-1; down.onclick=()=>moveLevel(i,i+1); actions.appendChild(down);
      const toggle=document.createElement('button'); toggle.textContent=cur._collapsed?'展开':'收起'; toggle.onclick=()=>{cur._collapsed=!cur._collapsed; render();}; actions.appendChild(toggle);
      const remove=document.createElement('button'); remove.textContent='删除'; remove.onclick=()=>{ if(!confirm(`删除级别 "${cur.level}"?`)) return; syllabusData.splice(i,1); render(); syncTextarea(); }; actions.appendChild(remove);

      header.appendChild(actions); card.appendChild(header);

      const wrap=document.createElement('div'); wrap.className='syllabus-lessons';
      cur.lessons.forEach((lesson, j)=>{
        cur.lessons[j]=ensureLesson(lesson); const row=document.createElement('div'); row.className='lesson-row';
        const n=document.createElement('input'); n.placeholder='课程标题'; n.value=cur.lessons[j].name; n.oninput=e=>{cur.lessons[j].name=e.target.value; syncTextarea();}; row.appendChild(n);
        const l=document.createElement('input'); l.placeholder='课程链接 (#/articles/...)'; l.value=cur.lessons[j].link; l.oninput=e=>{cur.lessons[j].link=e.target.value; syncTextarea();}; row.appendChild(l);
        const t=document.createElement('input'); t.placeholder='标签/类别 (可选)'; t.value=cur.lessons[j].type; t.oninput=e=>{cur.lessons[j].type=e.target.value; syncTextarea();}; row.appendChild(t);
        const d=document.createElement('input'); d.placeholder='时长 (例: 8m)'; d.style.maxWidth='90px'; d.style.flex='0 0 90px'; d.value=cur.lessons[j].duration; d.oninput=e=>{cur.lessons[j].duration=e.target.value; syncTextarea();}; row.appendChild(d);

        const actions2=document.createElement('div'); actions2.className='lesson-actions';
        const up2=document.createElement('button'); up2.textContent='上移'; up2.disabled=j===0; up2.onclick=()=>moveLesson(i,j,j-1); actions2.appendChild(up2);
        const down2=document.createElement('button'); down2.textContent='下移'; down2.disabled=j===cur.lessons.length-1; down2.onclick=()=>moveLesson(i,j,j+1); actions2.appendChild(down2);
        const del=document.createElement('button'); del.textContent='删除'; del.onclick=()=>{ if(cur.lessons.length<=1){ Object.assign(cur.lessons[j], ensureLesson()); } else { cur.lessons.splice(j,1); } render(); syncTextarea(); }; actions2.appendChild(del);
        row.appendChild(actions2); wrap.appendChild(row);

        const desc=document.createElement('textarea'); desc.className='lesson-desc'; desc.placeholder='课程简介 (可选)'; desc.value=cur.lessons[j].desc;
        autosize(desc); cleanPaste(desc); attachCounter(desc); desc.oninput=e=>{cur.lessons[j].desc=e.target.value; syncTextarea();}; wrap.appendChild(desc);
      });

      card.appendChild(wrap); host.appendChild(card);
    });
  };

  const loadOnline=async()=>{
    setMessage('正在加载...');
    try{
      const r=await __apiFetch('/api/research/syllabus.json?_='+Date.now()); const d=unwrapResponse(r,'FETCH_FAILED');
      const raw=Array.isArray(d?.syllabus)?d.syllabus:(Array.isArray(d)?d:[]); syllabusData=raw.map(ensureLevel);
      render(); syncTextarea(); setMessage('已加载线上课程数据。');
    }catch(e){ syllabusData=[]; render(); syncTextarea(); setMessage('加载失败: '+(e.message||e)); }
  };
  const applyJson=()=>{ try{ const p=JSON.parse(textarea.value||'[]'); if(!Array.isArray(p)) throw new Error('JSON 数据必须为数组。'); syllabusData=p.map(ensureLevel); render(); syncTextarea(); setMessage('结构视图已根据 JSON 更新。'); }catch(e){ setMessage('Apply 失败: '+(e.message||e)) } };
  const saveOnline=async()=>{ setMessage('正在保存...'); try{ const payload={syllabus: sanitize(syllabusData)}; const r=await __apiFetch('/api/research/syllabus',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'SAVE_FAILED'); setMessage('保存成功。'); }catch(e){ setMessage('Save 失败: '+(e.message||e)) } };

  btnLoad?.addEventListener('click', ()=>loadOnline());
  btnSave?.addEventListener('click', ()=>saveOnline());
  btnClear?.addEventListener('click', ()=>{ syllabusData=[]; render(); syncTextarea(); setMessage('已清空编辑器。'); });
  btnPreview?.addEventListener('click', ()=> window.open('/#/knowledge-lab','_blank','noopener'));
  btnAddLevel?.addEventListener('click', ()=>{ syllabusData.push(ensureLevel({ level:'新课程阶段', lessons:[ensureLesson({name:'课程标题'})] })); render(); syncTextarea(); });
  btnExpandAll?.addEventListener('click', ()=>{ syllabusData.forEach(l=>l._collapsed=false); render(); });
  btnCollapseAll?.addEventListener('click', ()=>{ syllabusData.forEach(l=>l._collapsed=true); render(); });
  btnSyncJson?.addEventListener('click', applyJson);

  render(); loadOnline().catch(()=>{});
}

/* ---------------- Course Content Editor ---------------- */
function bindCourseContentEditor(){
  const listHost=$('#lesson-list'), listMsg=$('#lesson-list-msg');
  const meta={ level:$('#lesson-level'), name:$('#lesson-name') };
  const f={ slug:$('#lesson-slug'), title:$('#lesson-article-title'), excerpt:$('#lesson-article-excerpt'), tags:$('#lesson-article-tags'), hero:$('#lesson-article-hero'), body:$('#lesson-article-body') };
  const msg=$('#lesson-msg');
  const btn={ save:$('#lesson-save'), del:$('#lesson-delete'), prev:$('#lesson-preview'), open:$('#lesson-open') };
  if(!listHost) return;

  initTextareaUX($('#tab-syllabus')); wireLivePreview($('#tab-syllabus')); bindInlineToolbar($('#tab-syllabus'));

  const state={ current:null };
  const toSlug=t=>String(t||'').toLowerCase().replace(/[#/]/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
  const linkToSlug=link=>{ if(!link) return ''; const m=String(link).match(/#\/?articles\/?([A-Za-z0-9_-]+)/); return m?m[1]:''; };

  const clearEditor=()=>{ meta.level&&(meta.level.textContent='-'); meta.name&&(meta.name.textContent='未选择课程/课时'); ['slug','title','excerpt','tags','hero','body'].forEach(k=>f[k]&&(f[k].value='')); };
  const populate=(lessonMeta, doc)=>{ meta.level&&(meta.level.textContent=lessonMeta.level||'-'); meta.name&&(meta.name.textContent=lessonMeta.name||''); const derived=lessonMeta.slug||linkToSlug(lessonMeta.link)||toSlug(lessonMeta.name||''); f.slug&&(f.slug.value=doc?.slug||derived); f.title&&(f.title.value=doc?.title||lessonMeta.name||''); f.excerpt&&(f.excerpt.value=doc?.excerpt||''); f.tags&&(f.tags.value=Array.isArray(doc?.tags)?doc.tags.join(', '):''); f.hero&&(f.hero.value=doc?.hero||''); f.body&&(f.body.value=doc?.body||''); wireLivePreview($('#tab-articles-from-syllabus')); };

  const renderList=syllabus=>{
    if(!Array.isArray(syllabus)||!syllabus.length){ listHost.innerHTML=''; if(listMsg) listMsg.textContent='未找到已发布的课程大纲'; return; }
    listHost.innerHTML=''; listMsg && listMsg.remove?.();
    syllabus.forEach(group=>{
      const sec=document.createElement('section'); sec.className='lesson-group';
      const h4=document.createElement('h4'); const i=document.createElement('span'); i.textContent=group.icon||'📚'; const l=document.createElement('span'); l.textContent=group.level||''; h4.append(i,l); sec.appendChild(h4);
      const ul=document.createElement('div');
      (group.lessons||[]).forEach(row=>{
        const obj=typeof row==='string'?{name:row}:row||{};
        const a=document.createElement('button'); a.type='button'; a.className='lesson-item'; a.textContent=obj.name||'';
        if(obj.duration){ const sd=document.createElement('span'); sd.textContent=obj.duration; a.appendChild(sd); }
        a.onclick=async ()=>{
          listHost.querySelectorAll('.lesson-item').forEach(x=>x.classList.remove('active')); a.classList.add('active');
          state.current={ level:group.level||'', name:obj.name||'', link:obj.link||'', slug:obj.slug||'' };
          if(msg) msg.textContent='加载中…'; clearEditor();
          try{
            const s=state.current.slug || linkToSlug(state.current.link) || toSlug(state.current.name); let doc=null;
            if(s){ const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(s)}.json?_=${Date.now()}`); if(r.ok) doc=r.data||null; }
            populate({ ...state.current, slug:s }, doc||{}); if(msg) msg.textContent='';
          }catch(e){ populate(state.current,{}); if(msg) msg.textContent='加载失败: '+(e.message||e); }
        };
        ul.appendChild(a);
      });
      sec.appendChild(ul); listHost.appendChild(sec);
    });
  };

  const loadSyllabus=async()=>{
    if(listMsg) listMsg.textContent='正在加载课程大纲…';
    try{ const r=await __apiFetch('/api/research/syllabus.json?_='+Date.now()); const arr=Array.isArray(r?.data?.syllabus)?r.data.syllabus:(Array.isArray(r?.data)?r.data:[]); renderList(arr); if(listMsg) listMsg.textContent=''; }catch(e){ if(listMsg) listMsg.textContent='加载失败: '+(e.message||e) }
  };

  const getSlug=()=>{ const input=(f.slug?.value||'').trim(); if(input) return toSlug(input); return state.current?.slug || linkToSlug(state.current?.link) || toSlug(state.current?.name||''); };
  const refreshIdx=async()=>{ try{ const v=$('#ra-index'); if(v) await refreshIndexView('research/articles', v); }catch{} };

  btn.save?.addEventListener('click', async ()=>{
    const slug=getSlug(); if(!slug) return msg && (msg.textContent='请先选择课时，并填写有效的 slug');
    if(msg) msg.textContent='保存中…';
    try{
      const payload={ slug, title:f.title?.value?.trim() || state.current?.name || slug, excerpt:f.excerpt?.value?.trim()||undefined, hero:f.hero?.value?.trim()||undefined, date:new Date().toISOString(), tags:splitLines((f.tags?.value||'').replace(/,/g,'\n')), body:f.body?.value||'' };
      const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'SAVE_FAILED');
      msg && (msg.textContent='保存成功 ✓'); await refreshIdx();
    }catch(e){ if(msg) msg.textContent='保存失败: '+(e.message||e) }
  });
  btn.del?.addEventListener('click', async ()=>{
    const slug=getSlug(); if(!slug) return msg && (msg.textContent='请提供要删除的 slug');
    if(!confirm(`确定删除课程内容：${slug}？`)) return;
    if(msg) msg.textContent='删除中…';
    try{ const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{method:'DELETE'}); unwrapResponse(r,'DELETE_FAILED'); msg && (msg.textContent='删除成功 ✓'); await refreshIdx(); }catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e) }
  });
  btn.prev?.addEventListener('click', ()=>{ const slug=getSlug(); if(!slug) return; window.open(`/#/articles/${encodeURIComponent(slug)}`,'_blank','noopener'); });
  btn.open?.addEventListener('click', ()=>{ const slug=getSlug(); if(!slug) return; window.open(`/api/research/articles/${encodeURIComponent(slug)}.json`,'_blank','noopener'); });

  clearEditor(); loadSyllabus();
}

/* ---------------- Research Articles ---------------- */
function bindResearchArticles(){
  const f={ slug:$('#ra-slug'), title:$('#ra-title'), excerpt:$('#ra-excerpt'), tags:$('#ra-tags'), hero:$('#ra-hero'), body:$('#ra-body') };
  const msg=$('#ra-msg'), idx=$('#ra-index');
  const btn={ publish:$('#ra-publish'), delete:$('#ra-delete'), reuse:$('#ra-reuse'), preview:$('#ra-preview'), clear:$('#ra-clear'), refresh:$('#ra-refresh') };

  initTextareaUX($('#tab-articles')); wireLivePreview($('#tab-articles')); bindInlineToolbar($('#tab-articles')); attachCounter(f.excerpt); attachCounter(f.body);
  const draft=wireDraft('research-articles', f, { onChange(){ wireLivePreview($('#tab-articles')); }});

  const clear=()=>{ ['slug','title','excerpt','tags','hero','body'].forEach(k=>f[k]&&(f[k].value='')); };
  const fill=doc=>{ if(!doc) return; f.slug&&(f.slug.value=doc.slug||''); f.title&&(f.title.value=doc.title||''); f.excerpt&&(f.excerpt.value=doc.excerpt||''); f.tags&&(f.tags.value=Array.isArray(doc.tags)?doc.tags.join(', '):''); f.hero&&(f.hero.value=doc.hero||''); f.body&&(f.body.value=doc.body||''); };

  refreshIndexView('research/articles', idx);

  btn.publish?.addEventListener('click', async ()=>{
    const slug=f.slug?.value?.trim(); if(!slug) return msg && (msg.textContent='请输入 slug');
    if(msg) msg.textContent='正在发布...';
    try{
      const payload={ slug, title:f.title?.value?.trim()||undefined, excerpt:f.excerpt?.value?.trim()||undefined, tags:splitLines((f.tags?.value||'').replace(/,/g,'\n')), hero:f.hero?.value?.trim()||undefined, date:new Date().toISOString(), body:f.body?.value||'' };
      const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); unwrapResponse(r,'PUBLISH_FAILED');
      if(msg) msg.textContent='发布成功'; draft.clear(); await refreshIndexView('research/articles', idx);
    }catch(e){ if(msg) msg.textContent='发布失败: '+(e.message||e) }
  });

  btn.delete?.addEventListener('click', async ()=>{
    const slug=f.slug?.value?.trim(); if(!slug) return msg && (msg.textContent='请输入 slug');
    if(!confirm(`确认删除研究文章：${slug}？`)) return;
    if(msg) msg.textContent='正在删除...';
    try{ const r=await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{method:'DELETE'}); unwrapResponse(r,'DELETE_FAILED'); if(msg) msg.textContent='删除成功'; draft.clear(); await refreshIndexView('research/articles', idx);}catch(e){ if(msg) msg.textContent='删除失败: '+(e.message||e) }
  });

  btn.reuse?.addEventListener('click', async ()=>{
    if(msg) msg.textContent='正在载入线上数据...';
    try{
      const list=await fetchIndex('research/articles'); if(!Array.isArray(list)||!list.length) throw new Error('暂无历史数据');
      const latest=typeof list[0]==='string'?list[0]:list[0]?.slug; if(!latest) throw new Error('索引数据无效');
      const doc=await fetchDocument('research/articles', latest); fill(doc||{}); if(f.slug&&doc?.slug) f.slug.value=`${doc.slug}-${today()}`;
      if(msg) msg.textContent=`已载入 ${latest}，Slug 已追加今日日期。`; wireLivePreview($('#tab-articles'));
    }catch(e){ if(msg) msg.textContent='载入线上数据失败: '+(e.message||e) }
  });

  btn.preview?.addEventListener('click', ()=>{ const slug=f.slug?.value?.trim(); if(!slug) return; window.open(`/#/articles/${encodeURIComponent(slug)}`,'_blank','noopener'); });
  btn.clear?.addEventListener('click', ()=>{ clear(); draft.clear(); if(msg) msg.textContent=''; wireLivePreview($('#tab-articles')); });
  btn.refresh?.addEventListener('click', ()=> refreshIndexView('research/articles', idx));
}

/* ---------------- Immersive ---------------- */
function bindImmersiveToggle(){
  const ensure=()=>{
    if(!document.body.classList.contains('immersive')) return;
    const active=document.querySelector('.tab-panel.active'); if(!active) return;
    document.querySelectorAll('.focus-card').forEach(el=>el.classList.remove('focus-card'));
    active.classList.add('focus-card');
  };
  ensure();
  document.addEventListener('click', e=>{ if(e.target.closest('.tab-btn')) setTimeout(ensure,0); });
  const mo=new MutationObserver(()=>ensure()); mo.observe(document.body,{attributes:true,attributeFilter:['class']});
}

/* ---------------- Boot ---------------- */
let __BOOTED=false;
function boot(){
  if(__BOOTED) return; __BOOTED=true;
  try{
    setupTabs();
    bindDiagnostics();
    bindDailyBrief();
    bindAnalyses();
    bindNews();
    bindResearchSyllabus();
    bindCourseContentEditor();
    bindResearchArticles();
    bindImmersiveToggle();
    console.log('[admin] booted');
  }catch(e){
    console.error('[admin] boot error:', e);
    toast('Admin 初始化失败：'+(e.message||e));
  }
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

/* Optional helper for external login form */
window.Admin = { ...(window.Admin||{}), setToken:(t)=>{ __setToken(t); toast('Token 已更新'); } };
