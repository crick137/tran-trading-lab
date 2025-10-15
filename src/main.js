import '../styles/global.css'
import './components/x-tv-chart.js'

const routes = {
  '': 'home',
  '#/daily-brief': 'daily-brief',
  '#/trade-journal': 'trade-journal',
  '#/knowledge-lab': 'knowledge-lab',
  '#/market-news': 'market-news',
  '#/articles': 'articles',
  '#/about': 'about',
};

function setActive(){
  document.querySelectorAll('.nav a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')===location.hash);
  });
}

function show(routeId){
  document.querySelectorAll('section[data-route]').forEach(s=>{
    s.classList.toggle('hidden', s.dataset.route!==routeId);
  });
  setActive();
}

window.addEventListener('hashchange',()=> {
  const routeId = routes[location.hash] || 'home';
  show(routeId);
});

document.addEventListener('DOMContentLoaded', ()=>{
  const routeId = routes[location.hash] || 'home';
  show(routeId);

  // Daily Brief 示例数据
  const feed = document.getElementById('brief-feed');
  if (feed) {
    const data=[
      {title:'📌 거시 요약', items:['달러지수 보합','유럽 CPI 2.3%','원자재 혼조']},
      {title:'🕒 오늘 일정', items:['20:30 미국 CPI 예비','22:00 파월 발언']}
    ];
    feed.innerHTML=data.map(b=>`<h3>${b.title}</h3><ul>`+b.items.map(i=>`<li>${i}</li>`).join('')+`</ul>`).join('');
  }

  // Trade Journal：本地存取
  const form = document.getElementById('journal');
  if (form){
    const key='ttl_journal_v1';
    const listEl=document.getElementById('journal-list');
    const list=JSON.parse(localStorage.getItem(key)||'[]');
    const render=()=>{ listEl.innerHTML=list.map(r=>`<div class="card" style="margin:12px 0"><b>${r.symbol}</b> · ${r.side} · entry ${r.entry} / sl ${r.sl||'-'} / tp ${r.tp||'-'}<br><small>${r.time}</small><p>${r.notes||''}</p></div>`).join(''); };
    render();
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const f=new FormData(form);
      list.unshift({symbol:f.get('symbol'),side:f.get('side'),entry:f.get('entry'),
        sl:f.get('sl'),tp:f.get('tp'),notes:f.get('notes'),time:new Date().toLocaleString()});
      localStorage.setItem(key,JSON.stringify(list));
      form.reset(); render();
    });
  }

  // Market News 假数据
  const newsEl = document.getElementById('news');
  if (newsEl){
    const news=[{t:'US CPI beats at 3.0%', s:'DXY 弹升，黄金回落，纳指承压'},{t:'BoE holds rate', s:'英镑震荡，金边债上行'}];
    newsEl.innerHTML=news.map(n=>`<article class="card"><b>${n.t}</b><p class="muted">${n.s}</p></article>`).join('');
  }
});
