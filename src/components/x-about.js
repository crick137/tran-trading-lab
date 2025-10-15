class XAbout extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card" id="about">
        <h3 class="m0">About</h3>
        <p class="mt12">
          Tran Trading Lab은 SMC 기반의 실험적 트레이딩 연구실입니다.
          우리는 구조·유동성·리스크 관리에 집중하며, 데이터로 성과를 검증합니다.
          모든 콘텐츠와 UI는 최소주의(미니멀)·고가독성·다크 테마 원칙을 따릅니다.
        </p>
      </section>
    `;
  }
}
customElements.define('x-about', XAbout);
