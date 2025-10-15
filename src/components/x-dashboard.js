class XDashboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="container" id="dashboard">
        <div class="row mt0">
          <h2 class="m0">대시보드</h2>
          <span class="badge">한국어 전용</span>
          <span class="badge">Web Components</span>
        </div>

        <div class="grid mt16">
          <section class="card">
            <h3 class="m0">차트</h3>
            <p class="mt8" style="color:var(--muted);margin-bottom:12px">
              우측 상단 버튼으로 종목/주기를 전환하세요.
            </p>
            <x-tv-chart symbol="OANDA:XAUUSD" interval="15" theme="dark" autosize="true"></x-tv-chart>
          </section>

          <section class="card">
            <div class="row" style="justify-content:space-between">
              <h3 class="m0">시그널</h3>
              <span class="badge">${new Date().toLocaleString('ko-KR')}</span>
            </div>
            <x-signal-board></x-signal-board>
          </section>
        </div>

        <div class="grid mt16">
          <x-metrics></x-metrics>
          <x-knowledge></x-knowledge>
        </div>

        <div class="mt16"><x-about></x-about></div>
        <div class="mt16"><x-articles></x-articles></div>
      </section>
    `;
  }
}
customElements.define('x-dashboard', XDashboard);