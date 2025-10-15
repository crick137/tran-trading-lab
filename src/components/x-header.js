class XHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header style="position:sticky;top:0;backdrop-filter:blur(6px);
      background:rgba(15,17,21,.8);padding:14px 20px;border-bottom:1px solid #222;z-index:10">
        <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
          <h2 style="margin:0;color:#6ea8fe;font-weight:700;letter-spacing:.4px">TRAN TRADING LAB</h2>
          <nav class="row">
            <a href="#dashboard">대시보드</a>
            <a href="#about">About</a>
            <a href="#articles">글 모음</a>
          </nav>
        </div>
      </header>
    `;
  }
}
customElements.define('x-header', XHeader);