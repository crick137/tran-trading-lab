import './x-dashboard.js';
import './x-admin-page.js';

class AppShell extends HTMLElement {
  connectedCallback() {
    this.render();
    addEventListener('hashchange', () => this.render());
  }
  render() {
    const route = (location.hash || '#dashboard').replace('#', '');
    const isAdmin = route.startsWith('admin');
    this.innerHTML = `
      <x-header></x-header>
      <main style="max-width:1200px;margin:40px auto;padding:0 20px;">
        ${isAdmin ? '<x-admin-page></x-admin-page>' : '<x-dashboard></x-dashboard>'}
      </main>
      <footer style="max-width:1200px;margin:40px auto 80px;padding:0 20px;color:var(--muted)">
        © ${new Date().getFullYear()} TRAN TRADING LAB
      </footer>
    `;
  }
}
customElements.define('app-shell', AppShell);
