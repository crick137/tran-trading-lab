/**
 * 😱😈 Fear & Greed Index (English)
 * Vercel Cron: Daily execution
 * Channel: @TranTradingLabEN
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = '@TranTradingLabEN'

async function getFearAndGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2')
        const data = await res.json()
        const today = data.data[0]
        const yesterday = data.data[1]

        return {
            value: parseInt(today.value),
            classification: today.value_classification,
            yesterdayValue: parseInt(yesterday.value),
            change: parseInt(today.value) - parseInt(yesterday.value)
        }
    } catch (e) {
        console.error('Fear & Greed API error:', e.message)
        return null
    }
}

function getEmoji(value) {
    if (value <= 25) return '😱'      // Extreme Fear
    if (value <= 45) return '😰'      // Fear
    if (value <= 55) return '😐'      // Neutral
    if (value <= 75) return '😏'      // Greed
    return '🤑'                        // Extreme Greed
}

function getGaugeBar(value) {
    const total = 20
    const filled = Math.round(value / 100 * total)
    const bar = '█'.repeat(filled) + '░'.repeat(total - filled)
    return bar
}

function getBasicInsight(value) {
    if (value <= 25) {
        return '📉 Market is in extreme fear. This could be a contrarian buying opportunity.'
    } else if (value <= 45) {
        return '🔍 Cautious sentiment prevails. Careful observation is recommended.'
    } else if (value <= 55) {
        return '⚖️ Market is in balance. No clear directional bias.'
    } else if (value <= 75) {
        return '📈 Optimistic sentiment. Watch for signs of overheating.'
    } else {
        return '⚠️ Market is overheated. Be cautious of sudden corrections.'
    }
}

async function getAIInsight(fng) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) return getBasicInsight(fng.value)

    try {
        const prompt = `Current Crypto Fear & Greed Index: ${fng.value}/100 (${fng.classification})
Yesterday: ${fng.yesterdayValue} → Today: ${fng.value} (${fng.change > 0 ? '+' : ''}${fng.change})

Based on this data, provide a 1-2 sentence actionable insight for traders in English.
- Explain what this sentiment means
- Give action guidance (buy/hold/caution)
- Include emoji

Example: "📉 Extreme fear often precedes market rebounds. Consider this a potential accumulation zone, but keep stop-losses tight."`

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a crypto market sentiment analyst. Provide concise, actionable insights.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        })

        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || getBasicInsight(fng.value)
    } catch (e) {
        console.error('AI insight error:', e.message)
        return getBasicInsight(fng.value)
    }
}

function formatMessage(fng, insight) {
    const emoji = getEmoji(fng.value)
    const gauge = getGaugeBar(fng.value)
    const changeEmoji = fng.change > 0 ? '📈' : fng.change < 0 ? '📉' : '➡️'
    const changeText = fng.change > 0 ? `+${fng.change}` : fng.change.toString()

    return `${emoji} Crypto Fear & Greed Index
━━━━━━━━━━━━━━━━━━━━

🎯 Current: ${fng.value} (${fng.classification})

${gauge}
0 ────────────────── 100
FEAR                 GREED

${changeEmoji} vs Yesterday: ${changeText} (${fng.yesterdayValue} → ${fng.value})

💡 AI Market Insight:
${insight}

━━━━━━━━━━━━━━━━━━━━
🌐 trantradinglab.com`
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Fetching Fear & Greed Index...')
        const fng = await getFearAndGreed()

        if (!fng) {
            return res.status(500).json({ error: 'Failed to fetch Fear & Greed data' })
        }

        const insight = await getAIInsight(fng)
        const message = formatMessage(fng, insight)

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message
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
            value: fng.value,
            messageId: result.result?.message_id
        })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
