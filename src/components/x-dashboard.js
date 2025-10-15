class XDashboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="container">
        <div class="row mt0">
          <h2 class="m0">Tran Trading Lab</h2>
          <span class="badge">Web Components</span>
          <span class="badge">Vite</span>
        </div>

        <div class="grid mt16">
          <!-- 左侧：交易图表 -->
          <section class="card">
            <h3 class="m0">Chart</h3>
            <p class="mt8" style="color:var(--muted);margin-bottom:12px">
              可点击右上角切换品种/周期（示例：XAUUSD, NAS100, BTCUSD）。
            </p>
            <x-tv-chart symbol="OANDA:XAUUSD" interval="15" theme="dark" autosize="true"></x-tv-chart>
          </section>

          <!-- 右侧：信号看板 -->
          <section class="card">
            <div class="row" style="justify-content:space-between">
              <h3 class="m0">Signals</h3>
              <span class="badge" id="sigDate"></span>
            </div>
            <x-signal-board></x-signal-board>
          </section>
        </div>
      </section>
    `;
    this.querySelector('#sigDate').textContent = new Date().toLocaleString();
  }
}
customElements.define('x-dashboard', XDashboard);
