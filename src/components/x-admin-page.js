// src/components/x-admin-page.js
// 轻量 Admin 控制台（专注 daily-brief），进入后台后无需再次输入密码
class XAdminPage extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({ mode:'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
        .grid{display:grid;grid-template-columns: 1fr 1fr; gap:12px}
        .full{grid-column:1/-1}
        input,textarea,select{background:#0c0f12;color:#e8eaec;border:1px solid #23262b;border-radius:10px;padding:10px 12px;outline:none;width:100%}
        textarea{min-height:140px;resize:vertical}
        button{background:#3b82f6;color:#fff;border:none;border-radius:10px;padding:10px 14px;cursor:pointer}
        button.ghost{background:#1b1f24}
        button.danger{background:#ef4444}
        .muted{color:#9aa4ad;font-size:12px}
        .ok{color:#22c55e}
        .err{color:#ef4444}
        .list{margin-top:14px;border:1px solid #23262b;border-radius:10px;overflow:auto;max-height:260px}
        .list-item{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border-top:1px solid #23262b}
        .list-item:first-child{border-top:none}
        .kbd{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;background:#101318;border:1px solid #23262b;border-radius:6px;padding:2px 6px}
      </style>

      <div class="bar">
        <strong>Daily Brief 发布</strong>
        <span class="muted">发布与删除会自动携带 Authorization 头；无需再次输入密码。</span>
        <button id="logout" class="ghost">退出登录</button>
      </div>

      <div class="grid">
        <div>
          <label>Slug（日期或自定义）<br/><input id="slug" placeholder="例如：2025-10-18" /></label>
        </div>
        <div>
          <label>Title<br/><input id="title" placeholder="标题" /></label>
        </div>
        <div class="full">
          <label>Body（支持任意 JSON 序列化文本/富文本）<br/>
            <textarea id="body" placeholder='例如：{"bullets":["...","..."]} 或 普通文本'></textarea>
          </label>
          <div class="muted">建议 body 结构统一；此处不强制 schema，后端按 JSON 写入。</div>
        </div>

        <div class="bar full">
          <button id="btnSave">发布 / 覆盖</button>
          <button id="btnLoad" class="ghost">读取</button>
          <button id="btnDelete" class="danger">删除</button>
          <button id="btnList" class="ghost">刷新索引</button>
          <span id="msg" class="muted"></span>
        </div>

        <div class="full">
          <div class="muted">快捷键：<span class="kbd">Ctrl/Cmd + Enter</span> 发布</div>
          <div id="list" class="list" hidden></div>
        </div>
      </div>
    `;
  }

  connectedCallback(){
    this.$ = sel => this.shadowRoot.querySelector(sel);
    this.$('#btnSave').addEventListener('click', ()=>this.publish());
    this.$('#btnLoad').addEventListener('click', ()=>this.load());
    this.$('#btnDelete').addEventListener('click', ()=>this.remove());
    this.$('#btnList').addEventListener('click', ()=>this.refreshIndex());
    this.$('#logout').addEventListener('click', ()=>this.logout());
    this.keyHandler = (e)=>{
      if((e.ctrlKey||e.metaKey) && e.key==='Enter'){ e.preventDefault(); this.publish(); }
    };
    window.addEventListener('keydown', this.keyHandler);
    // 初始加载索引
    this.refreshIndex();
  }
  disconnectedCallback(){
    window.removeEventListener('keydown', this.keyHandler);
  }

  // ====== 通用 ======
  authHeader(){
    try{
      const pw = (typeof localStorage!=='undefined') ? localStorage.getItem('TRAN_ADMIN_PW') : null;
      if(!pw) return {};
      return { 'Authorization': 'Bearer ' + pw };
    }catch(e){ return {}; }
  }
  setMsg(text, type='muted'){
    const el = this.$('#msg');
    el.className = type;
    el.textContent = text || '';
  }
  async fetchJSON(url, opts={}){
    const headers = Object.assign({ 'Content-Type':'application/json' }, this.authHeader(), opts.headers||{});
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    let data=null; try{ data = await res.json(); }catch{ data=null; }
    return { res, data };
  }

  // ====== 动作 ======
  async publish(){
    const slug = (this.$('#slug').value||'').trim();
    if(!slug){ this.setMsg('请填写 slug', 'err'); return; }
    const title = (this.$('#title').value||'').trim();
    const raw = this.$('#body').value||'';
    let body = null;
    try { body = raw ? JSON.parse(raw) : {}; }
    catch { body = raw; } // 不是 JSON 就按纯文本保存

    const payload = { slug, title, body, updatedAt:new Date().toISOString() };
    this.setMsg('发布中…');

    const { res, data } = await this.fetchJSON(`/api/daily-brief/${encodeURIComponent(slug)}.json`, {
      method:'PUT',
      body: JSON.stringify(payload)
    });
    if(!res.ok){ this.setMsg((data && (data.error||data.message)) || '发布失败', 'err'); return; }
    this.setMsg('发布成功', 'ok');
    this.refreshIndex();
  }

  async load(){
    const slug = (this.$('#slug').value||'').trim();
    if(!slug){ this.setMsg('请填写 slug', 'err'); return; }
    this.setMsg('读取中…');
    const { res, data } = await this.fetchJSON(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method:'GET' });
    if(!res.ok){ this.setMsg((data && (data.error||data.message)) || '读取失败', 'err'); return; }
    this.$('#title').value = data?.title || '';
    try{ this.$('#body').value = JSON.stringify(data?.body ?? data, null, 2); }
    catch{ this.$('#body').value = data ? String(data) : ''; }
    this.setMsg('已读取', 'ok');
  }

  async remove(){
    const slug = (this.$('#slug').value||'').trim();
    if(!slug){ this.setMsg('请填写 slug', 'err'); return; }
    if(!confirm(`确定删除：${slug} ?`)) return;
    this.setMsg('删除中…');
    const { res, data } = await this.fetchJSON(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method:'DELETE' });
    if(!res.ok){ this.setMsg((data && (data.error||data.message)) || '删除失败', 'err'); return; }
    this.setMsg('已删除', 'ok');
    this.refreshIndex();
  }

  async refreshIndex(){
    const box = this.$('#list');
    box.hidden = false;
    box.innerHTML = `<div class="list-item"><span class="muted">加载索引中…</span></div>`;
    const { res, data } = await this.fetchJSON(`/api/daily-brief/index.json`, { method:'GET', headers:{} });
    if(!res.ok){ box.innerHTML = `<div class="list-item"><span class="err">索引获取失败</span></div>`; return; }
    const items = Array.isArray(data) ? data : [];
    if(items.length===0){ box.innerHTML = `<div class="list-item"><span class="muted">暂无条目</span></div>`; return; }
    box.innerHTML = items.map(slug=>`
      <div class="list-item">
        <code>${slug}</code>
        <div>
          <button data-act="fill" data-slug="${slug}" class="ghost">填入</button>
          <button data-act="get" data-slug="${slug}" class="ghost">读取</button>
          <button data-act="del" data-slug="${slug}" class="danger">删除</button>
        </div>
      </div>
    `).join('');
    box.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        const s = btn.dataset.slug;
        const act = btn.dataset.act;
        if(act==='fill'){ this.$('#slug').value = s; this.setMsg('已填入 slug'); }
        if(act==='get'){ this.$('#slug').value = s; this.load(); }
        if(act==='del'){ this.$('#slug').value = s; this.remove(); }
      });
    });
  }

  logout(){
    try{ localStorage.removeItem('TRAN_ADMIN_PW'); }catch(e){}
    location.reload();
  }
}

customElements.define('x-admin-page', XAdminPage);
