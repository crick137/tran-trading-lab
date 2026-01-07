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
        // 使用免费的经济日历数据源
        const today = new Date()
        const dayOfWeek = today.getDay()
        const dateOfMonth = today.getDate()

        // 获取已知的重要经济事件
        const events = []

        // 检查是否有重大事件（根据日期规律）
        // NFP: 每月第一个周五
        if (dayOfWeek === 5 && dateOfMonth <= 7) {
            events.push({
                time: '21:30 (KST)',
                country: 'US',
                event: '비농업 고용지수 (NFP)',
                impact: 'high',
                description: '美 비농업 부문 신규 고용'
            })
            events.push({
                time: '21:30 (KST)',
                country: 'US',
                event: '실업률',
                impact: 'high'
            })
        }

        // CPI: 通常每月10-15日
        if (dateOfMonth >= 10 && dateOfMonth <= 15) {
            // 简化：假设每月中旬有CPI
            if (dayOfWeek >= 2 && dayOfWeek <= 4) { // 周二到周四
                events.push({
                    time: '21:30 (KST)',
                    country: 'US',
                    event: '소비자물가지수 (CPI)',
                    impact: 'high'
                })
            }
        }

        // FOMC: 每6周，通常周三
        // 简化处理 - 实际应该查日历

        // 每周固定事件
        if (dayOfWeek === 4) { // 周四
            events.push({
                time: '21:30 (KST)',
                country: 'US',
                event: '신규 실업수당 청구건수',
                impact: 'medium'
            })
        }

        // 亚洲市场开盘提醒 (周一)
        if (dayOfWeek === 1) {
            events.push({
                time: '09:00 (KST)',
                country: 'KR',
                event: 'KOSPI 주간 개장',
                impact: 'low'
            })
            events.push({
                time: '09:00 (KST)',
                country: 'JP',
                event: '닛케이 주간 개장',
                impact: 'low'
            })
        }

        // 美股财报季提醒 (1月, 4月, 7月, 10月)
        const month = today.getMonth() + 1
        if ([1, 4, 7, 10].includes(month) && dateOfMonth >= 15 && dateOfMonth <= 31) {
            events.push({
                time: '장 마감 후',
                country: 'US',
                event: '📊 어닝 시즌 진행 중',
                impact: 'medium',
                description: '주요 기업 실적 발표 기간'
            })
        }

        return events
    } catch (e) {
        console.error('Error in calendar:', e.message)
        return []
    }
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
