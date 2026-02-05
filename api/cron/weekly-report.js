/**
 * 📊 TRAN 주간 시장 리뷰 (Weekly Report)
 * Vercel Cron: 일요일 20:00 KST (11:00 UTC Sunday)
 * 채널: @TranTradingLabNewsKR
 * 
 * 구조:
 * - 이번 주 요약 (주요 이벤트/자금 흐름)
 * - 핵심 가격 수준
 * - 다음 주 시나리오 (상승/하락/횡보)
 * - 리스크 이벤트 캘린더
 */

import {
    getKSTTimeString,
    sendTelegram,
    getFearGreedData,
    CTA_KR
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabNewsKR';

// ============================================
// Data Fetching
// ============================================

async function fetchWeeklyData(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=7d`;
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const quotes = data.chart.result[0].indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);
            const highs = quotes.high.filter(h => h !== null);
            const lows = quotes.low.filter(l => l !== null);

            if (closes.length >= 2) {
                const weekStart = closes[0];
                const weekEnd = closes[closes.length - 1];
                const weekChange = ((weekEnd - weekStart) / weekStart) * 100;
                const weekHigh = Math.max(...highs);
                const weekLow = Math.min(...lows);

                return {
                    current: weekEnd,
                    change: weekChange,
                    high: weekHigh,
                    low: weekLow
                };
            }
        }
        return null;
    } catch (e) {
        console.error(`Weekly data error for ${symbol}:`, e.message);
        return null;
    }
}

// ============================================
// Message Generation
// ============================================

function getWeekInfo() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const month = kst.getMonth() + 1;
    const weekNum = Math.ceil(kst.getDate() / 7);
    return { month, weekNum };
}

function formatPrice(price, decimals = 0) {
    if (!price) return 'N/A';
    return price.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function generateScenarios(btc) {
    if (!btc) return [];

    const current = btc.current;
    const resistance = Math.ceil(current / 1000) * 1000 + 3000;
    const support = Math.floor(current / 1000) * 1000 - 3000;

    return [
        {
            type: '상승',
            condition: `$${formatPrice(resistance)} 돌파 + 거래량 증가`,
            target: `$${formatPrice(resistance + 5000)} 1차 목표`
        },
        {
            type: '하락',
            condition: `$${formatPrice(support)} 이탈 + 공포지수 25 이하`,
            target: `$${formatPrice(support - 5000)} 지지 테스트`
        },
        {
            type: '횡보',
            condition: `$${formatPrice(support)} - $${formatPrice(resistance)} 레인지 유지`,
            target: `방향성 탐색 지속, 이벤트 대기`
        }
    ];
}

function getNextWeekEvents() {
    const events = [];
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const nextWeekStart = new Date(kstNow.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextDay = nextWeekStart.getDate();

    // Simplified event prediction
    if (nextDay <= 7) {
        events.push('월: ISM 제조업 PMI');
    }
    if (nextDay >= 10 && nextDay <= 15) {
        events.push('수: 🇺🇸 CPI 발표');
    }
    events.push('목: 신규 실업수당 청구');
    events.push('금: BTC ETF 주간 자금 흐름 집계');

    return events.slice(0, 3);
}

async function generateMessage() {
    const { month, weekNum } = getWeekInfo();

    // Fetch market data
    const [btc, eth, usdkrw, kospi, fng] = await Promise.all([
        fetchWeeklyData('BTC-USD'),
        fetchWeeklyData('ETH-USD'),
        fetchWeeklyData('USDKRW=X'),
        fetchWeeklyData('^KS11'),
        getFearGreedData()
    ]);

    let msg = `📊 <b>주간 시장 리뷰</b> | ${month}월 ${weekNum}주차\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    // 이번 주 요약
    msg += `📌 <b>이번 주 요약</b>\n`;

    if (btc) {
        const btcEmoji = btc.change > 0 ? '🔺' : '🔻';
        const trend = btc.change > 3 ? '강세' : btc.change < -3 ? '약세' : '횡보';
        msg += `• BTC ${trend} 주간 (${btcEmoji}${btc.change > 0 ? '+' : ''}${btc.change.toFixed(1)}%)\n`;
    }
    if (eth) {
        const ethEmoji = eth.change > 0 ? '🔺' : '🔻';
        msg += `• ETH: ${ethEmoji}${eth.change > 0 ? '+' : ''}${eth.change.toFixed(1)}%\n`;
    }
    if (fng) {
        const sentimentTrend = fng.change > 5 ? '회복' : fng.change < -5 ? '악화' : '유지';
        msg += `• 시장 심리 ${sentimentTrend} (공포지수 ${fng.value} ${fng.emoji})\n`;
    }
    if (usdkrw) {
        const krwEmoji = usdkrw.change > 0 ? '📈' : '📉';
        msg += `• USD/KRW ${krwEmoji} ${formatPrice(usdkrw.current, 2)}원\n`;
    }

    msg += `\n`;

    // 핵심 가격 수준
    msg += `📍 <b>핵심 수준</b>\n`;
    if (btc) {
        msg += `• BTC 저항: $${formatPrice(btc.high)} / 지지: $${formatPrice(btc.low)}\n`;
    }
    if (eth) {
        msg += `• ETH 저항: $${formatPrice(eth.high)} / 지지: $${formatPrice(eth.low)}\n`;
    }

    msg += `\n`;

    // 다음 주 시나리오
    msg += `🎯 <b>다음 주 시나리오</b>\n`;
    const scenarios = generateScenarios(btc);
    scenarios.forEach((s, i) => {
        const icons = ['1️⃣', '2️⃣', '3️⃣'];
        msg += `${icons[i]} <b>${s.type}:</b> ${s.condition}\n`;
        msg += `   → ${s.target}\n`;
    });

    msg += `\n`;

    // 리스크 이벤트
    msg += `📅 <b>주요 리스크 이벤트</b>\n`;
    const nextEvents = getNextWeekEvents();
    nextEvents.forEach(e => {
        msg += `• ${e}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━\n`;
    msg += `💡 다음 주도 성공적인 트레이딩 되세요!\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_KR;
    msg += `\n\n#주간리뷰 #BTC #ETH #TranTradingLab`;

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
        console.log('📊 Generating weekly report...');

        const message = await generateMessage();
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            console.log('✅ Weekly report sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Weekly report error:', error);
        return res.status(500).json({ error: error.message });
    }
}
