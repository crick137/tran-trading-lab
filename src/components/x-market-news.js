// ===== /src/components/x-market-news.js =====
// Market News list — left image, right text; dark glass cards

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
      .mn-grid{ display:grid; grid-template-columns: 1fr; gap:20px; opacity:0; transition:opacity .28s ease }
      @media (min-width:1024px){ .mn-grid{ grid-template-columns: 1fr 1fr; } }

      .mn-card{
        display:grid; grid-template-columns: 220px 1fr; gap:16px; align-items: stretch;
        background: rgba(15,17,21,0.85);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        padding: 14px;
        cursor: pointer;
        transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
      }
      .mn-card:hover{ transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.5); background: rgba(18,20,24,0.92); }

      .mn-media{ position:relative; border-radius:12px; overflow:hidden; background:#0e1116 }
      .mn-media img{ width:100%; height:100%; object-fit:cover; display:block; transform: scale(1.01); opacity:.0; transition: transform .35s ease, opacity .35s ease }
      .mn-card:hover .mn-media img{ transform: scale(1.02); }
      .mn-media img.loaded{ opacity: 1 }

      .mn-body{ display:flex; flex-direction:column; gap:8px; min-width:0 }
      .mn-title{ margin:0; font-weight:800; font-size:1.18rem; color:#e5e7eb; letter-spacing:.2px; line-height:1.3 }
      .mn-title a{ color:inherit; text-decoration:none }
      .mn-title a:hover{ color:#ffffff }
      .mn-sub{ margin:2px 0 0; color:#9aa0a6; letter-spacing:.2px; line-height:1.5 }
      .mn-meta{ color:#6b7280; font-size:12px }
      .mn-tags{ display:flex; gap:6px; flex-wrap:wrap; margin-top:6px }
      .mn-pill{ padding:3px 8px; font-size:12px; border-radius:999px; color:#cfd6e3; background: linear-gradient(180deg,#1a1f28,#12151a); border:1px solid #ffffff22 }

      @media (max-width:768px){
        .mn-card{ grid-template-columns: 1fr; }
        .mn-media{ height: 200px; }
      }
    `;
    this.innerHTML = '';
    this.appendChild(style);
    const grid = document.createElement('div');
    grid.className = 'mn-grid';
    // skeletons
    grid.innerHTML = Array.from({length:6}).map(()=>`
      <article class="mn-card" aria-busy="true">
        <div class="mn-media skeleton-box" style="height:140px"></div>
        <div class="mn-body">
          <h3 class="mn-title"><span class="skeleton-text" style="display:inline-block;width:70%;height:16px;border-radius:6px"></span></h3>
          <p class="mn-sub"><span class="skeleton-text" style="display:inline-block;width:95%;height:12px;border-radius:6px"></span></p>
        </div>
      </article>
    `).join('');
    this.appendChild(grid);
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
        const tags = Array.isArray(d.tags) ? d.tags.slice(0, 4) : [];
        return { id, title, summary, date, source, hero, tags };
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

      // media
      const media = document.createElement('div'); media.className = 'mn-media';
      const img = document.createElement('img'); img.alt = it.title || it.id || '';
      if (it.hero) img.src = it.hero; else img.src = '/logo.png';
      img.onerror = () => { img.onerror = null; img.src = '/logo.png'; img.classList.add('loaded'); };
      img.onload = () => img.classList.add('loaded');
      media.appendChild(img);

      // body
      const body = document.createElement('div'); body.className = 'mn-body';
      const h3 = document.createElement('h3'); h3.className = 'mn-title';
      const a = document.createElement('a'); a.href = href; a.textContent = it.title || it.id || ''; h3.appendChild(a);
      body.appendChild(h3);

      if (it.summary){
        const p = document.createElement('p'); p.className = 'mn-sub'; p.textContent = it.summary; body.appendChild(p);
      }

      const meta = document.createElement('div'); meta.className = 'mn-meta';
      meta.textContent = [it.source, it.date].filter(Boolean).join(' · ');
      if (meta.textContent) body.appendChild(meta);

      if (it.tags && it.tags.length){
        const tags = document.createElement('div'); tags.className = 'mn-tags';
        for (const t of it.tags){ const s = document.createElement('span'); s.className = 'mn-pill'; s.textContent = `#${t}`; tags.appendChild(s); }
        body.appendChild(tags);
      }

      card.appendChild(media);
      card.appendChild(body);
      frag.appendChild(card);
    }
    grid.appendChild(frag);
    requestAnimationFrame(()=>{ grid.style.opacity = '1'; });
  }
}

customElements.define('x-market-news', XMarketNews);

