// ===== /src/components/x-market-news.js =====
// Market News — top image, bottom text; dark glass cards
// Notes: uses only hero returned by API (no logo fallbacks)

class XMarketNews extends HTMLElement {
  async connectedCallback(){
    this.renderShell();
    try{
      const ids = await this.fetchIndex();
      const items = await this.fetchDetails(ids);
      this.renderList(items);
    }catch(e){
      this.innerHTML = `<div class="card"><p class="muted">뉴스를 불러오지 못했습니다</p></div>`;
    }
  }

  renderShell(){
    const style = document.createElement('style');
    style.textContent = `
      :host{ display:block }
      .mn-wrap{ max-width:1000px; margin:0 auto }
      .mn-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; opacity:0; transition:opacity .28s ease }

      .mn-card{
        display:flex; flex-direction:column;
        background: rgba(15,17,21,0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        padding: 18px;
        cursor: pointer;
        transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
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
    `;
    this.innerHTML = '';
    this.appendChild(style);
    const wrap = document.createElement('div'); wrap.className = 'mn-wrap';
    const grid = document.createElement('div'); grid.className = 'mn-grid';
    grid.innerHTML = Array.from({length:6}).map(()=>`
      <article class="mn-card" aria-busy="true">
        <div class="mn-media skeleton-box" style="height:220px"></div>
        <h3 class="mn-title"><span class="skeleton-text" style="display:inline-block;width:70%;height:16px;border-radius:6px"></span></h3>
        <p class="mn-sub"><span class="skeleton-text" style="display:inline-block;width:95%;height:12px;border-radius:6px"></span></p>
        <div class="mn-meta"><span class="skeleton-text" style="display:inline-block;width:120px;height:10px;border-radius:6px"></span></div>
      </article>
    `).join('');
    wrap.appendChild(grid);
    this.appendChild(wrap);
  }

  async fetchIndex(){
    const res = await fetch('/api/market-news/index.json?_=' + Date.now());
    if (!res.ok) throw new Error('INDEX_NOT_FOUND');
    const rows = await res.json();
    return (Array.isArray(rows) ? rows : [])
      .map(r => typeof r === 'string' ? r : (r && (r.id || r.slug) ? (r.id || r.slug) : ''))
      .filter(Boolean).slice(0, 60);
  }

  async fetchDetails(ids){
    return (await Promise.all(ids.map(async id => {
      try{
        const r = await fetch(`/api/market-news/${encodeURIComponent(id)}.json?_=${Date.now()}`);
        if (!r.ok) return null;
        const d = await r.json();
        const raw = d.hero || d.image || d.thumbnail || d.thumb || '';
        const hero = /^https?:\/\//i.test(raw) ? raw : (raw ? `/data/market-news/${id}/${raw}` : '');
        const title = d.title || id;
        const summary = d.summary || (Array.isArray(d.bullets) ? d.bullets[0] : '');
        const date = d.date ? new Date(d.date).toLocaleString() : '';
        const source = d.source || '';
        return { id, title, summary, date, source, hero };
      }catch{ return null; }
    }))).filter(Boolean);
  }

  renderList(items){
    const grid = this.querySelector('.mn-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const it of items){
      const href = `#/market-news/${encodeURIComponent(it.id)}`;
      const card = document.createElement('article'); card.className = 'mn-card'; card.setAttribute('tabindex','0');
      card.addEventListener('click', (e)=>{ if (!e.target.closest('a')) location.hash = href.slice(1); });

      if (it.hero){
        const media = document.createElement('div'); media.className = 'mn-media';
        const img = document.createElement('img'); img.alt = it.title || it.id || '';
        img.src = it.hero;
        img.onerror = () => { try{ img.remove(); }catch{} };
        img.onload  = () => img.classList.add('loaded');
        media.appendChild(img);
        card.appendChild(media);
      }

      const h3 = document.createElement('h3'); h3.className = 'mn-title';
      const a = document.createElement('a'); a.href = href; a.textContent = it.title || it.id || ''; h3.appendChild(a);
      card.appendChild(h3);

      if (it.summary){ const p = document.createElement('p'); p.className = 'mn-sub'; p.textContent = it.summary; card.appendChild(p); }

      const meta = document.createElement('div'); meta.className = 'mn-meta';
      meta.textContent = [it.source, it.date].filter(Boolean).join(' · ');
      if (meta.textContent) card.appendChild(meta);

      frag.appendChild(card);
    }
    grid.appendChild(frag);
    requestAnimationFrame(()=>{ grid.style.opacity = '1'; });
  }
}

customElements.define('x-market-news', XMarketNews);

