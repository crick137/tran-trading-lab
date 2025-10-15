// …原有代码保留…
class XTvChart extends HTMLElement {
  // …构造 & render 保留…
  connectedCallback() {
    this.render();
    this._onTheme = () => this.initWidget();   // 主题变化时重建
    window.addEventListener('ttl:theme-changed', this._onTheme);
    this.initWidget();
  }
  disconnectedCallback() {
    window.removeEventListener('ttl:theme-changed', this._onTheme);
  }

  async initWidget() {
    await loadTvScript();
    const symbol = this.getAttribute('symbol') || 'OANDA:XAUUSD';
    const interval = this.getAttribute('interval') || '15';
    const isDark = (document.documentElement.dataset.theme || 'light') === 'dark';
    const theme = isDark ? 'DARK' : 'LIGHT';
    const autosize = this.hasAttribute('autosize');

    const opts = {
      symbol, interval, timezone: 'Etc/UTC',
      theme, locale: 'en', style: '1', toolbar_bg: isDark ? '#0f1115' : '#f7f8fa',
      container_id: this._containerId, hide_side_toolbar: false,
      withdateranges: true, allow_symbol_change: true, details: true, calendar: true,
    };
    if (autosize) opts.autosize = true; else opts.width = '100%', opts.height = 420;

    this._container && (this._container.innerHTML = '');
    new window.TradingView.widget(opts);
  }
}
customElements.define('x-tv-chart', XTvChart);
