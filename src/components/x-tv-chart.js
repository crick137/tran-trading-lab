// --- lazy load tv.js（只加载一次）
let tvLoading = null;
function loadTvScript () {
  if (window.TradingView) return Promise.resolve();
  if (tvLoading) return tvLoading;
  tvLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/tv.js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return tvLoading;
}

class XTvChart extends HTMLElement {
  static get observedAttributes() { return ['symbol','interval']; }

  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this._cid = 'tv_' + Math.random().toString(36).slice(2);
    this._onTheme = () => this._init(true);
  }
  connectedCallback() {
    this._render();
    window.addEventListener('ttl:theme-changed', this._onTheme);

    // 监听容器尺寸，动态重建
    this._ro = new ResizeObserver(() => this._init(true));
    this._ro.observe(this);

    this._init();
  }
  disconnectedCallback() {
    window.removeEventListener('ttl:theme-changed', this._onTheme);
    this._ro && this._ro.disconnect();
  }
  attributeChangedCallback() { this._init(true); }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .wrap{
          height:480px;
          border-radius:12px; overflow:hidden;
          background: var(--bg-card);
          border:1px solid var(--border-color);
        }
        @media (max-width: 768px){
          .wrap{ height:58vh; } /* 手机更高些 */
        }
      </style>
      <div class="wrap"><div id="${this._cid}" style="height:100%"></div></div>
    `;
  }

  async _init(rebuild=false){
    await loadTvScript();
    const el = this.shadowRoot.getElementById(this._cid);
    if (!el) return;
    el.innerHTML = ''; // 防重叠

    const symbol   = this.getAttribute('symbol')   || 'OANDA:XAUUSD';
    const interval = this.getAttribute('interval') || '15';
    const isDark   = (document.documentElement.dataset.theme || 'light') === 'dark';

    const opts = {
      symbol,
      interval,
      timezone: 'Etc/UTC',
      theme: isDark ? 'DARK' : 'LIGHT',
      locale: 'en',
      container_id: el,
      withdateranges: true,
      allow_symbol_change: true,
      details: true, calendar: true,
      hide_side_toolbar: false,
      autosize: true
    };
    // eslint-disable-next-line no-new
    new window.TradingView.widget(opts);
  }

  // 外部可调用
  setSymbol(sym){ this.setAttribute('symbol', sym); }
  setInterval(iv){ this.setAttribute('interval', iv); }
}
customElements.define('x-tv-chart', XTvChart);
export default XTvChart;
