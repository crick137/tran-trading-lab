// src/components/x-admin-page.js
export default class XAdminPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bind();
  }

  render() {
    this.innerHTML = `
      <style>
        .wrap { max-width: 840px; margin: 24px auto; color: var(--fg,#eaecee); font: 16px/1.6 system-ui,-apple-system; }
        .card { background: var(--card,#15171a); padding: 16px; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.35) }
        input, select, textarea {
          background:#0f1115; border:1px solid #23262b; color:#fff; padding:8px 10px; border-radius:10px; outline:none; width:100%;
        }
        textarea { min-height: 120px }
        .row { display:flex; gap:10px; flex-wrap:wrap; align-items:center }
        button { cursor:pointer; border-radius:10px; padding:10px 14px; }
        .primary { border:0; background:#3b82f6; color:#fff; font-weight:700 }
        .icon { background:transparent; border:1px solid #2a2f36; color:inherit }
        .muted { color:#9aa0a6 }
      </style>
      <div class="wrap">
        <div class="card">
          <h2 style="margin:0 0 10px">Admin · Daily Brief（轻量组件）</h2>
          <div class="row">
            <div style="flex:1">
              <label>日期（YYYY-MM-DD，不填=今天）
                <input id="b-slug" placeholder="2025-10-18" />
              </label>
            </div>
            <div style="flex:1">
              <label>标题
                <input id="b-title" placeholder="Daily Brief 标题（可选）" />
              </label>
            </div>
          </div>
          <label>核心要点（每行一条）
            <textarea id="b-bullets"></textarea>
          </label>
          <label>今日日程（每行一条）
            <textarea id="b-schedule"></textarea>
          </label>
          <div class="row">
            <div style="flex:1">
              <label>图表符号
                <input id="b-symbol" placeholder="FX:XAUUSD" />
              </label>
            </div>
            <div style="width:200px">
              <label>周期
                <select id="b-interval">
                  <option value="15">15m</option>
                  <option value="60" selected>1H</option>
                  <option value="240">4H</option>
                  <option value="1D">1D</option>
                </select>
              </label>
            </div>
          </div>

          <div class="row" style="margin-top:10px">
            <button id="b-publish" class="primary">发布</button>
            <button id="b-reuse" class="icon">昨日复用</button>
            <button id="b-preview" class="icon">预览</button>
            <button id="b-delete" class="icon" style="border-color:#f87171;color:#fca5a5">删除</button>
          </div>
          <p id="b-msg" class="muted" style="margin-top:10px"></p>
        </div>
      </div>
    `;
  }

  $(s){ return this.querySelector(s); }
  today(){ return new Date().toISOString().slice(0,10); }
  authHeader(){ return {}; } // 无鉴权
  bGet(){
    const slug = (this.$('#b-slug').value||'').trim() || this.today();
    const title = (this.$('#b-title').value||'').trim() || undefined;
    const bullets = (this.$('#b-bullets').value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const schedule= (this.$('#b-schedule').value||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const symbol  = (this.$('#b-symbol').value||'').trim() || undefined;
    const interval= this.$('#b-interval').value;
    return { slug, title, bullets, schedule, chart:{ symbol, interval } };
  }

  msg(s){ this.$('#b-msg').textContent = s; }

  async fetchJSON(url, init={}){
    const res  = await fetch(url, { cache:'no-store', ...init });
    const text = await res.text();
    let data=null; try{ data=JSON.parse(text) }catch{}
    return { ok:res.ok, status:res.status, data, text };
  }
  async postJSON(url, payload){
    const r = await this.fetchJSON(url, { method:'POST', headers:{ 'content-type':'application/json', ...this.authHeader() }, body: JSON.stringify(payload) });
    if(!r.ok) throw (r.data?.error || r.text || `HTTP ${r.status}`);
    return r.data || {};
  }
  async getJSON(url){
    const r = await this.fetchJSON(url);
    if(!r.ok) throw (r.data?.error || r.text || `HTTP ${r.status}`);
    if(!r.data) throw '响应不是 JSON';
    return r.data;
  }
  async del(url){
    const r = await this.fetchJSON(url, { method:'DELETE', headers:{ ...this.authHeader() } });
    if(!r.ok) throw (r.data?.error || r.text || `HTTP ${r.status}`);
    return r.data || {};
  }

  bind(){
    const on = (id, fn) => this.$(id).addEventListener('click', fn);

    on('#b-publish', async ()=>{
      try{
        await this.postJSON('/daily-brief/index.json', this.bGet());
        this.msg('✅ 发布成功');
      }catch(e){ this.msg('❌ 发布失败：'+(e?.message||e||'Unknown')); }
    });

    on('#b-reuse', async ()=>{
      this.msg('拉取最新一条…');
      try{
        const arr = await this.getJSON('/daily-brief/index.json?_='+Date.now());
        if(!Array.isArray(arr)||!arr.length) return this.msg('没有历史记录');
        const latest = (arr[0] && typeof arr[0]==='object') ? arr[0].slug : arr[0];
        const d = await this.getJSON(`/daily-brief/${latest}.json?_=${Date.now()}`);
        this.$('#b-slug').value = this.today();
        this.$('#b-title').value = d.title||'';
        this.$('#b-bullets').value = (d.bullets||[]).join('\n');
        this.$('#b-schedule').value= (d.schedule||[]).join('\n');
        this.$('#b-symbol').value  = d.chart?.symbol || d.symbol || '';
        this.$('#b-interval').value= d.chart?.interval || '60';
        this.msg('已载入最近一条，并把日期改为今天');
      }catch(e){ this.msg('拉取失败：'+(e?.message||e)); }
    });

    on('#b-preview', ()=>{
      const slug=(this.$('#b-slug').value||'').trim() || this.today();
      window.open(`/#/daily-brief/${slug}`,'_blank','noopener');
    });

    on('#b-delete', async ()=>{
      const slug=(this.$('#b-slug').value||'').trim() || this.today();
      if(!confirm(`确定删除 Daily Brief: ${slug} ?`)) return;
      try{
        await this.del(`/daily-brief/${slug}.json`);
        this.msg('🗑️ 已删除');
      }catch(e){ this.msg('删除失败：'+(e?.message||e)); }
    });
  }
}
customElements.define('x-admin-page', XAdminPage);
