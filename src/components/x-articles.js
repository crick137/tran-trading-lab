const posts = [
  { id: 'bos-intro',    title: 'BOS/CHoCH 핵심 가이드',   date: '2025-10-12', tags: ['SMC','Structure'],  excerpt: '구조 전환을 통해 방향성을 정의하는 가장 단순하고 강력한 방법.' },
  { id: 'fvg-ob',       title: 'FVG와 OB의 상호작용',     date: '2025-10-13', tags: ['FVG','OB'],         excerpt: '유동성 공백과 수요·공급 블록이 맞물릴 때 생기는 고확률 구역.' },
  { id: 'risk-pyramid', title: '리스크 피라미드 설계법',   date: '2025-10-14', tags: ['Risk','R:R'],       excerpt: '2% 규칙, 부분청산, 감정 방패 — 실전에서 바로 쓰는 체크리스트.' },
];

class XArticles extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card" id="articles">
        <h3 class="m0">글 모음</h3>
        <div class="mt12" style="display:grid;gap:12px">
          ${posts.map(p => `
            <article class="card" style="padding:14px">
              <div class="row" style="justify-content:space-between">
                <strong>${p.title}</strong>
                <span class="badge">${p.date}</span>
              </div>
              <p class="mt8" style="color:#9aa0aa">${p.excerpt}</p>
              <div class="row mt8">${p.tags.map(t=>`<span class="badge">#${t}</span>`).join(' ')}</div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }
}
customElements.define('x-articles', XArticles);
