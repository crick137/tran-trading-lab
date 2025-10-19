class XAbout extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card" id="about">
        <h3 class="m0">关于 TRAN</h3>
        <p class="mt12">
          Tran Trading Lab 是一间以 SMC 思维为核心的交易实验室。
          我们聚焦结构、流动性与风险控制，以数据验证每一次改进。
          所有内容与界面遵循极简、高可读性与暗色美学的原则。
        </p>
      </section>
    `;
  }
}
customElements.define('x-about', XAbout);
