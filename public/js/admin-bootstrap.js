// public/js/admin-bootstrap.js
// Minimal, ASCII-only bootstrap to ensure login works even if HTML text is garbled

const $$ = (s, el=document)=> Array.from(el.querySelectorAll(s));
const $  = (s, el=document)=> el.querySelector(s);

// ---------------- State ----------------
let ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function setAdminToken(tok){
  ADMIN_TOKEN = tok || '';
  if (tok) {
    sessionStorage.setItem('tran_admin_token', tok);
  } else {
    sessionStorage.removeItem('tran_admin_token');
  }
}

// ---------------- Fetch (front-only) ----------------
async function apiFetch(url, init = {}){
  const timeoutMs = 12000;
  const ctrl = new AbortController();
  const id = setTimeout(()=> ctrl.abort(new DOMException('timeout','AbortError')), timeoutMs);
  const headers = new Headers(init.headers || {});
  if (ADMIN_TOKEN) headers.set('Authorization', 'Bearer ' + ADMIN_TOKEN);
  // If body is string but no content-type, set JSON by default.
  if (!headers.has('content-type') && typeof init.body === 'string') {
    headers.set('content-type','application/json;charset=utf-8');
  }
  try{
    const res  = await fetch(url, { credentials: 'include', cache: 'no-store', ...init, headers, signal: ctrl.signal });
    const text = await res.text();
    let data = null; try { data = JSON.parse(text); } catch {}
    return { res, ok: res.ok, status: res.status, data, text };
  } finally { clearTimeout(id); }
}

// ---------------- UI ----------------
function buildOverlay(){
  const host = document.getElementById('pw-overlay');
  if (!host) return;

  host.textContent = '';
  host.style.display = 'flex';

  const box = document.createElement('div');
  box.className = 'login-box';

  const h3  = document.createElement('h3');
  h3.style.margin = '4px 0 10px';
  h3.textContent = 'Admin Login';

  const p   = document.createElement('p');
  p.className = 'muted';
  p.style.margin = '0 0 8px';
  p.textContent = 'Enter the admin token to continue.';

  const row = document.createElement('div');
  row.className = 'row';

  const input = document.createElement('input');
  input.id = 'admin-pw';
  input.type = 'password';
  input.autocomplete = 'current-password';
  input.placeholder = 'ADMIN_PASSWORD';
  input.style.flex = '1';

  const btn = document.createElement('button');
  btn.id = 'pw-login';
  btn.className = 'primary';
  btn.textContent = 'Login';

  row.appendChild(input);
  row.appendChild(btn);

  const more = document.createElement('div');
  more.className = 'row';
  more.style.marginTop = '6px';
  more.style.alignItems = 'center';
  more.style.gap = '10px';

  const cbWrap = document.createElement('label');
  cbWrap.style.display = 'inline-flex';
  cbWrap.style.alignItems = 'center';
  cbWrap.style.gap = '6px';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.id = 'pw-show';
  const cbTxt = document.createElement('span');
  cbTxt.textContent = 'Show';
  cbWrap.appendChild(cb);
  cbWrap.appendChild(cbTxt);

  const caps = document.createElement('span');
  caps.id = 'pw-caps';
  caps.className = 'muted';
  caps.style.minHeight = '18px';

  more.appendChild(cbWrap);
  more.appendChild(caps);

  const err = document.createElement('p');
  err.id = 'pw-err';
  err.className = 'muted';
  err.style.color = '#f87171';
  err.style.minHeight = '18px';
  err.style.margin = '8px 0 0';

  box.appendChild(h3);
  box.appendChild(p);
  box.appendChild(row);
  box.appendChild(more);
  box.appendChild(err);
  host.appendChild(box);
}

function setErr(text){
  const err = document.getElementById('pw-err');
  if (err) err.textContent = text || '';
}

function setCaps(on){
  const el = document.getElementById('pw-caps');
  if (!el) return;
  el.textContent = on ? 'Caps Lock is ON' : '';
}

function setLoggingUI(isBusy){
  const btn = document.getElementById('pw-login');
  const inp = document.getElementById('admin-pw');
  if (btn) {
    btn.disabled = !!isBusy;
    btn.textContent = isBusy ? 'Logging in...' : 'Login';
  }
  if (inp) inp.disabled = !!isBusy;
}

async function syncLoginUI(){
  const overlay  = document.getElementById('pw-overlay');
  const adminRoot= document.getElementById('admin-root');
  try{
    const r = await apiFetch('/api/admin/verify?_=' + Date.now());
    const ok = !!(r.data && r.data.authed);
    if (overlay) overlay.style.display = ok ? 'none' : 'flex';
    if (adminRoot) adminRoot.style.display = ok ? 'block' : 'none';
    return ok;
  }catch{
    if (overlay) overlay.style.display = 'flex';
    if (adminRoot) adminRoot.style.display = 'none';
    return false;
  }
}

function focusPw(){
  const inp = document.getElementById('admin-pw');
  if (!inp) return;
  inp.focus();
  // Select existing value if any for quick overwrite
  try { inp.select(); } catch {}
}

function bindLogin(){
  const btn = document.getElementById('pw-login');
  const inp = document.getElementById('admin-pw');
  const show = document.getElementById('pw-show');

  if (!btn || !inp) return;

  // Show/Hide password
  if (show) {
    show.addEventListener('change', ()=> {
      inp.type = show.checked ? 'text' : 'password';
      focusPw();
    });
  }

  // CapsLock hint
  const capsDetector = (e)=>{
    try{
      const on = e.getModifierState && e.getModifierState('CapsLock');
      setCaps(!!on);
    }catch{ setCaps(false); }
  };
  inp.addEventListener('keyup', capsDetector);
  inp.addEventListener('keydown', capsDetector);

  let logging = false;
  const act = async (tokenFromUI)=>{
    if (logging) return;
    const pw = (typeof tokenFromUI === 'string' ? tokenFromUI : (inp.value||'')).trim();
    if (!pw) { setErr('Please enter the admin token.'); return; }
    setErr(''); setLoggingUI(true); logging = true;
    try{
      const { res, data, text } = await apiFetch('/api/admin/login', {
        method:'POST',
        body: JSON.stringify({ password: pw })
      });
      if (!res.ok || !data || !data.ok) {
        throw new Error((data && (data.error || data.message)) || text || ('HTTP '+res.status));
      }
      setAdminToken(pw);
      await syncLoginUI();
      setErr('');
      inp.value = '';
    }catch(e){
      setErr('Login failed: ' + (e && e.message ? e.message : e));
    }finally{
      setLoggingUI(false); logging = false;
    }
  };

  btn.addEventListener('click', ()=> act());
  inp.addEventListener('keydown', e=>{
    if (e.key === 'Enter') { e.preventDefault(); act(); }
  });

  // Paste-to-login: paste a token and auto-attempt once
  inp.addEventListener('paste', (e)=>{
    try{
      const t = e.clipboardData && e.clipboardData.getData('text');
      if (t && t.trim().length >= 1) {
        setTimeout(()=> act(t.trim()), 0);
      }
    }catch{}
  });

  // Global shortcut: Ctrl/Cmd + L to focus input
  document.addEventListener('keydown', (e)=>{
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      focusPw();
    }
  });
}

function bindLogout(){
  const btn = document.getElementById('logout-admin');
  if (!btn) return;
  btn.addEventListener('click', async ()=>{
    if (!confirm('Sign out now?')) return;
    try{ await apiFetch('/api/admin/logout', { method:'POST' }); }catch{}
    setAdminToken('');
    location.reload();
  });
}

// Try token from URL (?token=... or #token=...)
function extractUrlToken(){
  try{
    const u = new URL(location.href);
    const qs = u.searchParams.get('token');
    if (qs) return qs.trim();
    // hash like #token=xxx
    if (u.hash && /^#token=/i.test(u.hash)) {
      return decodeURIComponent(u.hash.replace(/^#token=/i,'')).trim();
    }
  }catch{}
  return '';
}

// ---------------- Bootstrap ----------------
(async function(){
  try { buildOverlay(); } catch {}
  try { bindLogin(); bindLogout(); } catch {}

  // Autofocus input when overlay is visible
  setTimeout(focusPw, 0);

  // If URL contains token, try it once
  const urlToken = extractUrlToken();
  if (urlToken) {
    const inp = document.getElementById('admin-pw');
    if (inp) inp.value = urlToken;
    // Silent try
    try{
      const { res, data, text } = await apiFetch('/api/admin/login', {
        method:'POST',
        body: JSON.stringify({ password: urlToken })
      });
      if (res.ok && data && data.ok) {
        setAdminToken(urlToken);
      }
    }catch{}
  }

  try { await syncLoginUI(); } catch {}

  // expose utilities for main script
  window.Admin = { $, $$, apiFetch, setAdminToken };
})();
