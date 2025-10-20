const colorBySide = (side) => side === 'BUY' ? '#2ecc71' : '#e74c3c';

class XSignalCard extends HTMLElement {
  set data(v) { this._data = v; this.render(); }
  render() {
    const d = this._data || {};
    // build DOM safely
    this.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '12px';
    card.style.border = '1px solid #23283a';

    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.style.justifyContent = 'space-between';

    const strong = document.createElement('strong');
    strong.textContent = d.symbol || 'SYMBOL';
    row1.appendChild(strong);

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.borderColor = colorBySide(d.side);
    badge.style.color = colorBySide(d.side);
    badge.textContent = d.side || '';
    row1.appendChild(badge);

    card.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row mt8';
    row2.style.gap = '16px';
    row2.style.color = '#cbd2e1';

    const makeSpan = (label, val) => {
      const s = document.createElement('span');
      s.innerHTML = `${label}: <b>${val}</b>`; // small safe fragment where val is plain text
      return s;
    };

    row2.appendChild(makeSpan('TF', d.tf || 'M15'));
    row2.appendChild(makeSpan('Entry', d.entry || '-'));
    row2.appendChild(makeSpan('TP', d.tp || '-'));
    row2.appendChild(makeSpan('SL', d.sl || '-'));
    row2.appendChild(makeSpan('R:R', d.rr || '-'));

    card.appendChild(row2);

    const p = document.createElement('p');
    p.className = 'mt8';
    p.style.color = '#9aa0aa';
    p.textContent = d.logic || '';
    card.appendChild(p);

    this.appendChild(card);
  }
}
customElements.define('x-signal-card', XSignalCard);
