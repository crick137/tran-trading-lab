const posts = [
  { id: 'bos-intro',    title: 'BOS/CHoCH 핵심 가이드',   date: '2025-10-12', tags: ['SMC','Structure'],  excerpt: '구조 전환으로 방향성을 정의하는 가장 단순하고 강력한 방법.' },
  { id: 'fvg-ob',       title: 'FVG와 OB의 상호작용',     date: '2025-10-13', tags: ['FVG','OB'],         excerpt: '유동성 공백과 수요·공급 블록이 맞물릴 때 찾는 고확률 구역.' },
  { id: 'risk-pyramid', title: '리스크 피라미드 설계법',   date: '2025-10-14', tags: ['Risk','R:R'],       excerpt: '2% 규칙, 부분 청산, 감정 방패 — 실전에 바로 쓰는 체크리스트.' },
];

class XArticles extends HTMLElement {
  connectedCallback() {
    // build DOM safely
    this.innerHTML = '';
    const section = document.createElement('section'); section.className='card'; section.id='articles';
    const h3 = document.createElement('h3'); h3.className='m0'; h3.textContent='글 모음';
    section.appendChild(h3);
    const container = document.createElement('div'); container.className='mt12'; container.style.display='grid'; container.style.gap='12px';
    for(const p of posts){
      const art = document.createElement('article'); art.className='card'; art.style.padding='14px';
      const row = document.createElement('div'); row.className='row'; row.style.justifyContent='space-between';
      const strong = document.createElement('strong'); strong.textContent = p.title;
      const span = document.createElement('span'); span.className='badge'; span.textContent = p.date;
      row.appendChild(strong); row.appendChild(span);
      art.appendChild(row);
      const pEl = document.createElement('p'); pEl.className='mt8'; pEl.style.color='#9aa0aa'; pEl.textContent = p.excerpt;
      art.appendChild(pEl);
      const tagRow = document.createElement('div'); tagRow.className='row mt8';
      for(const t of p.tags){ const tb = document.createElement('span'); tb.className='badge'; tb.textContent = `#${t}`; tagRow.appendChild(tb); }
      art.appendChild(tagRow);
      container.appendChild(art);
    }
    section.appendChild(container);
    this.appendChild(section);
  }
}
customElements.define('x-articles', XArticles);
