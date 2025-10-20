const tips = [
  '손절은 비용이 아니라 보험료다. 작은 손실이 큰 손실을 막는다.',
  '구조(BOS/CHoCH)를 먼저 보고, 진입 신호는 나중에 본다.',
  'R:R를 설계한 뒤에야 확률을 논할 수 있다.',
  '세션(아시아/런던/뉴욕)마다 유동성 패턴이 다르다.',
  '연속 손실 뒤엔 휴식, 감정이 만든 R:R는 언제나 나쁘다.'
];

class XKnowledge extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '';
    const section = document.createElement('section'); section.className='card';
    const h3 = document.createElement('h3'); h3.className = 'm0'; h3.textContent = '지식 보드';
    section.appendChild(h3);
    const ul = document.createElement('ul'); ul.className='mt12'; ul.style.margin=0; ul.style.paddingLeft='18px'; ul.style.lineHeight='1.8';
    for(const t of tips){ const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }
    section.appendChild(ul);
    this.appendChild(section);
  }
}
customElements.define('x-knowledge', XKnowledge);
