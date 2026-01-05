/**
 * 📅 TRAN 경제 일정 알림 (Premium)
 * Vercel Cron: 매일 07:30 (KST) 실행
 * 채널: @http4477
 * 
 * 오늘의 주요 경제 이벤트 안내
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const NEWS_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

function getRecurringEvents() {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday
    const dayOfMonth = now.getDate()
    const events = []

    if (dayOfWeek === 3) {
        events.push({ time: '03:00 (다음날)', event: 'FOMC 회의록 공개', importance: 'high' })
    }
    if (dayOfWeek === 4) {
        events.push({ time: '22:30', event: '미국 신규 실업수당 청구건수', importance: 'medium' })
    }
    if (dayOfWeek === 5 && dayOfMonth <= 7) {
        events.push({ time: '22:30', event: '🔥 미국 비농업 고용지표 (NFP)', importance: 'critical' })
    }
    if (dayOfWeek === 3 && dayOfMonth >= 8 && dayOfMonth <= 14) {
        events.push({ time: '22:30', event: '🔥 미국 소비자물가지수 (CPI)', importance: 'critical' })
    }

    // Add more logic as needed
    return events
}

function getCryptoEvents() {
    return [] // Placeholder
}

async function generateCalendarImage(events) {
    const hasCritical = events.some(e => e.importance === 'critical')
    const mood = hasCritical ? 'Intense, high alert, red warning lights' : 'Calm, organized, blue holographic interface'

    const prompt = `Futuristic 3D icon representing Economic Calendar.
    Date: Today.
    Mood: ${mood}.
    Style: Glassmorphism, highly detailed, 4k.
    No text.`

    try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        })
        const json = await res.json()
        return json.data?.[0]?.url || null
    } catch (e) {
        return null
    }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const events = [...getRecurringEvents(), ...getCryptoEvents()]

        const koreaDate = new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        })

        let message = `📅 오늘의 경제 일정\n━━━━━━━━━━━━━━━━━━━━\n📆 ${koreaDate}\n\n`

        if (events.length === 0) {
            message += `✅ 오늘은 주요 경제 발표가 없습니다.\n평온한 하루 보내세요! 📊`
        } else {
            message += events.map(e => {
                const emoji = e.importance === 'critical' ? '🔴' : e.importance === 'high' ? '🟠' : '🟡'
                return `${emoji} ${e.time}\n   ${e.event}`
            }).join('\n\n')
        }

        message += `\n\n━━━━━━━━━━━━━━━━━━━━\n📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t\n🌐 웹: trantradinglab.com\n#경제일정 #TranTradingLab`

        const imageUrl = await generateCalendarImage(events)

        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: NEWS_CHANNEL_ID,
                    photo: imageUrl,
                    caption: message,
                    parse_mode: 'Markdown'
                })
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: NEWS_CHANNEL_ID,
                    text: message
                })
            })
        }

        return res.status(200).json({ success: true, count: events.length })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
