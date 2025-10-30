// public/js/admin-main.js
// Enhanced admin interactions: tabs, diagnostics, CRUD helpers (UX-only, no API changes)

const Admin = window.Admin || {};
const $ = Admin.$ || ((selector, root = document) => (root || document).querySelector(selector));
const $$ = Admin.$$ || ((selector, root = document) => Array.from((root || document).querySelectorAll(selector)));

let __ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function __setToken(value) {
  __ADMIN_TOKEN = value || '';
  if (value) {
    sessionStorage.setItem('tran_admin_token', value);
  } else {
    sessionStorage.removeItem('tran_admin_token');
  }
}

/* ---------------- Fetch ---------------- */
async function __apiFetch(url, init = {}) {
  if (window.Admin && typeof window.Admin.apiFetch === 'function') {
    return window.Admin.apiFetch(url, init);
  }
  const opts = { credentials: 'include', cache: 'no-store', ...init };
  if (!opts.method) opts.method = 'GET';
  const headers = new Headers(opts.headers || {});
  if (__ADMIN_TOKEN) headers.set('Authorization', 'Bearer ' + __ADMIN_TOKEN);
  if (!headers.has('content-type') && typeof opts.body === 'string') {
    headers.set('content-type', 'application/json;charset=utf-8');
  }
  opts.headers = headers;
  const ctrl = new AbortController();
  const timer = setTimeout(() => { try { ctrl.abort(); } catch(_){} }, 12000);
  opts.signal = ctrl.signal;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) {}
    return { res, ok: res.ok, status: res.status, data, text };
  } finally {
    clearTimeout(timer);
  }
}
function unwrapResponse(response, context) {
  if (!response.ok) {
    const message = (response.data && (response.data.error || response.data.message)) || response.text || context || ('HTTP ' + response.status);
    throw new Error(message);
  }
  return response.data;
}

/* ---------------- Utils ---------------- */
const today = () => new Date().toISOString().slice(0, 10);
const splitLines = (value) => (value || '').split('\n').map((line) => line.trim()).filter((line) => line.length);
const joinLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');
const safeStringify = (value) => { try { return JSON.stringify(value, null, 2); } catch { return ''; } };

async function fetchIndex(prefix) {
  const r = await __apiFetch(`/api/${prefix}/index.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_INDEX_FAILED');
}
async function fetchDocument(prefix, slug) {
  const r = await __apiFetch(`/api/${prefix}/${encodeURIComponent(slug)}.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_DOCUMENT_FAILED');
}
async function refreshIndexView(prefix, target) {
  if (!target) return;
  target.textContent = '正在加载...';
  try {
    const list = await fetchIndex(prefix);
    target.textContent = JSON.stringify(list, null, 2);
  } catch (e) {
    target.textContent = '失败: ' + (e.message || e);
  }
}

/* ======= Draft / Snap / Toast / Shortcuts ======= */
const Draft = {
  key: (tab) => `ttl:admin:draft:${tab}`,
  load(tab) { try { return JSON.parse(localStorage.getItem(Draft.key(tab)) || 'null') } catch { return null } },
  save(tab, data) { try { localStorage.setItem(Draft.key(tab), JSON.stringify(data)) } catch {} },
  clear(tab) { localStorage.removeItem(Draft.key(tab)) }
};
const Snap = {
  key: (tab, ts) => `ttl:admin:snap:${tab}:${ts}`,
  save(tab, data) {
    const ts = new Date().toISOString().split(':').join('').slice(0,15); // 避免 replaceAll 兼容问题
    try { localStorage.setItem(Snap.key(tab, ts), JSON.stringify(data)) } catch {}
    toast(`已创建发布快照 ${ts}`);
  }
};
let __DIRTY = false;
window.addEventListener('beforeunload', (e)=>{
  if (__DIRTY) { e.preventDefault(); e.returnValue = ''; }
});
function toast(msg, kind='info'){
  let el = document.querySelector('.toast');
  if(!el){ el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el.__t);
  el.__t = setTimeout(()=> el.classList.remove('show'), 2200);
}
function setDirty(on){
  __DIRTY = !!on;
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn) activeBtn.classList.toggle('badge', __DIRTY);
}
function collectFields(obj){
  const out = {};
  for (const [k, el] of Object.entries(obj || {})) {
    if (!el) continue;
    out[k] = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.tagName === 'SELECT') ? el.value : null;
  }
  return out;
}
function applyFields(obj, data){
  if (!data) return;
  for (const [k, v] of Object.entries(data)) {
    if (obj[k] && typeof v === 'string') obj[k].value = v;
  }
}

/* ---- Textarea UX ---- */
function autosize(el){
  if(!el) return;
  if (el.dataset.autosizeBound === '1') return;
  el.dataset.autosizeBound = '1';
  const fit = () => { el.style.height = 'auto'; el.style.height = (el.scrollHeight + 2) + 'px'; };
  el.addEventListener('input', fit, { passive: true });
  fit();
}
function cleanPaste(el){
  if(!el) return;
  if (el.dataset.cleanPasteBound === '1') return;
  el.dataset.cleanPasteBound = '1';
  el.addEventListener('paste', (e)=>{
    if (!e.clipboardData) return;
    const text = e.clipboardData.getData('text/plain');
    if (text) {
      e.preventDefault();
      const start = el.selectionStart, end = el.selectionEnd;
      const v = el.value;
      el.value = v.slice(0, start) + text + v.slice(end);
      el.selectionStart = el.selectionEnd = start + text.length;
      el.dispatchEvent(new Event('input', { bubbles:true }));
    }
  });
}

/* === attachCounter: 只绑定一次 + rAF === */
function attachCounter(el, where){
  if(!el) return;
  if (el.dataset.counterBound === '1') return;
  el.dataset.counterBound = '1';

  let slot = where;
  if (!slot) {
    slot = document.createElement('div');
    slot.className = 'counter';
    el.insertAdjacentElement('afterend', slot);
  }

  let rafId = 0;
  const update = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const txt = el.value || '';
      const lines = txt.split(/\r?\n/).filter(Boolean).length;
      const chars = txt.length;
      slot.textContent = `${lines} 行 · ${chars} 字`;
    });
  };
  el.addEventListener('input', update, { passive: true });
  update();
}

/* 预览渲染 */
function renderPreviewText(raw){
  const val = (raw || '').trim();
  if (!val) return '';
  if (typeof window.md === 'function') {
    try { return window.md(val); } catch {}
  }
  const lines = val.split(/\r?\n/).filter(Boolean).map(s=>s.trim());
  return `<ul>${lines.map(s=>`<li>${s}</li>`).join('')}</ul>`;
}

/* === wireLivePreview: 只绑定一次 + rAF === */
function wireLivePreview(panelEl){
  if (!panelEl) return;
  if (panelEl.dataset.livePreviewBound === '1') return;
  const panes = $$('.preview-pane', panelEl);
  if (!panes.length) return;
  const src = $('textarea[data-preview], textarea', panelEl);
  if (!src) return;

  let rafId = 0;
  const render = () => {
    const html = renderPreviewText(src.value);
    panes.forEach(p => p.innerHTML = html);
  };
  const onInput = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(render);
  };

  src.addEventListener('input', onInput, { passive: true });
  panelEl.dataset.livePreviewBound = '1';
  render();
}

/* === initTextareaUX: 每个 textarea 仅初始化一次 === */
function initTextareaUX(scope=document){
  scope = scope || document;
  $$('textarea', scope).forEach((ta)=>{
    if (ta.dataset.uxBound === '1') return;
    ta.dataset.uxBound = '1';
    autosize(ta);
    cleanPaste(ta);
    if (!ta.classList.contains('no-counter')) attachCounter(ta);
  });
}

/* ---- 草稿接线 ---- */
function wireDraft(tab, fields, { onChange } = {}){
  const cached = Draft.load(tab);
  if (cached) applyFields(fields, cached);
  const save = () => { Draft.save(tab, collectFields(fields)); setDirty(true); onChange && onChange(); };
  let t=null;
  for (const el of Object.values(fields)){
    if (!el || !el.addEventListener) continue;
    el.addEventListener('input', ()=>{ clearTimeout(t); t=setTimeout(save, 250); });
    el.addEventListener('change', ()=>{ clearTimeout(t); t=setTimeout(save, 0); });
  }
  return { clear(){ Draft.clear(tab); setDirty(false); }, snapshot(data){ Snap.save(tab, data); } };
}

/* ---- 快捷键 ---- */
document.addEventListener('keydown', (e)=>{
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const mod = isMac ? e.metaKey : e.ctrlKey;
  if (mod && e.key.toLowerCase() === 's'){ e.preventDefault(); document.querySelector('.tab-panel.active .primary')?.click(); }
  if (mod && e.key.toLowerCase() === 'k'){ e.preventDefault(); document.querySelector('.tab-panel.active [id$="-preview"]')?.click(); }
  if (mod && e.key.toLowerCase() === 'l'){ e.preventDefault(); document.querySelector('.tab-panel.active [id$="-reuse"]')?.click(); }
  if (e.key === 'Escape'){ document.getElementById('modal-close')?.click(); }
});

/* ---------------- Tabs（记住上次激活） ---------------- */
const ACTIVE_TAB_KEY = 'ttl:admin:activeTab';
function activateTab(name){
  const buttons = $$('.tab-btn');
  const panels = $$('.tab-panel');
  buttons.forEach((b)=> b.classList.toggle('active', b.dataset.tab === name));
  panels.forEach((p)=> p.classList.toggle('active', p.id === 'tab-' + name));
  localStorage.setItem(ACTIVE_TAB_KEY, name);
  const activePanel = $('#tab-' + name);
  if (activePanel) {
    initTextareaUX(activePanel);
    wireLivePreview(activePanel);
  }
}
function setupTabs() {
  const buttons = $$('.tab-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });
  const saved = localStorage.getItem(ACTIVE_TAB_KEY);
  const first = buttons[0]?.dataset.tab;
  const target = saved || first;
  if (target) activateTab(target);
}

/* ---------------- Diagnostics ---------------- */
function bindDiagnostics() {
  const btn = $('#run-diag');
  const wrap = $('#diag-wrap');
  const status = $('#diag-status');
  const output = $('#diag-output');
  if (!btn || !wrap) return;
  btn.addEventListener('click', async () => {
    wrap.style.display = 'block';
    if (status) status.textContent = '正在运行诊断...';
    if (output) output.textContent = '';
    try {
      const res = await fetch('/api/admin/diag?_=' + Date.now(), { credentials: 'include', cache: 'no-store' });
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch (_) {}
      if (!res.ok) throw new Error((json && json.error) || text || 'HTTP ' + res.status);
      if (status) {
        const env = json.env?.vercelEnv || '未知';
        const token = json.tokenDetected ? '令牌正常' : '令牌缺失';
        const conn = json.connectivity?.ok ? '连通正常' : ('连接异常: ' + (json.connectivity?.error || 'n/a'));
        status.textContent = `Env: ${env} · ${token} · ${conn}`;
      }
      if (output) output.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      if (status) status.textContent = '诊断失败: ' + (e.message || e);
    }
  });
}

/* ---------------- Daily Brief ---------------- */
function bindDailyBrief() {
  const fields = { 
    slug: $('#b-slug'),
    title: $('#b-title'),
    bullets: $('#b-bullets'),
    schedule: $('#b-schedule'),
    symbol: $('#b-symbol'),
    interval: $('#b-interval')
  };
  const msg = $('#b-msg');
  const indexView = $('#b-index');
  const btnPublish = $('#b-publish');
  const btnDelete = $('#b-delete');
  const btnReuse = $('#b-reuse');
  const btnPreview = $('#b-preview');
  const btnClear = $('#b-clear');
  const btnRefresh = $('#b-refresh');

  initTextareaUX($('#tab-brief'));
  wireLivePreview($('#tab-brief'));

  const ensureDefaultSlug = () => { if (fields.slug && !fields.slug.value) fields.slug.value = today(); };
  const clearForm = () => {
    if (fields.slug) fields.slug.value = today();
    if (fields.title) fields.title.value = '';
    if (fields.bullets) fields.bullets.value = '';
    if (fields.schedule) fields.schedule.value = '';
    if (fields.symbol) fields.symbol.value = '';
    if (fields.interval) fields.interval.value = '60';
  };
  const populate = (doc) => {
    if (!doc) return;
    if (fields.slug) fields.slug.value = doc.slug || today();
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.bullets) fields.bullets.value = joinLines(doc.bullets);
    if (fields.schedule) fields.schedule.value = joinLines(doc.schedule);
    if (fields.symbol) fields.symbol.value = (doc.chart && doc.chart.symbol) || doc.symbol || '';
    if (fields.interval) fields.interval.value = (doc.chart && doc.chart.interval) || '60';
  };

  const draft = wireDraft('brief', fields, { onChange(){ /* 预览已防重复 */ wireLivePreview($('#tab-brief')); }});
  attachCounter(fields.bullets);
  attachCounter(fields.schedule);

  ensureDefaultSlug();
  refreshIndexView('daily-brief', indexView);

  if (btnPublish) btnPublish.addEventListener('click', async () => {
    ensureDefaultSlug();
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        slug: fields.slug?.value?.trim() || today(),
        title: fields.title?.value?.trim() || undefined,
        bullets: splitLines(fields.bullets?.value || ''),
        schedule: splitLines(fields.schedule?.value || ''),
        chart: {
          symbol: fields.symbol?.value?.trim() || undefined,
          interval: fields.interval?.value || '60'
        }
      };
      const r = await __apiFetch(`/api/daily-brief/${encodeURIComponent(payload.slug)}.json`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      draft.clear();
      await refreshIndexView('daily-brief', indexView);
    } catch (e) {
      if (msg) msg.textContent = '发布失败: ' + (e.message || e);
    }
  });

  if (btnDelete) btnDelete.addEventListener('click', async () => {
    ensureDefaultSlug();
    const slug = fields.slug?.value?.trim();
    if (!slug) return;
    if (!confirm(`确认删除每日简报：${slug}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      draft.clear();
      await refreshIndexView('daily-brief', indexView);
    } catch (e) {
      if (msg) msg.textContent = '删除失败: ' + (e.message || e);
    }
  });

  if (btnReuse) btnReuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('daily-brief');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.slug;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('daily-brief', latest);
      populate(doc || {});
      if (fields.slug) fields.slug.value = today();
      if (msg) msg.textContent = `已载入 ${latest}，Slug 自动改为今日。`;
      wireLivePreview($('#tab-brief'));
    } catch (e) {
      if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e);
    }
  });

  if (btnPreview) btnPreview.addEventListener('click', () => {
    ensureDefaultSlug();
    const slug = fields.slug?.value?.trim() || today();
    window.open(`/#/daily-brief/${encodeURIComponent(slug)}`, '_blank', 'noopener');
  });

  if (btnClear) btnClear.addEventListener('click', () => { clearForm(); draft.clear(); if (msg) msg.textContent = ''; wireLivePreview($('#tab-brief')); });
  if (btnRefresh) btnRefresh.addEventListener('click', () => { refreshIndexView('daily-brief', indexView); });
}

/* ---------------- Analyses ---------------- */
function bindAnalyses() {
  const fields = {
    slug: $('#a-slug'), title: $('#a-title'), symbol: $('#a-symbol'), tf: $('#a-tf'), date: $('#a-date'), bias: $('#a-bias'),
    tags: $('#a-tags'), supports: $('#a-supports'), resistances: $('#a-resistances'), context: $('#a-context'), view: $('#a-view'),
    invalidation: $('#a-invalidation'), chartSymbol: $('#a-chart-symbol'), chartInterval: $('#a-chart-interval')
  };
  const msg = $('#a-msg');
  const indexView = $('#a-index');
  const buttons = {
    publish: $('#a-publish'), delete: $('#a-delete'), reuse: $('#a-reuse'), preview: $('#a-preview'), clear: $('#a-clear'), refresh: $('#a-refresh')
  };

  initTextareaUX($('#tab-analyses'));
  wireLivePreview($('#tab-analyses'));
  attachCounter(fields.supports);
  attachCounter(fields.resistances);
  attachCounter(fields.context);
  attachCounter(fields.view);

  const draft = wireDraft('analyses', fields, { onChange(){ wireLivePreview($('#tab-analyses')); }});

  const clearForm = () => {
    if (fields.slug) fields.slug.value = '';
    if (fields.title) fields.title.value = '';
    if (fields.symbol) fields.symbol.value = '';
    if (fields.tf) fields.tf.value = '';
    if (fields.date) fields.date.value = today();
    if (fields.bias) fields.bias.value = 'neutral';
    if (fields.tags) fields.tags.value = '';
    if (fields.supports) fields.supports.value = '';
    if (fields.resistances) fields.resistances.value = '';
    if (fields.context) fields.context.value = '';
    if (fields.view) fields.view.value = '';
    if (fields.invalidation) fields.invalidation.value = '';
    if (fields.chartSymbol) fields.chartSymbol.value = '';
    if (fields.chartInterval) fields.chartInterval.value = '60';
  };

  const populate = (doc) => {
    if (!doc) return;
    if (fields.slug) fields.slug.value = doc.slug || '';
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.symbol) fields.symbol.value = doc.symbol || '';
    if (fields.tf) fields.tf.value = doc.tf || doc.interval || '';
    if (fields.date) fields.date.value = doc.date || today();
    if (fields.bias) fields.bias.value = doc.bias || 'neutral';
    if (fields.tags) fields.tags.value = Array.isArray(doc.tags) ? doc.tags.join(', ') : '';
    if (fields.supports) fields.supports.value = joinLines(doc.supports);
    if (fields.resistances) fields.resistances.value = joinLines(doc.resistances);
    if (fields.context) fields.context.value = doc.context || '';
    if (fields.view) fields.view.value = doc.view || '';
    if (fields.invalidation) fields.invalidation.value = doc.invalidation || '';
    if (fields.chartSymbol) fields.chartSymbol.value = (doc.chart && doc.chart.symbol) || doc.chartSymbol || doc.symbol || '';
    if (fields.chartInterval) fields.chartInterval.value = (doc.chart && doc.chart.interval) || doc.chartInterval || '60';
  };

  refreshIndexView('analyses', indexView);

  if (buttons.publish) buttons.publish.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        slug,
        title: fields.title?.value?.trim() || undefined,
        symbol: fields.symbol?.value?.trim() || undefined,
        tf: fields.tf?.value?.trim() || undefined,
        date: fields.date?.value?.trim() || today(),
        bias: fields.bias?.value || 'neutral',
        tags: splitLines((fields.tags?.value || '').replace(/,/g, '\n')),
        supports: splitLines(fields.supports?.value || ''),
        resistances: splitLines(fields.resistances?.value || ''),
        context: fields.context?.value?.trim() || undefined,
        view: fields.view?.value?.trim() || undefined,
        invalidation: fields.invalidation?.value?.trim() || undefined,
        chart: { symbol: fields.chartSymbol?.value?.trim() || undefined, interval: fields.chartInterval?.value || '60' }
      };
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      draft.clear();
      await refreshIndexView('analyses', indexView);
    } catch (e) { if (msg) msg.textContent = '发布失败: ' + (e.message || e); }
  });

  if (buttons.delete) buttons.delete.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (!confirm(`确认删除市场分析：${slug}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      draft.clear();
      await refreshIndexView('analyses', indexView);
    } catch (e) { if (msg) msg.textContent = '删除失败: ' + (e.message || e); }
  });

  if (buttons.reuse) buttons.reuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('analyses');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.slug;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('analyses', latest);
      populate(doc || {});
      if (fields.slug && doc?.slug) fields.slug.value = `${doc.slug}-${today()}`;
      if (msg) msg.textContent = `已载入 ${latest}，Slug 已追加今日日期。`;
      wireLivePreview($('#tab-analyses'));
    } catch (e) { if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e); }
  });

  if (buttons.preview) buttons.preview.addEventListener('click', () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return;
    window.open(`/#/trade-journal?slug=${encodeURIComponent(slug)}`, '_blank', 'noopener');
  });

  if (buttons.clear) buttons.clear.addEventListener('click', () => { clearForm(); draft.clear(); if (msg) msg.textContent = ''; wireLivePreview($('#tab-analyses')); });
  if (buttons.refresh) buttons.refresh.addEventListener('click', () => { refreshIndexView('analyses', indexView); });
}

/* ---------------- Market News ---------------- */
function bindNews() {
  const fields = { id: $('#n-id'), title: $('#n-title'), source: $('#n-source'), url: $('#n-url'), date: $('#n-date'), tags: $('#n-tags'), summary: $('#n-summary'), bullets: $('#n-bullets') };
  const msg = $('#n-msg');
  const indexView = $('#n-index');
  const buttons = { publish: $('#n-publish'), delete: $('#n-delete'), reuse: $('#n-reuse'), preview: $('#n-preview'), clear: $('#n-clear'), refresh: $('#n-refresh') };

  initTextareaUX($('#tab-news'));
  wireLivePreview($('#tab-news'));
  attachCounter(fields.summary);
  attachCounter(fields.bullets);

  const draft = wireDraft('news', fields, { onChange(){ wireLivePreview($('#tab-news')); }});

  const clearForm = () => {
    if (fields.id) fields.id.value = `${today()}-1`;
    if (fields.title) fields.title.value = '';
    if (fields.source) fields.source.value = '';
    if (fields.url) fields.url.value = '';
    if (fields.date) fields.date.value = new Date().toISOString();
    if (fields.tags) fields.tags.value = '';
    if (fields.summary) fields.summary.value = '';
    if (fields.bullets) fields.bullets.value = '';
  };
  const populate = (doc) => {
    if (fields.id) fields.id.value = doc.id || `${today()}-1`;
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.source) fields.source.value = doc.source || '';
    if (fields.url) fields.url.value = doc.url || '';
    if (fields.date) fields.date.value = doc.date || new Date().toISOString();
    if (fields.tags) fields.tags.value = Array.isArray(doc.tags) ? doc.tags.join(', ') : '';
    if (fields.summary) fields.summary.value = doc.summary || '';
    if (fields.bullets) fields.bullets.value = joinLines(doc.bullets);
  };

  clearForm();
  refreshIndexView('market-news', indexView);

  if (buttons.publish) buttons.publish.addEventListener('click', async () => {
    const id = fields.id?.value?.trim();
    if (!id) return msg && (msg.textContent = '请输入 ID');
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        id,
        title: fields.title?.value?.trim() || undefined,
        source: fields.source?.value?.trim() || undefined,
        url: fields.url?.value?.trim() || undefined,
        date: fields.date?.value?.trim() || new Date().toISOString(),
        tags: splitLines((fields.tags?.value || '').replace(/,/g, '\n')),
        summary: fields.summary?.value?.trim() || undefined,
        bullets: splitLines(fields.bullets?.value || '')
      };
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      draft.clear();
      await refreshIndexView('market-news', indexView);
    } catch (e) { if (msg) msg.textContent = '发布失败: ' + (e.message || e); }
  });

  if (buttons.delete) buttons.delete.addEventListener('click', async () => {
    const id = fields.id?.value?.trim();
    if (!id) return msg && (msg.textContent = '请输入 ID');
    if (!confirm(`确认删除市场快讯：${id}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      draft.clear();
      await refreshIndexView('market-news', indexView);
    } catch (e) { if (msg) msg.textContent = '删除失败: ' + (e.message || e); }
  });

  if (buttons.reuse) buttons.reuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('market-news');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.id;
      if (!最新) throw new Error('索引数据无效');
      const doc = await fetchDocument('market-news', latest);
      populate(doc || {});
      if (fields.id) fields.id.value = `${today()}-1`;
      if (msg) msg.textContent = `已载入 ${latest}，ID 已更新为今日。`;
      wireLivePreview($('#tab-news'));
    } catch (e) { if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e); }
  });

  if (buttons.preview) buttons.preview.addEventListener('click', () => { window.open('/#/market-news', '_blank', 'noopener'); });
  if (buttons.clear) buttons.clear.addEventListener('click', () => { clearForm(); draft.clear(); if (msg) msg.textContent = ''; wireLivePreview($('#tab-news')); });
  if (buttons.refresh) buttons.refresh.addEventListener('click', () => { refreshIndexView('market-news', indexView); });
}

/* ---------------- Research Syllabus（结构化编辑器：仅前端） ---------------- */
function bindResearchSyllabus() {
  const textarea = $('#r-json');
  const host = $('#r-structured');
  const msg = $('#r-msg');
  const btnLoad = $('#r-load');
  const btnSave = $('#r-save');
  const btnClear = $('#r-clear');
  const btnPreview = $('#r-preview');
  const btnAddLevel = $('#r-add-level');
  const btnExpandAll = $('#r-expand-all');
  const btnCollapseAll = $('#r-collapse-all');
  const btnSyncJson = $('#r-sync-json');

  if (!textarea && !host) return;

  initTextareaUX($('#tab-syllabus'));
  attachCounter(textarea);

  let syllabusData = [];
  const setMessage = (text) => { if (msg) msg.textContent = text || ''; };

  const ensureLessonShape = (lesson = {}) => ({ name: lesson.name || '', link: lesson.link || '', type: lesson.type || '', duration: lesson.duration || '', desc: lesson.desc || '' });
  const ensureLevelShape = (level = {}) => ({ level: level.level || '', desc: level.desc || '', icon: level.icon || '', lessons: Array.isArray(level.lessons) && level.lessons.length ? level.lessons.map(ensureLessonShape) : [ensureLessonShape()], _collapsed: !!level._collapsed });
  const sanitize = (data) => data.map((level) => ({ level: level.level || '', desc: level.desc || '', icon: level.icon || '', lessons: (Array.isArray(level.lessons) ? level.lessons : []).map((lesson) => ({ name: lesson.name || '', link: lesson.link || '', type: lesson.type || '', duration: lesson.duration || '', desc: lesson.desc || '' })) }));

  const syncTextarea = () => { if (textarea) textarea.value = safeStringify(sanitize(syllabusData)); };

  const moveLevel = (from, to) => { if (to < 0 || to >= syllabusData.length) return; const [item] = syllabusData.splice(from, 1); syllabusData.splice(to, 0, item); renderStructured(); syncTextarea(); };
  const moveLesson = (levelIdx, from, to) => {
    const level = syllabusData[levelIdx];
    if (!level) return;
    if (to < 0 || to >= level.lessons.length) return;
    const [item] = level.lessons.splice(from, 1);
    level.lessons.splice(to, 0, item);
    renderStructured();
    syncTextarea();
  };

  const renderStructured = () => {
    if (!host) return;
    host.innerHTML = '';
    syllabusData.forEach((level, levelIndex) => {
      syllabusData[levelIndex] = ensureLevelShape(level);
      const current = syllabusData[levelIndex];

      const card = document.createElement('div');
      card.className = 'syllabus-level';
      if (current._collapsed) card.classList.add('collapsed');

      const header = document.createElement('div');
      header.className = 'syllabus-level-header';

      const levelInput = document.createElement('input');
      levelInput.placeholder = 'Level name';
      levelInput.value = current.level;
      levelInput.addEventListener('input', (e) => { current.level = e.target.value; syncTextarea(); });
      header.appendChild(levelInput);

      const descInput = document.createElement('input');
      descInput.placeholder = 'Description';
      descInput.value = current.desc;
      descInput.addEventListener('input', (e) => { current.desc = e.target.value; syncTextarea(); });
      header.appendChild(descInput);

      const iconInput = document.createElement('input');
      iconInput.placeholder = 'Icon (emoji)';
      iconInput.value = current.icon;
      iconInput.addEventListener('input', (e) => { current.icon = e.target.value; syncTextarea(); });
      header.appendChild(iconInput);

      const actions = document.createElement('div');
      actions.className = 'syllabus-level-actions';

      const addLessonBtn = document.createElement('button');
      addLessonBtn.textContent = '新增课程';
      addLessonBtn.addEventListener('click', () => { current.lessons.push(ensureLessonShape()); renderStructured(); syncTextarea(); });
      actions.appendChild(addLessonBtn);

      const upBtn = document.createElement('button');
      upBtn.textContent = '上移';
      upBtn.disabled = levelIndex === 0;
      upBtn.addEventListener('click', () => moveLevel(levelIndex, levelIndex - 1));
      actions.appendChild(upBtn);

      const downBtn = document.createElement('button');
      downBtn.textContent = '下移';
      downBtn.disabled = levelIndex === syllabusData.length - 1;
      downBtn.addEventListener('click', () => moveLevel(levelIndex, levelIndex + 1));
      actions.appendChild(downBtn);

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = current._collapsed ? '展开' : '收起';
      toggleBtn.addEventListener('click', () => { current._collapsed = !current._collapsed; renderStructured(); });
      actions.appendChild(toggleBtn);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '删除';
      removeBtn.addEventListener('click', () => {
        if (!confirm(`删除级别 "${current.level}"?`)) return;
        syllabusData.splice(levelIndex, 1);
        renderStructured();
        syncTextarea();
      });
      actions.appendChild(removeBtn);

      header.appendChild(actions);
      card.appendChild(header);

      const lessonsWrap = document.createElement('div');
      lessonsWrap.className = 'syllabus-lessons';
      current.lessons.forEach((lesson, lessonIndex) => {
        current.lessons[lessonIndex] = ensureLessonShape(lesson);
        const lessonData = current.lessons[lessonIndex];

        const row = document.createElement('div');
        row.className = 'lesson-row';

        const nameInput = document.createElement('input');
        nameInput.placeholder = '课程标题';
        nameInput.value = lessonData.name;
        nameInput.addEventListener('input', (e) => { lessonData.name = e.target.value; syncTextarea(); });
        row.appendChild(nameInput);

        const linkInput = document.createElement('input');
        linkInput.placeholder = '课程链接 (#/articles/...)';
        linkInput.value = lessonData.link;
        linkInput.addEventListener('input', (e) => { lessonData.link = e.target.value; syncTextarea(); });
        row.appendChild(linkInput);

        const typeInput = document.createElement('input');
        typeInput.placeholder = '标签/类别 (可选)';
        typeInput.value = lessonData.type;
        typeInput.addEventListener('input', (e) => { lessonData.type = e.target.value; syncTextarea(); });
        row.appendChild(typeInput);

        const durationInput = document.createElement('input');
        durationInput.placeholder = '时长 (例: 8m)';
        durationInput.value = lessonData.duration;
        durationInput.style.maxWidth = '90px';
        durationInput.style.flex = '0 0 90px';
        durationInput.addEventListener('input', (e) => { lessonData.duration = e.target.value; syncTextarea(); });
        row.appendChild(durationInput);

        const lessonActions = document.createElement('div');
        lessonActions.className = 'lesson-actions';

        const lessonUp = document.createElement('button');
        lessonUp.textContent = '上移';
        lessonUp.disabled = lessonIndex === 0;
        lessonUp.addEventListener('click', () => moveLesson(levelIndex, lessonIndex, lessonIndex - 1));
        lessonActions.appendChild(lessonUp);

        const lessonDown = document.createElement('button');
        lessonDown.textContent = '下移';
        lessonDown.disabled = lessonIndex === current.lessons.length - 1;
        lessonDown.addEventListener('click', () => moveLesson(levelIndex, lessonIndex, lessonIndex + 1));
        lessonActions.appendChild(lessonDown);

        const lessonRemove = document.createElement('button');
        lessonRemove.textContent = '删除';
        lessonRemove.addEventListener('click', () => {
          if (current.lessons.length <= 1) {
            lessonData.name = ''; lessonData.link = ''; lessonData.type = ''; lessonData.duration = ''; lessonData.desc = '';
          } else {
            current.lessons.splice(lessonIndex, 1);
          }
          renderStructured(); syncTextarea();
        });
        lessonActions.appendChild(lessonRemove);

        row.appendChild(lessonActions);
        lessonsWrap.appendChild(row);

        const descArea = document.createElement('textarea');
        descArea.className = 'lesson-desc';
        descArea.placeholder = '课程简介 (可选)';
        descArea.value = lessonData.desc;
        autosize(descArea); cleanPaste(descArea); attachCounter(descArea);
        descArea.addEventListener('input', (e) => { lessonData.desc = e.target.value; syncTextarea(); });
        lessonsWrap.appendChild(descArea);
      });

      card.appendChild(lessonsWrap);
      host.appendChild(card);
    });
  };

  const loadOnline = async () => {
    setMessage('正在加载...');
    try {
      const res = await __apiFetch('/api/research/syllabus.json?_=' + Date.now());
      const data = unwrapResponse(res, 'FETCH_FAILED');
      const raw = Array.isArray(data?.syllabus) ? data.syllabus : Array.isArray(data) ? data : [];
      syllabusData = raw.map(ensureLevelShape);
      renderStructured();
      syncTextarea();
      setMessage('已加载线上课程数据。');
    } catch (e) {
      syllabusData = [];
      renderStructured();
      syncTextarea();
      setMessage('加载失败: ' + (e.message || e));
    }
  };

  const applyJsonToStructured = () => {
    if (!textarea) return;
    try {
      const parsed = JSON.parse(textarea.value || '[]');
      if (!Array.isArray(parsed)) throw new Error('JSON 数据必须为数组。');
      syllabusData = parsed.map(ensureLevelShape);
      renderStructured();
      syncTextarea();
      setMessage('结构视图已根据 JSON 更新。');
    } catch (e) { setMessage('Apply 失败: ' + (e.message || e)); }
  };

  const saveOnline = async () => {
    setMessage('正在保存...');
    try {
      const payload = { syllabus: sanitize(syllabusData) };
      const res = await __apiFetch('/api/research/syllabus', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      unwrapResponse(res, 'SAVE_FAILED');
      setMessage('保存成功。');
    } catch (e) { setMessage('Save 失败: ' + (e.message || e)); }
  };

  if (btnLoad) btnLoad.addEventListener('click', () => loadOnline());
  if (btnSave) btnSave.addEventListener('click', () => saveOnline());
  if (btnClear) btnClear.addEventListener('click', () => { syllabusData = []; renderStructured(); syncTextarea(); setMessage('已清空编辑器。'); });
  if (btnPreview) btnPreview.addEventListener('click', () => window.open('/#/knowledge-lab', '_blank', 'noopener'));
  if (btnAddLevel) btnAddLevel.addEventListener('click', () => { syllabusData.push(ensureLevelShape({ level: '新课程阶段', lessons: [ensureLessonShape({ name: '课程标题' })] })); renderStructured(); syncTextarea(); });
  if (btnExpandAll) btnExpandAll.addEventListener('click', () => { syllabusData.forEach((level) => { level._collapsed = false; }); renderStructured(); });
  if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => { syllabusData.forEach((level) => { level._collapsed = true; }); renderStructured(); });
  if (btnSyncJson) btnSyncJson.addEventListener('click', applyJsonToStructured);

  renderStructured();
  loadOnline().catch(() => {});
}

/* ---------------- Course Content Editor（按课时写文章） ---------------- */
function bindCourseContentEditor() {
  const listHost = document.getElementById('lesson-list');
  const listMsg = document.getElementById('lesson-list-msg');

  const meta = { level: document.getElementById('lesson-level'), name: document.getElementById('lesson-name') };
  const fields = {
    slug: document.getElementById('lesson-slug'),
    title: document.getElementById('lesson-article-title'),
    excerpt: document.getElementById('lesson-article-excerpt'),
    tags: document.getElementById('lesson-article-tags'),
    hero: document.getElementById('lesson-article-hero'),
    body: document.getElementById('lesson-article-body')
  };
  const msg = document.getElementById('lesson-msg');
  const btn = {
    save: document.getElementById('lesson-save'),
    del: document.getElementById('lesson-delete'),
    prev: document.getElementById('lesson-preview'),
    open: document.getElementById('lesson-open')
  };

  if (!listHost) return;

  initTextareaUX($('#tab-syllabus'));
  wireLivePreview($('#tab-syllabus'));

  const state = { current: null }; // { level, name, link, slug }
  const toSlug = (text) => String(text || '').toLowerCase().replace(/[#/]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
  const linkToSlug = (link) => { if (!link) return ''; const m = String(link).match(/#\/?articles\/?([A-Za-z0-9_-]+)/); return m ? m[1] : ''; };

  const clearEditor = () => {
    if (meta.level) meta.level.textContent = '-';
    if (meta.name) meta.name.textContent = '未选择课程/课时';
    if (fields.slug) fields.slug.value = '';
    if (fields.title) fields.title.value = '';
    if (fields.excerpt) fields.excerpt.value = '';
    if (fields.tags) fields.tags.value = '';
    if (fields.hero) fields.hero.value = '';
    if (fields.body) fields.body.value = '';
  };
  const populateEditor = (lessonMeta, doc) => {
    if (meta.level) meta.level.textContent = lessonMeta.level || '-';
    if (meta.name) meta.name.textContent = lessonMeta.name || '';
    const derivedSlug = lessonMeta.slug || linkToSlug(lessonMeta.link) || toSlug(lessonMeta.name || '');
    if (fields.slug) fields.slug.value = doc?.slug || derivedSlug;
    if (fields.title) fields.title.value = doc?.title || (lessonMeta.name || '');
    if (fields.excerpt) fields.excerpt.value = doc?.excerpt || '';
    if (fields.tags) fields.tags.value = Array.isArray(doc?.tags) ? doc.tags.join(', ') : '';
    if (fields.hero) fields.hero.value = doc?.hero || '';
    if (fields.body) fields.body.value = doc?.body || '';
    wireLivePreview($('#tab-articles-from-syllabus'));
  };

  const renderList = (syllabus) => {
   
