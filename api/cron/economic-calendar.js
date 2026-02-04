/**
 * 📅 TRAN 경제 캘린더 (Economic Calendar)
 * Vercel Cron: 매일 07:30 KST (22:30 UTC)
 * 채널: @TranTradingLabKR
 * 
 * 특징:
 * - Top 3 이벤트만 선별
 * - 스코어 기반 정렬 (중요성 + 리스크자산/달러/금리 영향)
 * - 각 이벤트에 방향 힌트 포함
 */

import {
    getKSTDisplayDate,
    getKSTTimeString,
    canSendRegular,
    incrementRegular,
    sendTelegram,
    CTA_KR
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabKR';

// ============================================
// Event Database (Static + Dynamic)
// ============================================

// Base importance: 1=low, 2=medium, 3=high
// affectsRiskAssets: Does it move BTC/stocks?
// affectsUSD: Does it move USD/forex?
// affectsRates: Does it impact rate expectations?
// cryptoRelevant: Directly relevant to crypto?

const EVENT_LIBRARY = {
    // US Events
    'FOMC': {
        nameKR: '🇺🇸 FOMC 금리 결정',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: true,
        hint: '금리 동결/인하 시 위험자산 상승, 인상 시 하락 압력'
    },
    'CPI': {
        nameKR: '🇺🇸 소비자물가지수 (CPI)',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: true,
        hint: '예상 하회 시 금리 인하 기대↑ → 위험자산 상승'
    },
    'NFP': {
        nameKR: '🇺🇸 비농업 고용 (NFP)',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: false,
        hint: '예상 상회 시 달러 강세/금리 인상 우려, 위험자산 약세'
    },
    'GDP': {
        nameKR: '🇺🇸 GDP 성장률',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: false,
        hint: '예상 상회 시 경기 회복 기대, 주식 상승 가능성'
    },
    'PMI': {
        nameKR: '🇺🇸 ISM 제조업 PMI',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: '50 이상 시 경기 확장, 50 미만 시 수축 신호'
    },
    'JOBLESS': {
        nameKR: '🇺🇸 신규 실업수당 청구',
        importance: 1,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: '예상 상회 시 노동시장 약화 신호'
    },

    // Korea Events
    'BOK': {
        nameKR: '🇰🇷 한국은행 기준금리',
        importance: 3,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: true,
        cryptoRelevant: false,
        hint: '금리 동결/인하 시 원화 약세, 주식에는 긍정적'
    },
    'KR_CPI': {
        nameKR: '🇰🇷 소비자물가지수',
        importance: 2,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: true,
        cryptoRelevant: false,
        hint: '인플레이션 둔화 시 금리 인하 기대'
    },
    'KR_TRADE': {
        nameKR: '🇰🇷 무역수지',
        importance: 2,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: '흑자 확대 시 원화 강세 가능성'
    },

    // Crypto Events
    'ETF_FLOW': {
        nameKR: '₿ BTC ETF 자금 유출입',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: true,
        hint: '순유입 지속 시 상승 모멘텀, 이탈 시 조정 압력'
    }
};

// ============================================
// Event Scoring
// ============================================

function calculateEventScore(event) {
    let score = 0;

    // Base importance (1-3 → 10-30 pts)
    score += event.importance * 10;

    // Risk asset impact (+15 if affects BTC/stocks)
    if (event.affectsRiskAssets) score += 15;

    // USD impact (+10)
    if (event.affectsUSD) score += 10;

    // Rate expectations impact (+10)
    if (event.affectsRates) score += 10;

    // Crypto relevance (+5)
    if (event.cryptoRelevant) score += 5;

    return score;
}

// ============================================
// Get Today's Events
// ============================================

function getTodayEvents() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...

    // Calculate with KST
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const kstDay = kstDate.getDate();

    const events = [];

    // Always include ETF flow (daily)
    events.push({
        ...EVENT_LIBRARY['ETF_FLOW'],
        time: '매일 업데이트'
    });

    // First week of month
    if (kstDay <= 7) {
        // First Friday = NFP
        const firstFriday = 1 + ((5 - new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 7) % 7);
        if (kstDay === firstFriday) {
            events.push({
                ...EVENT_LIBRARY['NFP'],
                time: '22:30 KST'
            });
        }

        // First business day = PMI
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && kstDay <= 3) {
            events.push({
                ...EVENT_LIBRARY['PMI'],
                time: '24:00 KST'
            });
        }

        // Korea trade balance (first week)
        if (kstDay <= 3) {
            events.push({
                ...EVENT_LIBRARY['KR_TRADE'],
                time: '09:00 KST'
            });
        }
    }

    // Mid-month CPI (10th-15th)
    if (kstDay >= 10 && kstDay <= 15) {
        events.push({
            ...EVENT_LIBRARY['CPI'],
            time: '22:30 KST'
        });
    }

    // Thursday = Jobless claims
    if (dayOfWeek === 4) {
        events.push({
            ...EVENT_LIBRARY['JOBLESS'],
            time: '22:30 KST'
        });
    }

    // End of month GDP (last week)
    if (kstDay >= 25 && kstDay <= 31) {
        events.push({
            ...EVENT_LIBRARY['GDP'],
            time: '22:30 KST'
        });
    }

    return events;
}

// ============================================
// Message Generation
// ============================================

function generateMessage() {
    const dateStr = getKSTDisplayDate();
    const events = getTodayEvents();

    // Score and sort
    const scoredEvents = events.map(e => ({
        ...e,
        score: calculateEventScore(e)
    }));
    scoredEvents.sort((a, b) => b.score - a.score);

    // Take top 3
    const top3 = scoredEvents.slice(0, 3);

    let msg = `📅 <b>오늘의 경제 이벤트</b> | ${dateStr}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];

    top3.forEach((event, i) => {
        msg += `${emojis[i]} <b>${event.nameKR}</b>`;
        if (event.time) {
            msg += ` (${event.time})`;
        }
        msg += `\n`;
        msg += `   → ${event.hint}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⚠️ 이벤트 전후 변동성 확대 주의\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_KR;
    msg += `\n\n#경제캘린더 #매크로 #TranTradingLab`;

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
        // Rate limit check
        const canSend = await canSendRegular(CHANNEL_ID);
        if (!canSend && !isTest) {
            console.log('Economic calendar: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (regular ≤2/day)'
            });
        }

        console.log('📅 Generating economic calendar...');

        const message = generateMessage();
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            await incrementRegular(CHANNEL_ID);
            console.log('✅ Economic calendar sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Economic calendar error:', error);
        return res.status(500).json({ error: error.message });
    }
}
