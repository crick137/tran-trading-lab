const K1 = 'ttl_daily_brief_v1';

export function loadBrief() {
  try { return JSON.parse(localStorage.getItem(K1) || '{}'); }
  catch { return {}; }
}
export function saveBrief(obj) {
  localStorage.setItem(K1, JSON.stringify(obj || {}));
}

/* 生成今日日期 YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().slice(0,10);
