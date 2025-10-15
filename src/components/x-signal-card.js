const colorBySide = (side) => side === 'BUY' ? '#2ecc71' : '#e74c3c';

class XSignalCard extends HTMLElement {
  set data(v) { this._data = v; this.render(); }
  render() {
    const d = this._data || {};
    this.innerHTML = `
      <div class="card" style="padding:12px;border:1px solid #23283a">
        <div class="row" style="justify-content:space-between">
          <strong>${d.symbol || 'SYMBOL'}</strong>
          <span class="badge" style="border-color:${colorBySide(d.side)};color:${colorBySide(d.side)}">${d.side}</span>
        </div>
        <div class="row mt8" style="gap:16px;color:#cbd2e1">
          <span>TF: <b>${d.tf || 'M15'}</b></span>
          <span>Entry: <b>${d.entry || '-'}</b></span>
          <span>TP: <b>${d.tp || '-'}</b></span>
          <span>SL: <b>${d.sl || '-'}</b></span>
          <span>R:R: <b>${d.rr || '-'}</b></span>
        </div>
        <p class="mt8" style="color:#9aa0aa">${d.logic || ''}</p>
      </div>
    `;
  }
}
customElements.define('x-signal-card', XSignalCard);
