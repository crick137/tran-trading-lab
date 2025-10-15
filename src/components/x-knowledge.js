const tips = [
  '손절은 비용이 아니라 보험료다. 작은 손실이 큰 손실을 막는다.',
  '구조(BOS/CHoCH)를 먼저 보고, 진입 신호는 나중에 본다.',
  'R:R를 설계한 뒤에야 “확률”을 고민할 수 있다.',
  '세션(아시아/런던/뉴욕)마다 유동성 패턴이 다르다.',
  '연속 손실 뒤엔 휴식. 감정의 R:R는 언제나 나쁘다.'
];

class XKnowledge extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h3 class="m0">지식 보드</h3>
        <ul class="mt12" style="margin:0;padding-left:18px;line-height:1.8">
          ${tips.map(t=>`<li>${t}</li>`).join('')}
        </ul>
      </section>
    `;
  }
}
customElements.define('x-knowledge', XKnowledge);
