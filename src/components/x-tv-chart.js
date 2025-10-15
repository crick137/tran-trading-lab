const TV_SRC = 'https://s3.tradingview.com/tv.js';

function loadTvScript() {
  return new Promise((resolve, reject) => {
    if (window.TradingView) return resolve();
    const s = document.createElement('script');
    s.src = TV_SRC; s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

class XTvChart extends HTMLElement {
  static get observedAttributes() { return ['symbol','interval','theme','autosize']; }
  constructor() { super(); this._containerId = `tv_${Math.random().toString(36).slice(2)}`; }
  connectedCallback() { this.render(); this.initWidget(); }
  attributeChangedCallback() { /* 可扩展：属性变化时重建图表 */ }

  render() {
    this.style.display = 'block';
    this.style.minHeight = '460px';
    this.innerHTML = `
      <div class="row mt0" style="justify-content:flex-end;gap:6px">
        <button class="badge" data-sym="OANDA:XAUUSD">XAUUSD</button>
        <button class="badge" data-sym="OANDA:NAS100USD">NAS100</button>
        <button class="badge" data-sym="BINANCE:BTCUSDT">BTCUSD</button>
        <button class="badge" data-int="5">5m</button>
        <button class="badge" data-int="15">15m</button>
        <button class="badge" data-int="60">1h</button>
      </div>
      <div id="${this._containerId}" style="height:420px;margin-top:8px"></div>
    `;
  }

  async initWidget() {
    await loadTvScript();
    const symbol = this.getAttribute('symbol') || 'OANDA:XAUUSD';
    const interval = this.getAttribute('interval') || '15';
    const theme = (this.getAttribute('theme') || 'dark').toUpperCase();
    const autosize = this.hasAttribute('autosize');

    const opts = {
      symbol, interval, timezone: 'Etc/UTC',
      theme, locale: 'en', style: '1', toolbar_bg: '#0f1115',
      container_id: this._containerId, hide_side_toolbar: false,
      withdateranges: true, allow_symbol_change: true, details: true, calendar: true,
    };
    if (autosize) opts.autosize = true; else opts.width = '100%', opts.height = 420;

    // 清理旧实例（如果有）
    this._container && (this._container.innerHTML = '');

    // eslint-disable-next-line no-new
    new window.TradingView.widget(opts);

    // 快捷按钮
    this.addEventListener('click', (e) => {
      const t = e.target;
      if (t.matches('[data-sym]')) {
        this.setAttribute('symbol', t.dataset.sym);
        this.initWidget();
      } else if (t.matches('[data-int]')) {
        this.setAttribute('interval', t.dataset.int);
        this.initWidget();
      }
    });
  }
}
customElements.define('x-tv-chart', XTvChart);
