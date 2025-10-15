class AppShell extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <x-header></x-header>
      <main style="max-width:1100px;margin:40px auto;padding:0 20px;">
        <x-dashboard></x-dashboard>
      </main>
    `;
  }
}
customElements.define('app-shell', AppShell);
