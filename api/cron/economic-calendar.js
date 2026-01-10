// Vercel Cron - 경제 캘린더 알림
// api/cron/economic-calendar.js
// 每周重要经济事件提醒

export const config = {
    runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@http4477';

// 重要经济事件数据库 (静态定义常见事件)
const RECURRING_EVENTS = {
    // 美国
    'US_NFP': { name: '🇺🇸 비농업 고용 (NFP)', day: 'first_friday', impact: 'high' },
    'US_CPI': { name: '🇺🇸 소비자물가지수 (CPI)', day: 'mid_month', impact: 'high' },
    'US_FOMC': { name: '🇺🇸 FOMC 금리 결정', day: 'variable', impact: 'high' },
    'US_GDP': { name: '🇺🇸 GDP 성장률', day: 'end_month', impact: 'high' },
    'US_PMI': { name: '🇺🇸 ISM 제조업 PMI', day: 'first_business', impact: 'medium' },

    // 韩国
    'KR_RATE': { name: '🇰🇷 한국은행 기준금리', day: 'variable', impact: 'high' },
    'KR_CPI': { name: '🇰🇷 소비자물가지수', day: 'first_week', impact: 'medium' },
    'KR_TRADE': { name: '🇰🇷 무역수지', day: 'first_week', impact: 'medium' },

    // 加密货币
    'CRYPTO_HALVING': { name: '₿ 비트코인 반감기', day: 'special', impact: 'high' },
    'CRYPTO_ETF': { name: '₿ ETF 자금 유출입', day: 'daily', impact: 'medium' },
};

// 获取本周重要事件
async function getWeeklyEvents() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const events = [];

    // 模拟本周事件 (实际应从API获取)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek + 1);

    // 根据日期判断可能的事件
    const dayOfMonth = today.getDate();

    // 月初事件
    if (dayOfMonth <= 7) {
        events.push({ day: '월', event: '🇺🇸 ISM 제조업 PMI', impact: '⭐⭐' });
        events.push({ day: '월', event: '🇰🇷 무역수지 발표', impact: '⭐⭐' });
    }

    // 月中事件
    if (dayOfMonth >= 10 && dayOfMonth <= 15) {
        events.push({ day: '수', event: '🇺🇸 CPI 발표', impact: '⭐⭐⭐' });
    }

    // 每月第一个周五
    const firstFriday = new Date(weekStart);
    firstFriday.setDate(firstFriday.getDate() + (5 - firstFriday.getDay() + 7) % 7);
    if (firstFriday.getDate() <= 7) {
        events.push({ day: '금', event: '🇺🇸 비농업 고용 (NFP)', impact: '⭐⭐⭐' });
    }

    // 固定添加每周事件
    events.push({ day: '매일', event: '₿ 비트코인 ETF 자금 흐름', impact: '⭐⭐' });
    events.push({ day: '목', event: '🇺🇸 신규 실업수당 청구', impact: '⭐' });

    return events;
}

async function generateCalendarReport() {
    const events = await getWeeklyEvents();
    const today = new Date();
    const weekNum = Math.ceil((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7);

    let report = `📅 이번 주 경제 캘린더\n`;
    report += `${today.getMonth() + 1}월 ${weekNum}주차\n`;
    report += `${'='.repeat(30)}\n\n`;

    // 按重要性排序
    events.sort((a, b) => b.impact.length - a.impact.length);

    for (const event of events) {
        report += `${event.impact} ${event.day}: ${event.event}\n`;
    }

    report += `\n${'='.repeat(30)}\n`;
    report += `💡 중요 이벤트 전후 변동성 주의\n`;
    report += `📱 @trantradinglab_bot\n\n`;
    report += `#경제캘린더 #트레이딩 #외환 #주식`;

    return report;
}

async function sendTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    return resp.json();
}

export default async function handler(request) {
    try {
        const report = await generateCalendarReport();
        const result = await sendTelegram(report);

        return new Response(JSON.stringify({
            success: true,
            telegram: result,
            report,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
        });
    }
}
