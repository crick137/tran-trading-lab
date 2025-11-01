// ===== /public/js/admin-main.js =====
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
const toSlug = (s='') => String(s)
  .toLowerCase()
  .trim()
  .replace(/[^\p{Letter}\p{Number}]+/gu,'-')
  .replace(/^-+|-+$/g,'');

async function fetchIndex(prefix){
  const r = await __apiFetch(`/api/${prefix}/index.json?_=${Date.now()}`);
  return unwrapResponse(r,'FETCH_INDEX_FAILED');
}
async function fetchDocument(prefix, slug){
  const r = await __apiFetch(`/api/${prefix}/${encodeURIComponent(slug)}.json?_=${Date.now()}`);
  return unwrapResponse(r,'FETCH_DOCUMENT_FAILED');
}
async function refreshIndexView(prefix, target){
  if (!target) return;
  target.textContent = '正在加载...';
  try{
    const list = await fetchIndex(prefix);
    target.textContent = JSON.stringify(list,null,2);
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
      unwrapResponse(r,'DELETE_FAILED'); if(msg) msg.textContent='删除成功 ✓'; Draft.clear('brief'); await refreshIndexView('daily-brief',indexView);
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
      if(msg) msg.textContent='删除成功 ✓'; draft.clear(); await refreshIndexView('research/articles', idx);
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

/* ---------------- Market News (快讯) ---------------- */
function bindMarketNews(){
  const f = {
    id:      $('#n-id'),
    title:   $('#n-title'),
    source:  $('#n-source'),
    url:     $('#n-url'),
    date:    $('#n-date'),
    tags:    $('#n-tags'),
    summary: $('#n-summary'),
    bullets: $('#n-bullets')
  };
  const msg = $('#n-msg'), idx = $('#n-index');
  const btn = {
    publish: $('#n-publish'),
    delete:  $('#n-delete'),
    reuse:   $('#n-reuse'),
    preview: $('#n-preview'),
    clear:   $('#n-clear'),
    refresh: $('#n-refresh')
  };

  const panel = $('#tab-news');
  if (!panel) return;
  initTextareaUX(panel); wireLivePreview(panel);
  attachCounter(f.summary); attachCounter(f.bullets);

  // 草稿
  wireDraft('market-news', f, { onChange(){ wireLivePreview(panel); } });

  const ensureId = ()=>{
    if (!f.id) return;
    if (!f.id.value) {
      const t = new Date();
      const z = s=>String(s).padStart(2,'0');
      const id = `${t.getFullYear()}-${z(t.getMonth()+1)}-${z(t.getDate())}-${z(t.getHours())}${z(t.getMinutes())}${z(t.getSeconds())}`;
      f.id.value = id;
    }
  };

  const clear=()=>{ ['id','title','source','url','date','tags','summary','bullets'].forEach(k=>f[k]&&(f[k].value='')); };

  async function fetchLatestId(){
    const list = await fetchIndex('market-news');
    if (Array.isArray(list) && list.length) {
      return typeof list[0]==='string'? list[0] : (list[0]?.id || list[0]?.slug || '');
    }
    return '';
  }
  async function fetchById(id){
    const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json?_=${Date.now()}`);
    return unwrapResponse(r,'FETCH_NEWS_FAILED');
  }
  function fill(d){
    if(!d) return;
    if(f.id)      f.id.value      = d.id || d.slug || '';
    if(f.title)   f.title.value   = d.title || '';
    if(f.source)  f.source.value  = d.source || '';
    if(f.url)     f.url.value     = d.url || d.link || '';
    if(f.date)    f.date.value    = d.date || d.publishedAt || '';
    if(f.tags)    f.tags.value    = Array.isArray(d.tags)? d.tags.join(', '): (d.tags || '');
    if(f.summary) f.summary.value = d.summary || d.excerpt || '';
    if(f.bullets) f.bullets.value = joinLines(d.bullets);
  }

  refreshIndexView('market-news', idx);

  btn.publish?.addEventListener('click', async ()=>{
    ensureId(); if (msg) msg.textContent='正在发布...';
    try{
      const payload = {
        id:   (f.id?.value||'').trim(),
        title:   f.title?.value?.trim() || undefined,
        source:  f.source?.value?.trim() || undefined,
        url:     f.url?.value?.trim() || undefined,
        date:    f.date?.value?.trim() || new Date().toISOString(),
        tags:    splitLines((f.tags?.value||'').replace(/,/g,'\n')),
        summary: f.summary?.value || '',
        bullets: splitLines(f.bullets?.value || '')
      };
      if (!payload.id) throw new Error('缺少编号 (id)');
      // 走 index 写入（会顺带维护索引）
      const r = await __apiFetch('/api/market-news/index.json', {
        method:'POST', body: JSON.stringify(payload)
      });
      unwrapResponse(r,'PUBLISH_FAILED');
      if (msg) msg.textContent='发布成功 ✓';
      await refreshIndexView('market-news', idx);
    }catch(e){ if (msg) msg.textContent='发布失败: '+(e.message||e); }
  });

  btn.delete?.addEventListener('click', async ()=>{
    const id = f.id?.value?.trim(); if (!id) return msg && (msg.textContent='请输入编号');
    if (!confirm(`确认删除快讯：${id}？`)) return;
    if (msg) msg.textContent='正在删除...';
    try{
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method:'DELETE' });
      unwrapResponse(r,'DELETE_FAILED');
      if (msg) msg.textContent='删除成功 ✓';
      await refreshIndexView('market-news', idx);
    }catch(e){ if (msg) msg.textContent='删除失败: '+(e.message||e); }
  });

  btn.reuse?.addEventListener('click', async ()=>{
    if (msg) msg.textContent='正在载入线上数据...';
    try{
      const latest = await fetchLatestId();
      if (!latest) throw new Error('暂无历史数据');
      const doc = await fetchById(latest);
      fill(doc||{});
      if (msg) msg.textContent=`已载入 ${latest}`;
      wireLivePreview(panel);
    }catch(e){ if (msg) msg.textContent='载入线上数据失败: '+(e.message||e); }
  });

  btn.preview?.addEventListener('click', ()=>{
    const id = f.id?.value?.trim(); if (!id) return;
    window.open(`/#/market-news/${encodeURIComponent(id)}`,'_blank','noopener');
  });
  btn.clear?.addEventListener('click', ()=>{ clear(); if(msg) msg.textContent=''; wireLivePreview(panel); });
  btn.refresh?.addEventListener('click', ()=> refreshIndexView('market-news', idx));

  // 小辅助：如果没填 id，输入标题时给出建议 id
  f.title?.addEventListener('input', ()=>{
    if (f.id && !f.id.value) {
      const hint = `${toSlug(f.title.value||'news')}-${Date.now().toString().slice(-6)}`;
      f.id.placeholder = hint;
    }
  });
}

/* ---------------- Syllabus (Knowledge) ---------------- */
function bindSyllabusEditor(){
  const wrap = $('#tab-syllabus');
  if (!wrap) return;

  // 左侧列表 & 右侧字段
  const listWrap   = $('#lesson-list');
  const listMsg    = $('#lesson-list-msg');
  const levelEl    = $('#lesson-level');
  const nameEl     = $('#lesson-name');

  const f = {
    slug:    $('#lesson-slug'),
    title:   $('#lesson-article-title'),
    excerpt: $('#lesson-article-excerpt'),
    tags:    $('#lesson-article-tags'),
    hero:    $('#lesson-article-hero'),
    body:    $('#lesson-article-body'),
  };

  const btn = {
    save:    $('#lesson-save'),
    del:     $('#lesson-delete'),
    preview: $('#lesson-preview'),
    open:    $('#lesson-open'),
  };

  initTextareaUX(wrap);

  const esc = s => String(s ?? '');

  function normalizeSyllabus(raw){
    let groups = [];
    if (Array.isArray(raw)) groups = raw;
    else if (raw && Array.isArray(raw.groups)) groups = raw.groups;
    else if (raw && typeof raw === 'object'){
      groups = Object.entries(raw).map(([k,v])=>{
        const lessons = Array.isArray(v) ? v : (Array.isArray(v?.lessons) ? v.lessons : []);
        return { level: k, lessons };
      });
    }
    return groups.map(g=>{
      const level = g.level || g.title || g.name || '-';
      const lessons = (Array.isArray(g.lessons)? g.lessons: []).map(it=>{
        const name  = it.name || it.title || it.lesson || it.slug || 'Lesson';
        const slug  = it.slug || toSlug(name);
        const phase = it.level || it.phase || level;
        return { name, slug, level: phase };
      });
      return { level, lessons };
    });
  }

  async function fetchSyllabus(){
    const urls = [
      '/api/research/syllabus.json',
      '/api/research/syllabus',
      '/server/research/syllabus/index',
      '/research/syllabus.json',
    ];
    for (const u of urls){
      try{
        const r = await fetch(u, { cache:'no-store' });
        if (!r.ok) continue;
        return await r.json();
      }catch{}
    }
    throw new Error('SYLLABUS_NOT_FOUND');
  }

  function renderList(groups){
    if (!listWrap) return;
    const html = groups.map(g=>{
      const items = (g.lessons||[]).map(ls=>(
        `<button class="lesson-item" data-slug="${ls.slug}" data-name="${esc(ls.name)}" data-level="${esc(ls.level||g.level)}">
           ${esc(ls.name)}<span>${esc(ls.slug)}</span>
         </button>`
      )).join('');
      return `<div class="lesson-group">
        <h4>${esc(g.level || '-')}</h4>
        ${items || `<p class="muted" style="margin:6px 0 14px">此组暂无课时</p>`}
      </div>`;
    }).join('') || `<p class="muted">大纲为空</p>`;
    listWrap.innerHTML = html;

    $$('.lesson-item', listWrap).forEach(el=>{
      el.addEventListener('click', ()=>{
        $$('.lesson-item', listWrap).forEach(b=>b.classList.toggle('active', b===el));
        const slug  = el.getAttribute('data-slug')  || '';
        const name  = el.getAttribute('data-name')  || '';
        const level = el.getAttribute('data-level') || '-';

        levelEl && (levelEl.textContent = level);
        nameEl  && (nameEl.textContent  = name);

        if (f.slug   && !f.slug.value)   f.slug.value  = slug;
        if (f.title  && !f.title.value)  f.title.value = name;
        if (f.excerpt && !f.excerpt.value) f.excerpt.value = '';
        toast(`已选课时：${name}`);
      });
    });
  }

  async function loadSyllabus(){
    if (listMsg) listMsg.textContent = '正在加载课程大纲…';
    try{
      const raw = await fetchSyllabus();
      const groups = normalizeSyllabus(raw);
      if (listMsg) listMsg.style.display = 'none';
      renderList(groups);
    }catch(e){
      if (listMsg){
        listMsg.style.display = '';
        listMsg.textContent = '加载失败：' + (e.message||e);
      }
    }
  }

  // 与“研究文章”复用接口
  async function putArticle(payload){
    const slug = payload.slug;
    const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{
      method:'PUT',
      headers:{'content-type':'application/json'},
      body: JSON.stringify(payload)
    });
    return unwrapResponse(r,'SAVE_FAILED');
  }
  async function delArticle(slug){
    const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`,{
      method:'DELETE'
    });
    return unwrapResponse(r,'DELETE_FAILED');
  }

  btn.save?.addEventListener('click', async ()=>{
    const slug = (f.slug?.value||'').trim().replace(/[\\/]+/g,'-');
    if (!slug) return toast('请填写 Slug');
    try{
      const payload = {
        slug,
        title:   f.title?.value?.trim()   || undefined,
        excerpt: f.excerpt?.value?.trim() || undefined,
        tags:    splitLines((f.tags?.value || '').replace(/,/g,'\n')),
        hero:    f.hero?.value?.trim()    || undefined,
        date:    new Date().toISOString(),
        body:    f.body?.value || ''
      };
      await putArticle(payload);
      toast('已保存');
    }catch(e){ toast('保存失败：' + (e.message||e)); }
  });

  btn.del?.addEventListener('click', async ()=>{
    const slug = (f.slug?.value||'').trim().replace(/[\\/]+/g,'-');
    if (!slug) return toast('请填写 Slug');
    if (!confirm(`确认删除文章：${slug}？`)) return;
    try{ await delArticle(slug); toast('已删除'); }catch(e){ toast('删除失败：' + (e.message||e)); }
  });

  btn.preview?.addEventListener('click', ()=>{
    const slug = (f.slug?.value||'').trim().replace(/[\\/]+/g,'-');
    if (!slug) return toast('请填写 Slug');
    window.open(`/#/articles/${encodeURIComponent(slug)}`,'_blank','noopener');
  });

  btn.open?.addEventListener('click', ()=>{
    const slug = (f.slug?.value||'').trim().replace(/[\\/]+/g,'-');
    if (!slug) return toast('请填写 Slug');
    window.open(`/api/research/articles/${encodeURIComponent(slug)}.json`,'_blank','noopener');
  });

  loadSyllabus();
}

/* ---------------- Boot ---------------- */
let __BOOTED=false;
function boot(){
  if(__BOOTED) return; __BOOTED=true;
  try{
    setupTabs();
    bindDiagnostics();
    bindDailyBrief();
    bindMarketNews();       // ✅ 新增：市场快讯
    bindResearchArticles();
    bindSyllabusEditor();   // ✅ 新增：课程内容
    console.log('[admin] booted');
  }catch(e){
    console.error('[admin] boot error:', e);
    toast('Admin 初始化失败：'+(e.message||e));
  }
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

window.Admin = { ...(window.Admin||{}), setToken:(t)=>{ __setToken(t); toast('Token 已更新'); } };
