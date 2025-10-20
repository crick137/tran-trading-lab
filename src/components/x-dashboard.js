class XDashboard extends HTMLElement {
  connectedCallback() {
    // Build DOM-based dashboard to avoid string templates and innerHTML
    this.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
      .grid{ display:grid; grid-template-columns: 1.35fr .9fr; gap:16px; }
      @media (max-width: 1024px){ .grid{ grid-template-columns: 1fr; } }
      .card{ background: var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:16px; }
      .row{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      .right{ justify-content:flex-end }
      .sel, .btn{ padding:8px 10px; border-radius:8px; border:1px solid var(--border-color); background: color-mix(in oklab, var(--bg-card), black 5%); color: var(--text-secondary); }
      .btn{ cursor:pointer }
      .m0{ margin:0 }
      .badge{ background:var(--muted); padding:4px 8px; border-radius:10px; font-size:12px }
    `;
    this.appendChild(style);

    const container = document.createElement('section');
    container.className = 'container';
    container.id = 'dashboard';

    // Top controls
    const topRow = document.createElement('div'); topRow.className = 'row right'; topRow.style.margin = '6px 0 10px';
    const selSym = document.createElement('select'); selSym.id = 'sym'; selSym.className = 'sel';
    [['OANDA:XAUUSD','XAUUSD'],['OANDA:NAS100USD','NAS100'],['BINANCE:BTCUSDT','BTCUSDT'],['OANDA:EURUSD','EURUSD']].forEach(([v,label])=>{
      const o = document.createElement('option'); o.value = v; o.textContent = label; selSym.appendChild(o);
    });
    const selTf = document.createElement('select'); selTf.id = 'tf'; selTf.className = 'sel';
    [['15','M15'],['30','M30'],['60','H1'],['240','H4']].forEach(([v,label])=>{ const o = document.createElement('option'); o.value = v; o.textContent = label; selTf.appendChild(o); });
    const btnApply = document.createElement('button'); btnApply.id = 'apply'; btnApply.className = 'btn'; btnApply.type = 'button'; btnApply.textContent = '应用';
    topRow.appendChild(selSym); topRow.appendChild(selTf); topRow.appendChild(btnApply);
    container.appendChild(topRow);

    // Main grid
    const grid = document.createElement('div'); grid.className = 'grid';

    const chartSection = document.createElement('section'); chartSection.className = 'card';
    const h3Chart = document.createElement('h3'); h3Chart.className = 'm0'; h3Chart.textContent = 'Chart'; chartSection.appendChild(h3Chart);
    const tv = document.createElement('x-tv-chart'); tv.id = 'tv'; tv.setAttribute('symbol','OANDA:XAUUSD'); tv.setAttribute('interval','15'); tv.setAttribute('autosize',''); chartSection.appendChild(tv);
    grid.appendChild(chartSection);

    const sigSection = document.createElement('section'); sigSection.className = 'card';
    const sigRow = document.createElement('div'); sigRow.className = 'row'; sigRow.style.justifyContent = 'space-between';
    const h3Sig = document.createElement('h3'); h3Sig.className = 'm0'; h3Sig.textContent = 'Signals';
    const dateBadge = document.createElement('span'); dateBadge.className = 'badge'; dateBadge.textContent = new Date().toLocaleString();
    sigRow.appendChild(h3Sig); sigRow.appendChild(dateBadge); sigSection.appendChild(sigRow);
    const signalBoard = document.createElement('x-signal-board'); sigSection.appendChild(signalBoard); grid.appendChild(sigSection);

    container.appendChild(grid);

    // Lower areas
    const lowerGrid = document.createElement('div'); lowerGrid.className = 'grid'; lowerGrid.style.marginTop = '16px';
    const metrics = document.createElement('x-metrics'); metrics.className = 'card'; lowerGrid.appendChild(metrics);
    const knowledge = document.createElement('x-knowledge'); knowledge.className = 'card'; lowerGrid.appendChild(knowledge);
    container.appendChild(lowerGrid);

    const aboutCard = document.createElement('div'); aboutCard.className = 'card'; aboutCard.style.marginTop = '16px'; aboutCard.appendChild(document.createElement('x-about')); container.appendChild(aboutCard);
    const articlesCard = document.createElement('div'); articlesCard.className = 'card'; articlesCard.style.marginTop = '16px'; articlesCard.appendChild(document.createElement('x-articles')); container.appendChild(articlesCard);

    this.appendChild(container);

    // Wire up actions
    btnApply.addEventListener('click', ()=>{
      const s = selSym.value;
      const t = selTf.value;
      if(tv && typeof tv.setSymbol === 'function') tv.setSymbol(s);
      else tv.setAttribute('symbol', s);
      if(tv && typeof tv.setInterval === 'function') tv.setInterval(t);
      else tv.setAttribute('interval', t);
      if(signalBoard && typeof signalBoard.refresh === 'function') signalBoard.refresh({symbol:s, timeframe:t});
    });
  }
}
customElements.define('x-dashboard', XDashboard);
