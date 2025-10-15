class XDashboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .grid{ display:grid; grid-template-columns: 1.35fr .9fr; gap:16px; }
        @media (max-width: 1024px){ .grid{ grid-template-columns: 1fr; } }
        .card{ background: var(--bg-card); border:1px solid var(--border-color);
               border-radius:12px; padding:16px; }
        .row{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .right{ justify-content:flex-end }
        .sel, .btn{ padding:8px 10px; border-radius:8px; border:1px solid var(--border-color);
                    background: color-mix(in oklab, var(--bg-card), black 5%); color: var(--text-secondary); }
        .btn{ cursor:pointer }
      </style>

      <section class="container" id="dashboard">
        <div class="row right" style="margin:6px 0 10px">
          <select id="sym" class="sel">
            <option value="OANDA:XAUUSD">XAUUSD</option>
            <option value="OANDA:NAS100USD">NAS100</option>
            <option value="BINANCE:BTCUSDT">BTCUSDT</option>
            <option value="OANDA:EURUSD">EURUSD</option>
          </select>
          <select id="tf" class="sel">
            <option value="15">M15</option>
            <option value="30">M30</option>
            <option value="60">H1</option>
            <option value="240">H4</option>
          </select>
          <button id="apply" class="btn">적용</button>
        </div>

        <div class="grid">
          <section class="card">
            <h3 class="m0">차트</h3>
            <x-tv-chart id="tv" symbol="OANDA:XAUUSD" interval="15" autosize></x-tv-chart>
          </section>

          <section class="card">
            <div class="row" style="justify-content:space-between">
              <h3 class="m0">시그널</h3>
              <span class="badge">${new Date().toLocaleString('ko-KR')}</span>
            </div>
            <x-signal-board></x-signal-board>
          </section>
        </div>

        <div class="grid" style="margin-top:16px">
          <x-metrics class="card"></x-metrics>
          <x-knowledge class="card"></x-knowledge>
        </div>

        <div class="card" style="margin-top:16px"><x-about></x-about></div>
        <div class="card" style="margin-top:16px"><x-articles></x-articles></div>
      </section>
    `;

    // 绑定切换
    const tv = this.querySelector('#tv');
    this.querySelector('#apply').onclick = () => {
      const s = this.querySelector('#sym').value;
      const t = this.querySelector('#tf').value;
      tv.setSymbol(s);
      tv.setInterval(t);
    };
  }
}
customElements.define('x-dashboard', XDashboard);
