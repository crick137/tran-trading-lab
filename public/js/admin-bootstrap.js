// public/js/admin-bootstrap.js
// Minimal, ASCII-only bootstrap to ensure login works even if HTML text is garbled

const $$ = (s, el=document)=> Array.from(el.querySelectorAll(s));
const $  = (s, el=document)=> el.querySelector(s);

// State: token from sessionStorage
let ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function setAdminToken(tok){ ADMIN_TOKEN = tok || ''; if(tok){ sessionStorage.setItem('tran_admin_token', tok); } else { sessionStorage.removeItem('tran_admin_token'); } }

async function apiFetch(url, init = {}){
  const timeoutMs = 12000;
  const ctrl = new AbortController();
  const id = setTimeout(()=> ctrl.abort(new DOMException('timeout','AbortError')), timeoutMs);
  const headers = new Headers(init.headers || {});
  if (ADMIN_TOKEN) headers.set('Authorization', 'Bearer ' + ADMIN_TOKEN);
  try{
    const res  = await fetch(url, { credentials: 'include', cache: 'no-store', ...init, headers, signal: ctrl.signal });
    const text = await res.text();
    let data = null; try { data = JSON.parse(text); } catch {}
    return { res, ok: res.ok, status: res.status, data, text };
  } finally { clearTimeout(id); }
}

function buildOverlay(){
  const host = document.getElementById('pw-overlay');
  if (!host) return;
  host.innerHTML = [
    '<div class="login-box">',
    '  <h3 style="margin:4px 0 10px">管理员登录</h3>',
    '  <p class="muted" style="margin:0 0 6px">输入口令后即可进入后台。</p>',
    '  <div class="row">',
    '    <input id="admin-pw" type="password" placeholder="ADMIN_PASSWORD" style="flex:1" />',
    '    <button id="pw-进入后台" class="primary">进入后台</button>',
    '  </div>',
    '  <p id="pw-err" class="muted" style="color:#f87171; min-height:18px; margin:8px 0 0"></p>',
    '</div>'
  ].join('');
}

async function syncLoginUI(){
  const overlay = document.getElementById('pw-overlay');
  const adminRoot = document.getElementById('admin-root');
  try{
    const r = await apiFetch('/api/admin/verify?_=' + Date.now());
    const ok = !!(r.data && r.data.authed);
    overlay.style.display = ok ? 'none' : 'flex';
    adminRoot.style.display = ok ? 'block' : 'none';
    return ok;
  }catch{
    overlay.style.display = 'flex';
    adminRoot.style.display = 'none';
    return false;
  }
}

function bindLogin(){
  const btn = document.getElementById('pw-进入后台');
  const inp = document.getElementById('admin-pw');
  const err = document.getElementById('pw-err');
  if (!btn || !inp) return;
  const act = async()=>{
    const pw = (inp.value||'').trim();
    if(!pw){ if(err) err.textContent = 'Please 进入后台 password'; return; }
    if(err) err.textContent = '正在登录...';
    try{
      const { res, data, text } = await apiFetch('/api/admin/login', {
        method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ password: pw })
      });
      if (!res.ok || !data || !data.ok) throw new Error((data && (data.error || data.message)) || text || ('HTTP '+res.status));
      setAdminToken(pw);
      await syncLoginUI();
      if(err) err.textContent = '';
      inp.value = '';
    }catch(e){ if(err) err.textContent = '登录失败: ' + (e && e.message ? e.message : e); }
  };
  btn.addEventListener('click', act);
  inp.addEventListener('keydown', e=>{ if(e.key==='进入后台'){ act(); }});
}

function bindLogout(){
  const btn = document.getElementById('logout-admin');
  if (!btn) return;
  btn.addEventListener('click', async ()=>{
    if (!confirm('确定退出登录？')) return;
    try{ await apiFetch('/api/admin/logout', { method:'POST' }); }catch{}
    setAdminToken('');
    location.reload();
  });
}

// Bootstrap on load
(async function(){
  try{ buildOverlay(); }catch{}
  try{ bindLogin(); bindLogout(); }catch{}
  try{ await syncLoginUI(); }catch{}
  // expose utilities for main script
  window.Admin = { $, $$, apiFetch, setAdminToken };
})();


