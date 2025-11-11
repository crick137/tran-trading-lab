import Parser from 'rss-parser';
import dayjs from 'dayjs';
import { compareTwoStrings } from 'string-similarity';
import { FEEDS } from './sources.js';

const parser = new Parser();
const seen = {};
const KEYWORDS = [
  /CPI|PPI|payroll|FOMC|rate hike|rate cut|ECB|BOJ|연준|금리|물가|通胀|降息|加息/i,
  /merger|acquisition|guidance|downgrade|upgrade|SEC|IPO|회계|규제|处罚|罰金/i,
  /Bitcoin|BTC|WTI|Brent|gold|XAU|달러|환율|유가|KRW|JPY|국채|Treasury/i
];
const SOURCE_WEIGHT = {
  'Federal Reserve (Press)': 30, 'ECB Press': 25, 'US BLS (Economic)': 28,
  'US BEA (Newsroom)': 22, 'US EIA (Today in Energy)': 18, 'Bank of Japan (WhatsNew)': 18,
  'Eurostat (News)': 16, 'UK ONS (News)': 16, 'Reuters Business': 14,
  'Reuters Markets': 14, 'WSJ Markets': 12, 'CoinDesk (Top)': 8
};
const norm = s => s.replace(/\s+/g,' ').replace(/[-–:|]/g,' ').toLowerCase().trim();
function dup(title, link){
  const now=Date.now(), key=norm(title).slice(0,140);
  for(const k of Object.keys(seen)){
    if(now-seen[k]>90*60*1000) delete seen[k];
    if(compareTwoStrings(k,key)>0.86) return true;
  }
  seen[key]=now;
  const lk='link:'+ (link.split('?')[0]||link);
  if(seen[lk] && now-seen[lk]<90*60*1000) return true;
  seen[lk]=now; return false;
}
function score(it){
  let s=0; KEYWORDS.forEach((re,i)=>{ if(re.test(it.title)) s+=16-i; });
  s+=(SOURCE_WEIGHT[it.source]||8);
  if(/\b\d+(\.\d+)?%|\b\d{4,}\b|\b\d{1,2}:\d{2}\b/i.test(it.title)) s+=10;
  const age=Math.min(180,Math.max(0,(Date.now()-(it.isoDate?+new Date(it.isoDate):Date.now()))/60000));
  s+=Math.max(0,20-age/6); return Math.round(s);
}
const sumKo=(t,src)=>`${t.replace(/^\[.*?\]\s*/,'').replace(/\s+/g,' ').trim()}. 출처:${src}`;
async function sendTG(text){
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return;
  const url=`https://api.telegram.org/bot${token}/sendMessage`;
  const body={ chat_id:chatId, text, parse_mode:'HTML', disable_web_page_preview:false };
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok) console.error('TG send failed',await r.text());
}
const fmt=n=>`속보: ${n.summaryKo}<br/>(${dayjs(n.isoDate||Date.now()).format('HH:mm')} KST) 원문: <a href="${n.link}">${n.source}</a>`;
export async function runOnce(){
  const items=[];
  for(const f of FEEDS){
    try{
      const feed=await parser.parseURL(f.url);
      feed.items.slice(0,10).forEach(x=>{
        if(!x.title||!x.link) return;
        items.push({ id:x.guid||x.link, title:x.title, link:x.link, isoDate:x.isoDate, source:f.name });
      });
    }catch{}
  }
  const cand=[];
  for(const it of items){
    if(dup(it.title,it.link)) continue;
    const n={ ...it, score:score(it), summaryKo:sumKo(it.title,it.source), ts:new Date().toISOString() };
    cand.push(n);
  }
  cand.sort((a,b)=>b.score-a.score);
  const top=cand[0];
  if(top && top.score>=60) await sendTG(fmt(top));
  return cand.slice(0,30);
}
