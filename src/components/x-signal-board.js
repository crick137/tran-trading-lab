import './x-signal-card.js';

const demoSignals = [
  {
    symbol: 'XAUUSD', side: 'SELL', tf: 'M15',
    entry: '4009.63', tp: '3958.06', sl: '4058.01', rr: '1.8',
    logic: 'FVG 回补 + 结构压制 + 流动性扫上影'
  },
  {
    symbol: 'AUDJPY', side: 'BUY', tf: 'M30',
    entry: '100.32', tp: '100.94', sl: '99.98', rr: '2.0',
    logic: 'BOS 后回踩 OB，有成交量放大'
  },
  {
    symbol: 'EURUSD', side: 'BUY', tf: 'M15',
    entry: '1.16550', tp: '1.17041', sl: '1.15920', rr: '1.7',
    logic: '区间下沿吸筹 + 内部结构转多'
  }
];

class XSignalBoard extends HTMLElement {
  connectedCallback() {
    this.render(demoSignals);
  }
  render(list) {
    this.innerHTML = `
      <div class="mt12" style="display:grid; gap:12px">
        ${list.map(() => `<x-signal-card></x-signal-card>`).join('')}
      </div>
    `;
    this.querySelectorAll('x-signal-card').forEach((el, i) => el.data = list[i]);
  }
}
customElements.define('x-signal-board', XSignalBoard);
