// 所有信号均以 1R 为基准。result: 'win' | 'loss' | 'open'
export const signals = [
  { symbol: 'XAUUSD', side: 'SELL', tf: 'M15', entry: '4009.63', tp: '3958.06', sl: '4058.01', rr: 1.8, result: 'win',  date: '2025-10-10', logic: 'FVG 回归 + 上方流动性扫单' },
  { symbol: 'AUDJPY', side: 'BUY',  tf: 'M30', entry: '100.32', tp: '100.94', sl: '99.98',  rr: 2.0, result: 'loss', date: '2025-10-11', logic: 'BOS 之后回测 OB' },
  { symbol: 'EURUSD', side: 'BUY',  tf: 'M15', entry: '1.16550', tp: '1.17041', sl: '1.15920', rr: 1.7, result: 'win',  date: '2025-10-12', logic: '吸收下方区间后结构转换' },
  { symbol: 'BTCUSDT',side: 'BUY',  tf: 'H1',  entry: '65500',  tp: '67000',  sl: '64500',  rr: 1.5, result: 'open',date: '2025-10-13', logic: '等待区间上沿突破' },
  { symbol: 'NAS100', side: 'SELL', tf: 'M15', entry: '18200',  tp: '17950',  sl: '18300',  rr: 2.5, result: 'win',  date: '2025-10-14', logic: '收集上方流动性后的反转' },
];

// 仅筛选出已结算的信号
export const closedSignals = signals.filter(s => s.result === 'win' || s.result === 'loss');
