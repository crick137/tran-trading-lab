// 安全加载 TradingView 脚本（只加载一次）
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

export default class XTvChart extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this._containerId = 'tv_' + Math.random().toString(36).slice(2);
    this._themeHandler = () => this.initWidget(true);
  }
  connectedCallback(){
    this.render();
    window.addEventListener('ttl:theme-changed', this._themeHandler);
    this.initWidget();
  }
  disconnectedCallback(){
    window.removeEventListener('ttl:theme-changed', this._themeHandler);
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .wrap{height:420px;border-radius:12px;overflow:hidden}
      </style>
      <div class="wrap"><div id="${this._containerId}" style="height:100%"></div></div>
    `;
  }

  async initWidget(rebuild=false){
    await loadTvScript();

    const symbol   = this.getAttribute('symbol')   || 'OANDA:XAUUSD';
    const interval = this.getAttribute('interval') || '15';
    const isDark = (document.documentElement.dataset.theme || 'light') === 'dark';
    const theme  = isDark ? 'DARK' : 'LIGHT';
    const autosize = this.hasAttribute('autosize');

    // 清空容器（重建时避免重叠）
    const el = this.shadowRoot.getElementById(this._containerId);
    if (!el) return;
    el.innerHTML = '';

    const opts = {
      symbol,
      interval,
      timezone: 'Etc/UTC',
      theme,
      locale: 'en',
      container_id: el,
      withdateranges: true,
      allow_symbol_change: true,
      details: true,
      calendar: true,
      hide_side_toolbar: false
    };
    if (autosize) opts.autosize = true; else { opts.width = '100%'; opts.height = 420; }

    // TradingView 会把容器当 id 或元素都支持，这里传元素最稳
    // eslint-disable-next-line no-new
    new window.TradingView.widget(opts);
  }
}
customElements.define('x-tv-chart', XTvChart);
