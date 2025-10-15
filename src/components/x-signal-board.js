import './x-signal-card.js';
import { signals } from '../data/signals.js';

class XSignalBoard extends HTMLElement {
  connectedCallback() {
    const latest = [...signals].slice(-5).reverse(); // 최신 5개
    this.innerHTML = `
      <div class="mt12" style="display:grid; gap:12px">
        ${latest.map(() => `<x-signal-card></x-signal-card>`).join('')}
      </div>
    `;
    this.querySelectorAll('x-signal-card').forEach((el, i) => el.data = latest[i]);
  }
}
customElements.define('x-signal-board', XSignalBoard);
