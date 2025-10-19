// public/js/admin-main.js
// Wire up core admin actions using the bootstrap utilities

const Admin = window.Admin || {};
const $ = Admin.$ || ((s, el=document)=> el.querySelector(s));


// Fallbacks if bootstrap not ready
let __ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function __setToken(tok){ __ADMIN_TOKEN = tok || ''; if(tok){ sessionStorage.setItem('tran_admin_token', tok); } else { sessionStorage.removeItem('tran_admin_token'); } }
async function __apiFetch(url, init = {}){
  if (window.Admin && typeof window.Admin.apiFetch === 'function') return window.Admin.apiFetch(url, init);
  const timeoutMs = 12000; const ctrl = new AbortController(); const id = setTimeout(()=> ctrl.abort(new DOMException('timeout','AbortError')), timeoutMs);
  const headers = new Headers(init.headers || {}); if (__ADMIN_TOKEN) headers.set('Authorization', 'Bearer ' + __ADMIN_TOKEN);
  try{ const res = await fetch(url, { credentials: 'include', cache: 'no-store', ...init, headers, signal: ctrl.signal }); const text = await res.text(); let data=null; try{ data=JSON.parse(text);}catch{}; return { res, ok: res.ok, status: res.status, data, text }; } finally { clearTimeout(id); }
}
function today(){ return new Date().toISOString().slice(0,10); }

async function waitForGone(apiPath, tries=8, interval=600){
  for (let i=0;i<tries;i++){
    const r = await __apiFetch(apiPath + (apiPath.includes('?')?'&':'?') + '_=' + Date.now(), { method:'GET' });
    if (!r.ok) return true; // not found -> gone
    await new Promise(res=>setTimeout(res, interval));
  }
  throw new Error('DELETE_VERIFY_FAILED');
}

function bindDailyBrief(){
  const btnPub = $('#b-publish'); const btnDel = $('#b-delete');
  const msgEl = $('#b-msg');
  const get = ()=>{
    const slug = ($('#b-slug')?.value||'').trim() || today();
    const title= ($('#b-title')?.value||'').trim();
    const bullets= ($('#b-bullets')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const schedule= ($('#b-schedule')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const symbol= ($('#b-symbol')?.value||'').trim();
    const interval = ($('#b-interval')?.value||'60').trim();
    const payload = { slug, title: title||undefined, bullets, schedule, chart:{ symbol: symbol||undefined, interval } };
    return { slug, payload };
  };
  if (btnPub) btnPub.addEventListener('click', async ()=>{
    const { slug, payload } = get();
    msgEl && (msgEl.textContent = 'Publishing...');
    try{
      const r = await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method:'PUT', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) });
      if(!r.ok) throw new Error((r.data && (r.data.error||r.data.message)) || `HTTP ${r.status}`);
      msgEl && (msgEl.textContent = 'Published');
    }catch(e){ msgEl && (msgEl.textContent = 'Publish failed: ' + (e?.message||e)); }
  });
  if (btnDel) btnDel.addEventListener('click', async ()=>{
    const { slug } = get();
    if (!confirm(`Delete Daily Brief: ${slug}?`)) return;
    msgEl && (msgEl.textContent = 'Deleting...');
    try{
      const del = await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
      if(!del.ok) throw new Error((del.data && (del.data.error||del.data.message)) || `HTTP ${del.status}`);
      await waitForGone(`/api/daily-brief/${encodeURIComponent(slug)}.json`);
      msgEl && (msgEl.textContent = 'Deleted');
    }catch(e){ msgEl && (msgEl.textContent = 'Delete failed: ' + (e?.message||e)); }
  });
}

function bindAnalyses(){
  const btnPub = $('#a-publish'); const btnDel = $('#a-delete'); const msgEl = $('#a-msg');
  const get = ()=>{
    const slug= ($('#a-slug')?.value||'').trim();
    const title= ($('#a-title')?.value||'').trim();
    const symbol= ($('#a-symbol')?.value||'').trim();
    const tf= ($('#a-tf')?.value||'').trim();
    const date= ($('#a-date')?.value||'').trim() || today();
    const bias= ($('#a-bias')?.value||'').trim();
    const tags= ($('#a-tags')?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
    const supports= ($('#a-supports')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const resistances= ($('#a-resistances')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const context= ($('#a-context')?.value||'').trim();
    const view= ($('#a-view')?.value||'').trim();
    const invalidation= ($('#a-invalidation')?.value||'').trim();
    const chartSymbol= ($('#a-chart-symbol')?.value||'').trim() || symbol;
    const chartInterval= ($('#a-chart-interval')?.value||'60').trim();
    const payload={ slug, title, symbol, tf, date, bias, tags, supports, resistances, context, view, invalidation, chart:{ symbol: chartSymbol, interval: chartInterval } };
    return { slug, payload };
  };
  if (btnPub) btnPub.addEventListener('click', async ()=>{
    const { slug, payload } = get(); if(!slug) return msgEl && (msgEl.textContent='Please fill slug');
    msgEl && (msgEl.textContent = 'Publishing...');
    try{
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method:'PUT', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) });
      if(!r.ok) throw new Error((r.data && (r.data.error||r.data.message)) || `HTTP ${r.status}`);
      msgEl && (msgEl.textContent = 'Published');
    }catch(e){ msgEl && (msgEl.textContent = 'Publish failed: ' + (e?.message||e)); }
  });
  if (btnDel) btnDel.addEventListener('click', async ()=>{
    const { slug } = get(); if(!slug) return msgEl && (msgEl.textContent='Please fill slug');
    if (!confirm(`Delete analysis: ${slug}?`)) return;
    msgEl && (msgEl.textContent = 'Deleting...');
    try{
      const del = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
      if(!del.ok) throw new Error((del.data && (del.data.error||del.data.message)) || `HTTP ${del.status}`);
      await waitForGone(`/api/analyses/${encodeURIComponent(slug)}.json`);
      msgEl && (msgEl.textContent = 'Deleted');
    }catch(e){ msgEl && (msgEl.textContent = 'Delete failed: ' + (e?.message||e)); }
  });
}

function bindNews(){
  const btnPub = $('#n-publish'); const btnDel = $('#n-delete'); const msgEl = $('#n-msg');
  const get = ()=>{
    const id= ($('#n-id')?.value||'').trim();
    const title= ($('#n-title')?.value||'').trim();
    const source= ($('#n-source')?.value||'').trim();
    const url= ($('#n-url')?.value||'').trim();
    const date= ($('#n-date')?.value||'').trim() || new Date().toISOString();
    const tags= ($('#n-tags')?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
    const summary= ($('#n-summary')?.value||'').trim();
    const bullets= ($('#n-bullets')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const payload={ id, title, source, url, date, tags, summary, bullets };
    return { id, payload };
  };
  if (btnPub) btnPub.addEventListener('click', async ()=>{
    const { id, payload } = get(); if(!id) return msgEl && (msgEl.textContent='Please fill id');
    msgEl && (msgEl.textContent = 'Publishing...');
    try{
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method:'PUT', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) });
      if(!r.ok) throw new Error((r.data && (r.data.error||r.data.message)) || `HTTP ${r.status}`);
      msgEl && (msgEl.textContent = 'Published');
    }catch(e){ msgEl && (msgEl.textContent = 'Publish failed: ' + (e?.message||e)); }
  });
  if (btnDel) btnDel.addEventListener('click', async ()=>{
    const { id } = get(); if(!id) return msgEl && (msgEl.textContent='Please fill id');
    if (!confirm(`Delete news: ${id}?`)) return;
    msgEl && (msgEl.textContent = 'Deleting...');
    try{
      const del = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method:'DELETE' });
      if(!del.ok) throw new Error((del.data && (del.data.error||del.data.message)) || `HTTP ${del.status}`);
      await waitForGone(`/api/market-news/${encodeURIComponent(id)}.json`);
      msgEl && (msgEl.textContent = 'Deleted');
    }catch(e){ msgEl && (msgEl.textContent = 'Delete failed: ' + (e?.message||e)); }
  });
}

function bindResearchArticles(){
  const btnPub = $('#ra-publish'); const btnDel = $('#ra-delete'); const msgEl = $('#ra-msg');
  const get = ()=>{
    const slug= ($('#ra-slug')?.value||'').trim();
    const title= ($('#ra-title')?.value||'').trim();
    const excerpt= ($('#ra-excerpt')?.value||'').trim();
    const tags= ($('#ra-tags')?.value||'').split(',').map(s=>s.trim()).filter(Boolean);
    const hero= ($('#ra-hero')?.value||'').trim();
    const body= ($('#ra-body')?.value||'');
    const payload={ slug, title, excerpt, tags, hero, date:new Date().toISOString(), body };
    return { slug, payload };
  };
  if (btnPub) btnPub.addEventListener('click', async ()=>{
    const { slug, payload } = get(); if(!slug) return msgEl && (msgEl.textContent='Please fill slug');
    msgEl && (msgEl.textContent = 'Publishing...');
    try{
      const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, { method:'PUT', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) });
      if(!r.ok) throw new Error((r.data && (r.data.error||r.data.message)) || `HTTP ${r.status}`);
      msgEl && (msgEl.textContent = 'Published');
    }catch(e){ msgEl && (msgEl.textContent = 'Publish failed: ' + (e?.message||e)); }
  });
  if (btnDel) btnDel.addEventListener('click', async ()=>{
    const { slug } = get(); if(!slug) return msgEl && (msgEl.textContent='Please fill slug');
    if (!confirm(`Delete article: ${slug}?`)) return;
    msgEl && (msgEl.textContent = 'Deleting...');
    try{
      const del = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
      if(!del.ok) throw new Error((del.data && (del.data.error||del.data.message)) || `HTTP ${del.status}`);
      await waitForGone(`/api/research/articles/${encodeURIComponent(slug)}.json`);
      msgEl && (msgEl.textContent = 'Deleted');
    }catch(e){ msgEl && (msgEl.textContent = 'Delete failed: ' + (e?.message||e)); }
  });
}

// Bind when DOM is ready
(function(){
  try{ bindDailyBrief(); }catch{}
  try{ bindAnalyses(); }catch{}
  try{ bindNews(); }catch{}
  try{ bindResearchArticles(); }catch{}
})();

