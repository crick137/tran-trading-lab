const KEY = 'ttl_signals_v1';

export function loadSignalsLS() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
export function saveSignalsLS(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/** 生成简单ID */
function uid() { return Math.random().toString(36).slice(2, 9); }

/** 新建或更新 */
export function upsertSignal(item) {
  const list = loadSignalsLS();
  if (!item.id) item.id = uid();
  const i = list.findIndex(s => s.id === item.id);
  if (i >= 0) list[i] = item; else list.unshift(item);
  saveSignalsLS(list); 
  return item.id;
}

/** 删除 */
export function removeSignal(id) {
  saveSignalsLS(loadSignalsLS().filter(s => s.id !== id));
}

/** 导入/导出 */
export function exportJSON() {
  const blob = new Blob([JSON.stringify(loadSignalsLS(), null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `signals-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { 
      const arr = JSON.parse(r.result || '[]'); 
      saveSignalsLS(Array.isArray(arr)?arr:[]);
      resolve(); 
    };
    r.onerror = reject; 
    r.readAsText(file);
  });
}

/** 派生：已平仓信号 */
export function loadClosedLS() {
  return loadSignalsLS().filter(s => s.result === 'win' || s.result === 'loss');
}
