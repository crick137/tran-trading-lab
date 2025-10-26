const posts = [
  { id: 'bos-intro',    title: 'BOS/CHoCH 핵심 가이드',   date: '2025-10-12', tags: ['SMC','Structure'],  excerpt: '구조 전환으로 방향성을 정의하는 가장 단순하고 강력한 방법.' },
  { id: 'fvg-ob',       title: 'FVG와 OB의 상호작용',     date: '2025-10-13', tags: ['FVG','OB'],         excerpt: '유동성 공백과 수요·공급 블록이 맞물릴 때 찾는 고확률 구역.' },
  { id: 'risk-pyramid', title: '리스크 피라미드 설계법',   date: '2025-10-14', tags: ['Risk','R:R'],       excerpt: '2% 규칙, 부분 청산, 감정 방패 — 실전에 바로 쓰는 체크리스트.' },
  // { id:'...', title:'...', date:'...', tags:[...], excerpt:'...', thumb:'/images/xxx.jpg' }
];

class XArticles extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'card';
    section.id = 'articles';

    const style = document.createElement('style');
    style.textContent = `
      #articles .list { display: grid; gap: 12px; }
      #articles .item { display: flex; gap: 12px; align-items: flex-start; padding: 14px; }
      #articles .thumb { width: 120px; height: 80px; object-fit: cover; border-radius: 10px; flex-shrink: 0; background:#111; }
      #articles .body  { flex: 1; min-width: 0; }
      #articles .top   { display: flex; justify-content: space-between; gap: 8px; }
      #articles .title { font-weight: 700; }
      #articles .date  { white-space: nowrap; }
      #articles .excerpt { margin-top: 8px; color: #9aa0aa; }
      #articles .tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
      @media (max-width: 640px){
        #articles .item { flex-direction: column; }
        #articles .thumb { width: 100%; height: 160px; }
      }
    `;
    section.appendChild(style);

    const h3 = document.createElement('h3');
    h3.className = 'm0';
    h3.textContent = '글 모음';
    section.appendChild(h3);

    const list = document.createElement('div');
    list.className = 'list mt12';

    for (const p of posts) {
      const art = document.createElement('article');
      art.className = 'card item';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = p.title;
      img.src = p.thumb || `/images/articles/${p.id}.jpg`;
      art.appendChild(img);

      const body = document.createElement('div');
      body.className = 'body';

      const top = document.createElement('div');
      top.className = 'top';

      const strong = document.createElement('strong');
      strong.className = 'title';
      strong.textContent = p.title;

      const date = document.createElement('span');
      date.className = 'badge date';
      date.textContent = p.date;

      top.appendChild(strong);
      top.appendChild(date);
      body.appendChild(top);

      const ex = document.createElement('p');
      ex.className = 'excerpt';
      ex.textContent = p.excerpt;
      body.appendChild(ex);

      const tags = document.createElement('div');
      tags.className = 'tags';
      for (const t of p.tags) {
        const tb = document.createElement('span');
        tb.className = 'badge';
        tb.textContent = `#${t}`;
        tags.appendChild(tb);
      }
      body.appendChild(tags);

      art.appendChild(body);
      list.appendChild(art);
    }

    section.appendChild(list);
    this.appendChild(section);
  }
}
customElements.define('x-articles', XArticles);
