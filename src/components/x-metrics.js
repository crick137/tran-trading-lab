import { closedSignals } from '../data/signals.js';

function calcMetrics(list) {
  const n = list.length || 0;
  const wins = list.filter(s => s.result === 'win').length;
  const losses = list.filter(s => s.result === 'loss').length;

  const avgR = n
    ? (list.reduce((sum, s) => sum + (s.result === 'win' ? s.rr : -1), 0) / n).toFixed(2)
    : '0.00';

  const winRate = n ? Math.round((wins / n) * 100) : 0;

  // 기대값(Expectancy) = p(win)*AvgWinR - p(loss)*AvgLossR
  const avgWinR  = wins   ? (list.filter(s=>s.result==='win').reduce((a,b)=>a+b.rr,0)/wins)   : 0;
  const avgLossR = losses ? 1 : 0; // 손절은 항상 -1R 가정
  const pWin = n ? wins/n : 0, pLoss = 1 - pWin;
  const expectancy = (pWin*avgWinR - pLoss*avgLossR).toFixed(2);

  // 간단 Equity Curve로 MDD
  let equity = 0, peak = 0, mdd = 0;
  list.forEach(s => {
    equity += (s.result === 'win' ? s.rr : -1);
    peak = Math.max(peak, equity);
    mdd  = Math.min(mdd, equity - peak);
  });

  return { n, wins, losses, winRate, avgR, expectancy, mdd: mdd.toFixed(2) };
}

class XMetrics extends HTMLElement {
  connectedCallback() {
    const m = calcMetrics(closedSignals);
    // build DOM safely
    this.innerHTML = '';
    const section = document.createElement('section'); section.className='card';
    const h3 = document.createElement('h3'); h3.className='m0'; h3.textContent='성과 통계';
    section.appendChild(h3);
    const p = document.createElement('p'); p.className='mt8'; p.style.color='#9aa0aa'; p.textContent = '닫힌 포지션 기준 (1R 고정)';
    section.appendChild(p);

    const grid = document.createElement('div'); grid.className='grid mt12'; grid.style.gridTemplateColumns = 'repeat(4,1fr)'; grid.style.gap='12px';
    grid.appendChild(this.box('승률', m.winRate + '%'));
    grid.appendChild(this.box('평균 R', m.avgR));
    grid.appendChild(this.box('기대값(Expectancy)', m.expectancy));
    grid.appendChild(this.box('최대 낙폭(MDD)', m.mdd + ' R'));
    section.appendChild(grid);

    const footer = document.createElement('p'); footer.className='mt12'; footer.style.color='#9aa0aa'; footer.textContent = `표본: ${m.n}개 | 승: ${m.wins} / 패: ${m.losses}`;
    section.appendChild(footer);
    this.appendChild(section);
  }

  box(label, value) {
    const box = document.createElement('div'); box.className='card'; box.style.padding='12px'; box.style.textAlign='center';
    const labelEl = document.createElement('div'); labelEl.style.fontSize='13px'; labelEl.style.color='#9aa0aa'; labelEl.textContent = label;
    const valueEl = document.createElement('div'); valueEl.style.fontSize='22px'; valueEl.style.fontWeight='700'; valueEl.style.marginTop='4px'; valueEl.textContent = value;
    box.appendChild(labelEl); box.appendChild(valueEl);
    return box;
  }
}
customElements.define('x-metrics', XMetrics);
