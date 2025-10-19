const posts = [
  {
    id: 'bos-intro',
    title: 'BOS / CHoCH 核心指南',
    date: '2025-10-12',
    tags: ['SMC', 'Structure'],
    excerpt: '用最简洁的方式识别结构转换，并据此定义市场方向。'
  },
  {
    id: 'fvg-ob',
    title: 'FVG 与 OB 的协同',
    date: '2025-10-13',
    tags: ['FVG', 'OB'],
    excerpt: '当流动性缺口与供需块对齐时，如何锁定更高胜率的交易区域。'
  },
  {
    id: 'risk-pyramid',
    title: '风险金字塔的设计方法',
    date: '2025-10-14',
    tags: ['Risk', 'R:R'],
    excerpt: '2% 规则、分批止盈、情绪隔离——一份可直接执行的检查清单。'
  }
];

class XArticles extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card" id="articles">
        <h3 class="m0">文章精选</h3>
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
