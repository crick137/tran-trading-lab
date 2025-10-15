// 모든 신호는 1R 기준. result: 'win' | 'loss' | 'open'
export const signals = [
  { symbol: 'XAUUSD', side: 'SELL', tf: 'M15', entry: '4009.63', tp: '3958.06', sl: '4058.01', rr: 1.8, result: 'win',  date: '2025-10-10', logic: 'FVG 회귀 + 상단 유동성 스윕' },
  { symbol: 'AUDJPY', side: 'BUY',  tf: 'M30', entry: '100.32', tp: '100.94', sl: '99.98',  rr: 2.0, result: 'loss', date: '2025-10-11', logic: 'BOS 후 OB 리테스트' },
  { symbol: 'EURUSD', side: 'BUY',  tf: 'M15', entry: '1.16550', tp: '1.17041', sl: '1.15920', rr: 1.7, result: 'win',  date: '2025-10-12', logic: '하단 박스 흡수 후 구조 전환' },
  { symbol: 'BTCUSDT',side: 'BUY',  tf: 'H1',  entry: '65500',  tp: '67000',  sl: '64500',  rr: 1.5, result: 'open',date: '2025-10-13', logic: '레인지 상단 돌파 대기' },
  { symbol: 'NAS100', side: 'SELL', tf: 'M15', entry: '18200',  tp: '17950',  sl: '18300',  rr: 2.5, result: 'win',  date: '2025-10-14', logic: '상단 유동성 수집 후 반전' },
];

// 결과가 있는 항목만 추출
export const closedSignals = signals.filter(s => s.result === 'win' || s.result === 'loss');
