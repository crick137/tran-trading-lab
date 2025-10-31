// ===== /public/components/x-articles.js =====
// 动态文章列表组件（自动从 /api/research/articles/index.json 拉取最新文章）

class XArticles extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '<p class="muted">正在加载文章列表...</p>';
    try {
      const listRes = await fetch(`/api/research/articles/index.json?_=${Date.now()}`, { cache: 'no-store' });
      if (!listRes.ok) throw new Error('无法加载文章索引');
      const list = await listRes.json();

      if (!Array.isArray(list) || list.length === 0) {
        this.innerHTML = '<p class="muted">暂无已发布文章。</p>';
        return;
      }

      const section = document.createElement('section');
      section.className = 'card';
      section.id = 'articles';

      const style = document.createElement('style');
      style.textContent = `
        #articles .list { display: grid; gap: 12px; }
        #articles .item { display: flex; gap: 12px; align-items: flex-start; padding: 14px; border:1px solid #2a2f36; border-radius:12px; }
        #articles .thumb { width: 120px; height: 80px; object-fit: cover; border-radius: 10px; flex-shrink: 0; background:#111; }
        #articles .body  { flex: 1; min-width: 0; }
        #articles .top   { display: flex; justify-content: space-between; gap: 8px; }
        #articles .title { font-weight: 700; font-size: 15px; }
        #articles .date  { white-space: nowrap; color:#9aa0aa; font-size:13px; }
        #articles .excerpt { margin-top: 6px; color: #9aa0aa; font-size: 13px; line-height:1.5; }
        #articles .tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        #articles .badge { background:#1e2530; border-radius:6px; padding:2px 6px; font-size:12px; color:#9aa0aa; }
        #articles .item:hover { background:#171a1f; transition:.2s; }
        @media (max-width: 640px){
          #articles .item { flex-direction: column; }
          #articles .thumb { width: 100%; height: 160px; }
        }
      `;
      section.appendChild(style);

      const h3 = document.createElement('h3');
      h3.className = 'm0';
      h3.textContent = '📚 연구 아티클 모음';
      section.appendChild(h3);

      const listEl = document.createElement('div');
      listEl.className = 'list mt12';

      for (const slug of list) {
        try {
          const res = await fetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, { cache: 'no-store' });
          if (!res.ok) continue;
          const art = await res.json();
          const item = document.createElement('article');
          item.className = 'item card';
          item.addEventListener('click', ()=> window.location.hash = `#/articles/${slug}`);

          const img = document.createElement('img');
          img.className = 'thumb';
          img.alt = art.title || slug;
          img.src = art.hero || '/logo.png';
          item.appendChild(img);

          const body = document.createElement('div');
          body.className = 'body';

          const top = document.createElement('div');
          top.className = 'top';
          const strong = document.createElement('strong');
          strong.className = 'title';
          strong.textContent = art.title || slug;
          const date = document.createElement('span');
          date.className = 'badge date';
          date.textContent = (art.date||'').slice(0,10);
          top.appendChild(strong); top.appendChild(date);
          body.appendChild(top);

          if (art.excerpt) {
            const ex = document.createElement('p');
            ex.className = 'excerpt';
            ex.textContent = art.excerpt;
            body.appendChild(ex);
          }

          if (Array.isArray(art.tags) && art.tags.length) {
            const tags = document.createElement('div');
            tags.className = 'tags';
            for (const t of art.tags) {
              const tb = document.createElement('span');
              tb.className = 'badge';
              tb.textContent = `#${t}`;
              tags.appendChild(tb);
            }
            body.appendChild(tags);
          }

          item.appendChild(body);
          listEl.appendChild(item);
        } catch (e) { console.warn('文章加载失败', e); }
      }

      section.appendChild(listEl);
      this.innerHTML = '';
      this.appendChild(section);
    } catch (e) {
      this.innerHTML = `<p class="muted">加载文章失败: ${e.message}</p>`;
    }
  }
}

customElements.define('x-articles', XArticles);
