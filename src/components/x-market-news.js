// ===== src/components/x-market-news.js =====
// Market News (grid cards; top image + bottom text)
// Fix: load with pagination + higher concurrency so it doesn't stop at 3 items.

function esc(s){ return String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

// simple concurrency pool
async function mapLimit(arr, limit, worker){
  const out = new Array(arr.length);
  let i = 0;
  async function run(){
    while(i < arr.length){
      const idx = i++;
      out[idx] = await worker(arr[idx], idx);
    }
  }
  const workers = Array.from({length: Math.min(limit, arr.length)}, run);
  await Promise.all(workers);
  return out;
}

class XMarketNews extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.ids = [];
    this.ptr = 0;                 // 已渲染到的下标
    this.pageSize = 20;           // 每页条数
    this.conc = 8;                // 并发拉取条数
    this.max = 200;               // 最多显示上限（防止一次性超多卡顿）
  }

  async connectedCallback(){
    // 允许用属性覆盖：<x-market-news page-size="40" conc="10" max="300">
    this.pageSize = Number(this.getAttribute('page-size')) || this.pageSize;
    this.conc = Number(this.getAttribute('conc')) || this.conc;
    this.max = Number(this.getAttribute('max')) || this.max;

    this.renderShell();
    try{
      await this.loadIndex();
      await this.renderNext(); // 先渲染一页
    }catch(e){
      this.shadowRoot.querySelector('#mn-grid').innerHTML =
        `<article class="mn-card"><p class="mn-sub">뉴스를 불러오지 못했습니다</p></article>`;
    }
  }

  /* ---------- UI Shell ---------- */
  renderShell(){
    const css = `
      :host{ display:block }
      .mn-wrap{ max-width:1000px; margin:0 auto }
      .toolbar{ display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap }
      .toolbar .meta{ color:#9aa0a6;font-size:12px }
      .mn-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; opacity:0; transition:opacity .28s ease }

      .mn-card{
        display:flex; flex-direction:column;
        background: rgba(15,17,21,0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        padding: 18px;
        transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
        cursor: pointer;
      }
      .mn-card:hover{ transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }

      .mn-media{ border-radius:10px; overflow:hidden; background:#0e1116 }
      .mn-media img{ width:100%; height:220px; object-fit:cover; display:block; transform: scale(1); opacity:.0; transition: transform .3s ease, opacity .3s ease }
      .mn-card:hover .mn-media img{ transform: scale(1.02); }
      .mn-media img.loaded{ opacity: 1 }

      .mn-title{ margin:12px 0 6px; font-weight:700; font-size:17px; color:#e6eaf0; line-height:1.35 }
      .mn-title a{ color:inherit; text-decoration:none }
      .mn-title a:hover{ color:#ffffff }
      .mn-sub{ margin:0; font-size:14px; color:#9aa0a6; letter-spacing:.2px }
      .mn-meta{ margin-top:8px; font-size:12px; color:#6b7280; align-self:flex-end }

      .btn{ padding:6px 10px; border-radius:999px; border:1px solid #2b2f36; color:#cfd6e3; background:#15181e; cursor:pointer }
      .btn:hover{ background:#1a1d24 }
      .search{ padding:6px 8px; border-radius:8px; background:#12151a; border:1px solid #2b2f36; color:#cfd6e3 }
      .more-wrap{ display:flex; justify-content:center; margin-top:12px }
    `;

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <section class="mn-wrap">
        <div class="toolbar">
          <div class="row" style="display:flex;gap:8px;align-items:center">
            <strong>마켓 뉴스</strong>
            <span id="mn-counter" class="meta"></span>
          </div>
          <div class="row" style="display:flex;gap:6px;align-items:center">
            <select id="mn-ps" class="search" aria-label="페이지 크기">
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="40">40</option>
              <option value="80">80</option>
            </select>
            <button id="mn-refresh" class="btn">새로고침</button>
          </div>
        </div>

        <div id="mn-grid" class="mn-grid">
          ${Array.from({length:6}).map(()=>`
            <article class="mn-card" aria-busy="true">
              <div class="mn-media skeleton-box" style="height:220px"></div>
              <h3 class="mn-title"><span class="skeleton-text" style="display:inline-block;width:70%;height:16px;border-radius:6px"></span></h3>
              <p class="mn-sub"><span class="skeleton-text" style="display:inline-block;width:95%;height:12px;border-radius:6px"></span></p>
              <div class="mn-meta"><span class="skeleton-text" style="display:inline-block;width:120px;height:10px;border-radius:6px"></span></div>
            </article>
          `).join('')}
        </div>

        <div id="mn-more-wrap" class="more-wrap">
          <button id="mn-more" class="btn">더 보기</button>
        </div>
      </section>
    `;

    // controls
    this.$grid = this.shadowRoot.querySelector('#mn-grid');
    this.$more = this.shadowRoot.querySelector('#mn-more');
    this.$moreWrap = this.shadowRoot.querySelector('#mn-more-wrap');
    this.$counter = this.shadowRoot.querySelector('#mn-counter');
    this.$ps = this.shadowRoot.querySelector('#mn-ps');

    this.$ps.value = String(this.pageSize);
    this.$ps.onchange = () => { this.pageSize = Number(this.$ps.value) || 20; this.resetAndReload(); };
    this.shadowRoot.querySelector('#mn-refresh').onclick = () => this.resetAndReload();
    this.$more.onclick = () => this.renderNext().catch(()=>{});
  }

  resetAndReload(){
    this.ptr = 0;
    this.$grid.innerHTML = Array.from({length:6}).map(()=>`
      <article class="mn-card" aria-busy="true">
        <div class="mn-media skeleton-box" style="height:220px"></div>
        <h3 class="mn-title"><span class="skeleton-text" style="display:inline-block;width:70%;height:16px;border-radius:6px"></span></h3>
        <p class="mn-sub"><span class="skeleton-text" style="display:inline-block;width:95%;height:12px;border-radius:6px"></span></p>
        <div class="mn-meta"><span class="skeleton-text" style="display:inline-block;width:120px;height:10px;border-radius:6px"></span></div>
      </article>
    `).join('');
    this.loadIndex(true).then(()=>this.renderNext()).catch(()=>{});
  }

  /* ---------- Data ---------- */
  async loadIndex(force=false){
    if (!this.ids.length || force){
      try{
        const res = await fetch('/api/market-news/index.json?_=' + Date.now());
        const rows = await res.json();
        this.ids = (Array.isArray(rows) ? rows : [])
          .map(r => typeof r === 'string' ? r : (r && (r.id || r.slug) ? (r.id || r.slug) : ''))
          .filter(Boolean);
      }catch{
        this.ids = [];
      }
    }
    if (this.ids.length > this.max) this.ids = this.ids.slice(0, this.max);
    this.updateCounter();
  }

  updateCounter(){
    const total = this.ids.length;
    const shown = Math.min(this.ptr, total);
    if (this.$counter) this.$counter.textContent = `${shown}/${total}`;
    if (this.$moreWrap) this.$moreWrap.style.display = (shown >= total || total === 0) ? 'none' : 'flex';
  }

  async renderNext(){
    const total = this.ids.length;
    if (!total){
      this.$grid.innerHTML = `<article class="mn-card"><p class="mn-sub">뉴스가 없습니다</p></article>`;
      this.updateCounter();
      return;
    }
    const end = Math.min(this.ptr + this.pageSize, total);
    const slice = this.ids.slice(this.ptr, end);
    this.ptr = end;

    const items = await mapLimit(slice, this.conc, async (id) => {
      try{
        const r = await fetch(`/api/market-news/${encodeURIComponent(id)}.json?_=${Date.now()}`);
        if (!r.ok) throw 0;
        const d = await r.json();
        const rawImg = d.hero || d.image || d.thumbnail || d.thumb || '';
        const hero = (() => {
          if (!rawImg) return '';
          if (/^https?:\/\//i.test(rawImg)) return rawImg;   // 绝对地址
          if (rawImg.startsWith('/')) return rawImg;         // 站内绝对路径
          // 兼容你早期写法：相对文件名落在 data 目录
          return `/data/market-news/${encodeURIComponent(id)}/${rawImg}`;
        })();
        return {
          id,
          title: d.title || id,
          summary: d.summary || (Array.isArray(d.bullets) ? d.bullets[0] : ''),
          meta: [d.source || '', d.date ? new Date(d.date).toLocaleString() : ''].filter(Boolean).join(' · '),
          hero
        };
      }catch{
        return { id, title: id, summary: '로딩 실패', meta: '', hero: '' };
      }
    });

    const frag = document.createDocumentFragment();
    items.forEach(it => frag.appendChild(this.makeCard(it)));
    // 如果是第一次页渲染，把 skeleton 清空
    if (this.$grid.firstElementChild) this.$grid.innerHTML = '';
    this.$grid.appendChild(frag);
    requestAnimationFrame(() => { this.$grid.style.opacity = '1'; });
    this.updateCounter();
  }

  makeCard(it){
    const href = `#/market-news/${encodeURIComponent(it.id)}`;
    const card = document.createElement('article');
    card.className = 'mn-card';
    card.tabIndex = 0;
    card.addEventListener('click', (e)=>{ if (!e.target.closest('a')) location.hash = href.slice(1); });

    if (it.hero){
      const media = document.createElement('div'); media.className = 'mn-media';
      const img = document.createElement('img'); img.alt = it.title || it.id || '';
      // 懒加载：先挂 data-src，进入视口再赋值
      img.dataset.src = it.hero;
      this.lazyImage(img);
      img.onerror = () => { try{ img.remove(); }catch{} };
      img.onload  = () => img.classList.add('loaded');
      media.appendChild(img);
      card.appendChild(media);
    }

    const h3 = document.createElement('h3'); h3.className = 'mn-title';
    const a = document.createElement('a'); a.href = href; a.textContent = it.title || it.id || '';
    h3.appendChild(a); card.appendChild(h3);

    if (it.summary){
      const p = document.createElement('p'); p.className = 'mn-sub';
      p.textContent = it.summary; card.appendChild(p);
    }
    if (it.meta){
      const meta = document.createElement('div'); meta.className = 'mn-meta';
      meta.textContent = it.meta; card.appendChild(meta);
    }
    return card;
  }

  /* ---------- lazy image ---------- */
  lazyImage(img){
    if ('loading' in HTMLImageElement.prototype){
      // 原生支持 loading=lazy
      img.loading = 'lazy';
      img.src = img.dataset.src;
      return;
    }
    const io = (this._io ||= new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){
          const el = en.target;
          el.src = el.dataset.src;
          this._io.unobserve(el);
        }
      });
    }, { rootMargin: '120px' }));
    io.observe(img);
  }
}

customElements.define('x-market-news', XMarketNews);
