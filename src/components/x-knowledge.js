const tips = [
  '止损不是成本，而是保险费；小亏能挡住更大的亏损。',
  '先读结构（BOS / CHoCH），入场信号永远排在后面。',
  '先规划 R:R，再来讨论胜率和分配。',
  '亚洲、伦敦、纽市的流动性节奏完全不同，策略要跟着切换。',
  '连续亏损后先休息，情绪驱动的 R:R 永远糟糕。'
];

class XKnowledge extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h3 class="m0">知识提示板</h3>
        <ul class="mt12" style="margin:0;padding-left:18px;line-height:1.8">
          ${tips.map(t=>`<li>${t}</li>`).join('')}
        </ul>
      </section>
    `;
  }
}
customElements.define('x-knowledge', XKnowledge);
