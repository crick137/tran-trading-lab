/**
 * 🚨 TRAN 가격 돌파 알림 (Premium)
 * Vercel Cron: 매일 2회 실행 (UTC 00:00, 12:00 = KST 09:00, 21:00)
 * 채널: @http4477
 */

import { kv } from '@vercel/kv'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const NEWS_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    throw new Error('Missing environment variables')
}

// ============================================
// 주요 가격 레벨 정의
// ============================================

const PRICE_LEVELS = {
    BTC: {
        name: '비트코인',
        symbol: 'BTCUSDT',
        levels: [
            { price: 100000, type: 'resistance', label: '심리적 저항선 $100K' },
            { price: 95000, type: 'resistance', label: '강한 저항선 $95K' },
            { price: 90000, type: 'support', label: '주요 지지선 $90K' },
            { price: 85000, type: 'support', label: '강한 지지선 $85K' },
            { price: 80000, type: 'support', label: '심리적 지지선 $80K' }
        ]
    },
    ETH: {
        name: '이더리움',
        symbol: 'ETHUSDT',
        levels: [
            { price: 4000, type: 'resistance', label: '심리적 저항선 $4K' },
            { price: 3500, type: 'resistance', label: '저항선 $3.5K' },
            { price: 3000, type: 'support', label: '주요 지지선 $3K' },
            { price: 2500, type: 'support', label: '강한 지지선 $2.5K' }
        ]
    }
}

const alertCooldowns = new Map()
const COOLDOWN_MS = 60 * 60 * 1000

// ============================================
// 가격 데이터 수집
// ============================================

async function getCurrentPrices() {
    try {
        const symbols = Object.values(PRICE_LEVELS).map(c => c.symbol)
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=' + JSON.stringify(symbols))
        const data = await res.json()
        const prices = {}
        for (const item of data) {
            const key = Object.keys(PRICE_LEVELS).find(k => PRICE_LEVELS[k].symbol === item.symbol)
            if (key) prices[key] = parseFloat(item.price)
        }
        return prices
    } catch (e) {
        return {}
    }
}

async function get24hChange(symbol) {
    try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        const data = await res.json()
        return parseFloat(data.priceChangePercent)
    } catch {
        return 0
    }
}

// ============================================
// DALL-E 3 알림 이미지
// ============================================

async function generateAlertImage(breach) {
    const actionDesc = breach.direction === 'up'
        ? 'A powerful golden rocket shattering a glass ceiling, explosive shards, upward momentum'
        : 'A heavy stone floor cracking and collapsing, red warning lights, downward momentum'

    const prompt = `Dramatic 3D illustration of financial market breakout.
    Subject: ${breach.name} price alert. ${actionDesc}.
    Mood: Intense, high energy, futuristic.
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

// ============================================
// 돌파 감지 및 알림
// ============================================

function checkBreaches(prices, previousPrices) {
    const breaches = []

    for (const [coin, config] of Object.entries(PRICE_LEVELS)) {
        const currentPrice = prices[coin]
        const prevPrice = previousPrices?.[coin]

        if (!currentPrice || !prevPrice) continue

        for (const level of config.levels) {
            if (level.type === 'resistance' && prevPrice < level.price && currentPrice >= level.price) {
                breaches.push({
                    coin,
                    name: config.name,
                    symbol: config.symbol,
                    price: currentPrice,
                    level: level.price,
                    label: level.label,
                    direction: 'up'
                })
            }
            if (level.type === 'support' && prevPrice > level.price && currentPrice <= level.price) {
                breaches.push({
                    coin,
                    name: config.name,
                    symbol: config.symbol,
                    price: currentPrice,
                    level: level.price,
                    label: level.label,
                    direction: 'down'
                })
            }
        }
    }
    return breaches
}

async function sendAlert(breach) {
    const change = await get24hChange(breach.symbol)
    const arrow = breach.direction === 'up' ? '▲' : '▼'
    const action = breach.direction === 'up' ? '상향 돌파 (Breakout)' : '하향 이탈 (Breakdown)'

    const message = `🚨 TRAN 가격 알림 | ${breach.name}
━━━━━━━━━━━━━━━━━━━━

🎯 ${breach.label} ${action}!

• 현재가: $${breach.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
• 24h 변동: ${arrow} ${Math.abs(change).toFixed(2)}%
• 기준 레벨: $${breach.level.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
📊 실시간 차트: trantradinglab.com
#${breach.name} #가격알림 #TranTradingLab`

    const imageUrl = await generateAlertImage(breach)

    try {
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
        return true
    } catch (e) {
        console.error('Telegram error:', e.message)
        return false
    }
}

// ... KV storage logic same as before ...
const PRICE_STORAGE_KEY = 'price-alerts:previous-prices'
async function getPreviousPrices() {
    try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const stored = await kv.get(PRICE_STORAGE_KEY)
            return stored || null
        }
    } catch (e) { }
    return null
}
async function savePreviousPrices(prices) {
    try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            await kv.set(PRICE_STORAGE_KEY, prices, { ex: 86400 })
            return true
        }
    } catch (e) { }
    return false
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const currentPrices = await getCurrentPrices()
        if (Object.keys(currentPrices).length === 0) return res.status(500).json({ error: 'Fetch failed' })

        const previousPrices = await getPreviousPrices()

        if (!previousPrices) {
            await savePreviousPrices(currentPrices)
            return res.status(200).json({ message: 'Initialized prices' })
        }

        const breaches = checkBreaches(currentPrices, previousPrices)

        for (const breach of breaches) {
            await sendAlert(breach)
        }

        await savePreviousPrices(currentPrices)
        return res.status(200).json({ success: true, breaches: breaches.length })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
