/**
 * 📅 TRAN 경제 일정 알림
 * Vercel Cron: 매일 07:30 (KST) 실행
 * 채널: @http4477
 * 
 * 오늘의 주요 경제 이벤트를 알립니다 (모든 금융 시장 대상)
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'

// 중요도 이모지
const IMPORTANCE_EMOJI = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
}

// 국가 플래그
const COUNTRY_FLAGS = {
    'US': '🇺🇸',
    'EU': '🇪🇺',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'KR': '🇰🇷',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'AU': '🇦🇺',
    'CA': '🇨🇦',
    'CH': '🇨🇭',
    'NZ': '🇳🇿'
}

async function fetchEconomicCalendar() {
    try {
        const FMP_API_KEY = process.env.FMP_API_KEY

        if (!FMP_API_KEY) {
            console.log('FMP API key not set, using fallback')
            return getFallbackEvents()
        }

        // 获取今天和明天的日期
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const fromDate = today.toISOString().split('T')[0]
        const toDate = tomorrow.toISOString().split('T')[0]

        // FMP Economic Calendar API
        const res = await fetch(
            `https://financialmodelingprep.com/api/v3/economic_calendar?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`
        )
        const data = await res.json()

        if (Array.isArray(data) && data.length > 0) {
            // 过滤重要事件
            return data
                .filter(e => e.impact === 'High' || e.impact === 'Medium')
                .slice(0, 10) // 限制最多10个事件
                .map(e => ({
                    time: e.date ? new Date(e.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : 'TBD',
                    country: e.country || 'US',
                    event: e.event,
                    impact: e.impact?.toLowerCase() || 'medium',
                    actual: e.actual,
                    estimate: e.estimate,
                    previous: e.previous
                }))
        }

        return getFallbackEvents()
    } catch (e) {
        console.error('Error fetching FMP calendar:', e.message)
        return getFallbackEvents()
    }
}

// 备用：基于规则的事件 (API失败时使用)
function getFallbackEvents() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const dateOfMonth = today.getDate()
    const events = []

    // NFP: 每月第一个周五
    if (dayOfWeek === 5 && dateOfMonth <= 7) {
        events.push({ time: '21:30 (KST)', country: 'US', event: '비농업 고용지수 (NFP)', impact: 'high' })
        events.push({ time: '21:30 (KST)', country: 'US', event: '실업률', impact: 'high' })
    }

    // 每周四: 初请失业金
    if (dayOfWeek === 4) {
        events.push({ time: '21:30 (KST)', country: 'US', event: '신규 실업수당 청구건수', impact: 'medium' })
    }

    // 周一: 亚洲市场开盘
    if (dayOfWeek === 1) {
        events.push({ time: '09:00 (KST)', country: 'KR', event: 'KOSPI 주간 개장', impact: 'low' })
        events.push({ time: '09:00 (KST)', country: 'JP', event: '닛케이 주간 개장', impact: 'low' })
    }

    return events
}



function formatMessage(events) {
    const today = new Date()
    const dateStr = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    let message = `📅 TRAN 경제 일정\n`
    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `📆 ${dateStr}\n\n`

    if (events.length === 0) {
        message += `✨ 오늘은 주요 경제 이벤트가 없습니다.\n`
        message += `평온한 시장을 예상합니다.\n`
    } else {
        // 중요도순 정렬
        events.sort((a, b) => {
            const order = { high: 0, medium: 1, low: 2 }
            return order[a.impact] - order[b.impact]
        })

        message += `⚠️ 주요 이벤트 ${events.length}건\n\n`

        for (const event of events) {
            const flag = COUNTRY_FLAGS[event.country] || '🌍'
            const importance = IMPORTANCE_EMOJI[event.impact] || '⚪'

            message += `${importance} ${flag} ${event.time} (현지)\n`
            message += `   ${event.event}\n`

            if (event.estimate !== undefined && event.estimate !== null) {
                message += `   예상: ${event.estimate}`
                if (event.previous !== undefined && event.previous !== null) {
                    message += ` | 이전: ${event.previous}`
                }
                message += `\n`
            }
            message += `\n`
        }
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `🔴 높음 🟡 중간 🟢 낮음\n`
    message += `\n🌐 trantradinglab.com`

    return message
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Fetching economic calendar...')
        const events = await fetchEconomicCalendar()
        const message = formatMessage(events)

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        )

        const result = await telegramRes.json()

        if (!result.ok) {
            console.error('Telegram error:', result)
            return res.status(500).json({ error: result.description })
        }

        return res.status(200).json({
            success: true,
            eventsCount: events.length,
            messageId: result.result?.message_id
        })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
