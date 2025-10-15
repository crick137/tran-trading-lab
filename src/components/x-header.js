class XHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header style="position:sticky;top:0;backdrop-filter:blur(6px);
      background:rgba(15,17,21,.8);padding:14px 20px;border-bottom:1px solid #222;">
        <h2 style="margin:0;color:#6ea8fe;font-weight:600">TRAN TRADING LAB</h2>
      </header>
    `;
  }
}
customElements.define('x-header', XHeader);
