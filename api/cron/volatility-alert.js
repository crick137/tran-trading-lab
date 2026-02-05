/**
 * ⚡ TRAN 급등/급락 알림 (Volatility Alert)
 * Vercel Cron: 매시간 실행 (0 * * * * UTC)
 * 채널: @TranTradingLabNewsKR
 * 
 * 트리거 조건:
 * - 1시간 변동 ≥ 2.5% (L1)
 * - 4시간 변동 ≥ 4.0% (L2)
 * 
 * 제한:
 * - 일일 최대 2회 (volatility 타입)
 * - 트리거 총합 4회 (whale + volatility)
 * - 2시간 중복 방지 (coin:timeframe:direction:level)
 */

import {
    getKSTDisplayDate,
    getKSTTimeString,
    canSendTrigger,
    incrementTrigger,
    isDuplicate,
    markSent,
    getVolatilityDedupKey,
    selectHighestPriorityAlert,
    sendTelegram,
    CTA_KR
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabNewsKR';

// Coins to monitor
const COINS = [
    { symbol: 'BTC-USD', name: 'BTC', nameKR: '비트코인' },
    { symbol: 'ETH-USD', name: 'ETH', nameKR: '이더리움' },
    { symbol: 'SOL-USD', name: 'SOL', nameKR: '솔라나' },
    { symbol: 'XRP-USD', name: 'XRP', nameKR: '리플' }
];

// Thresholds
const THRESHOLDS = {
    '1h': 2.5,  // L1
    '4h': 4.0   // L2
};

// ============================================
// Data Fetching
// ============================================

async function fetchPriceData(symbol, interval, range) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const quotes = data.chart.result[0].indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);

            if (closes.length >= 2) {
                const current = closes[closes.length - 1];
                const compare = closes[0]; // Start of range
                const change = ((current - compare) / compare) * 100;
                return { price: current, change };
            }
        }
        return null;
    } catch (e) {
        console.error(`Price fetch error for ${symbol}:`, e.message);
        return null;
    }
}

async function checkVolatility() {
    const alerts = [];

    for (const coin of COINS) {
        // Check 1H
        const data1h = await fetchPriceData(coin.symbol, '5m', '1h');
        if (data1h && Math.abs(data1h.change) >= THRESHOLDS['1h']) {
            alerts.push({
                coin: coin.name,
                coinKR: coin.nameKR,
                price: data1h.price,
                change: data1h.change,
                timeframe: '1h',
                level: Math.abs(data1h.change) >= THRESHOLDS['4h'] ? 'L2' : 'L1'
            });
        }

        // Check 4H
        const data4h = await fetchPriceData(coin.symbol, '15m', '4h');
        if (data4h && Math.abs(data4h.change) >= THRESHOLDS['4h']) {
            alerts.push({
                coin: coin.name,
                coinKR: coin.nameKR,
                price: data4h.price,
                change: data4h.change,
                timeframe: '4h',
                level: 'L2'
            });
        }
    }

    return alerts;
}

// ============================================
// Message Generation
// ============================================

function getActionSuggestion(change, timeframe) {
    const direction = change > 0 ? 'up' : 'down';
    const magnitude = Math.abs(change);

    if (direction === 'up') {
        if (magnitude >= 5) {
            return '⚠️ 급등 구간 — 추격 매수 자제, 되돌림 대기 후 분할 진입 고려';
        }
        return '💡 상승 모멘텀 — FOMO 주의, 기존 포지션 일부 익절 고려';
    } else {
        if (magnitude >= 5) {
            return '⚠️ 급락 구간 — 패닉 매도 자제, 지지선 확인 후 분할 매수 고려';
        }
        return '💡 하락 압력 — 손절라인 확인, 레버리지 축소 권장';
    }
}

function getPossibleReasons(change, coin) {
    const direction = change > 0 ? 'up' : 'down';
    const reasons = [];

    if (direction === 'up') {
        reasons.push('• 숏 포지션 청산 연쇄 반응 (추정)');
        reasons.push('• 주요 저항선 돌파 시도');
        if (coin === 'BTC') {
            reasons.push('• ETF 자금 유입 가능성');
        }
    } else {
        reasons.push('• 롱 포지션 청산 연쇄 반응 (추정)');
        reasons.push('• 주요 지지선 하향 이탈');
        reasons.push('• 대량 매도 물량 출현 가능성');
    }

    return reasons.slice(0, 2).join('\n');
}

function generateMessage(alert) {
    const { coin, coinKR, price, change, timeframe } = alert;
    const dateStr = getKSTDisplayDate();
    const direction = change > 0 ? '급등' : '급락';
    const emoji = change > 0 ? '🚀' : '📉';
    const changeStr = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    const timeframeStr = timeframe === '1h' ? '1시간' : '4시간';

    let msg = `${emoji} <b>${direction} 알림</b> | ${coin}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    msg += `📊 <b>${timeframeStr}:</b> ${changeStr}\n`;
    msg += `💵 <b>현재가:</b> $${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n\n`;

    msg += `📌 <b>가능한 원인:</b>\n`;
    msg += getPossibleReasons(change, coin);
    msg += `\n\n`;

    msg += getActionSuggestion(change, timeframe);
    msg += `\n\n`;

    msg += `<i>※ 본 알림은 정보 제공용이며, 투자 조언이 아닙니다.</i>\n\n`;

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_KR;
    msg += `\n\n#${direction}알림 #${coin} #TranTradingLab`;

    return msg;
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    const isTest = req.url?.includes('test=true');

    if (!isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('⚡ Checking for volatility...');

        // Check rate limit first
        const canSend = await canSendTrigger(CHANNEL_ID, 'volatility');
        if (!canSend && !isTest) {
            console.log('Volatility alert: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (trigger ≤4/day or volatility ≤2/day)'
            });
        }

        // Check for volatility
        const allAlerts = await checkVolatility();

        if (allAlerts.length === 0) {
            console.log('No volatility detected');
            return res.status(200).json({
                success: true,
                alertsSent: 0,
                message: 'No volatility detected'
            });
        }

        // Group alerts by coin and select highest priority for each
        const coinGroups = {};
        for (const alert of allAlerts) {
            if (!coinGroups[alert.coin]) {
                coinGroups[alert.coin] = [];
            }
            coinGroups[alert.coin].push(alert);
        }

        let alertsSent = 0;

        for (const coin of Object.keys(coinGroups)) {
            // Select highest priority alert for this coin
            const bestAlert = selectHighestPriorityAlert(coinGroups[coin]);
            if (!bestAlert) continue;

            // Check dedup
            const dedupKey = getVolatilityDedupKey(
                bestAlert.coin,
                bestAlert.timeframe,
                bestAlert.change
            );

            const isDup = await isDuplicate(dedupKey);
            if (isDup) {
                console.log(`Skipping duplicate: ${dedupKey}`);
                continue;
            }

            // Re-check rate limit before sending (in case another alert just sent)
            const stillCanSend = await canSendTrigger(CHANNEL_ID, 'volatility');
            if (!stillCanSend && !isTest) {
                console.log('Rate limit reached during processing');
                break;
            }

            // Generate and send message
            const message = generateMessage(bestAlert);
            const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

            if (result.ok) {
                await Promise.all([
                    incrementTrigger(CHANNEL_ID, 'volatility'),
                    markSent(dedupKey)
                ]);
                alertsSent++;
                console.log(`✅ Sent volatility alert for ${bestAlert.coin}`);
            }
        }

        return res.status(200).json({
            success: true,
            alertsSent,
            totalDetected: allAlerts.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Volatility alert error:', error);
        return res.status(500).json({ error: error.message });
    }
}
