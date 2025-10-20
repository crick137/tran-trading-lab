import './x-signal-card.js';
import { signals } from '../data/signals.js';

class XSignalBoard extends HTMLElement {
  connectedCallback() {
    const latest = [...signals].slice(-5).reverse(); // latest 5
    // Clear and build node list safely
    this.innerHTML = '';
    const wrapper = document.createElement('div'); wrapper.className = 'mt12'; wrapper.style.display = 'grid'; wrapper.style.gap = '12px';
    latest.forEach(item => {
      const card = document.createElement('x-signal-card');
      // set data safely
      card.data = item;
      wrapper.appendChild(card);
    });
    this.appendChild(wrapper);
  }
}
customElements.define('x-signal-board', XSignalBoard);
