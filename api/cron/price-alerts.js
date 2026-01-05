/**
 * 🚨 TRAN 가격 돌파 알림
 * Vercel Cron: 매 5분마다 실행
 * 채널: @TranTradingLabNews
 * 
 * 주요 지지/저항선 돌파 시 즉시 알림
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID || '@TranTradingLabNews'

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
    },
    SOL: {
        name: '솔라나',
        symbol: 'SOLUSDT',
        levels: [
            { price: 200, type: 'resistance', label: '심리적 저항선 $200' },
            { price: 150, type: 'resistance', label: '저항선 $150' },
            { price: 120, type: 'support', label: '지지선 $120' },
            { price: 100, type: 'support', label: '심리적 지지선 $100' }
        ]
    }
}

// 쿨다운: 같은 레벨에 대해 1시간 내 재알림 방지
const alertCooldowns = new Map()
const COOLDOWN_MS = 60 * 60 * 1000 // 1시간

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
        console.error('Price fetch error:', e.message)
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
// 돌파 감지
// ============================================

function checkBreaches(prices, previousPrices) {
    const breaches = []

    for (const [coin, config] of Object.entries(PRICE_LEVELS)) {
        const currentPrice = prices[coin]
        const prevPrice = previousPrices?.[coin]

        if (!currentPrice || !prevPrice) continue

        for (const level of config.levels) {
            const cooldownKey = `${coin}-${level.price}`
            const lastAlert = alertCooldowns.get(cooldownKey)

            // 쿨다운 체크
            if (lastAlert && Date.now() - lastAlert < COOLDOWN_MS) continue

            // 상향 돌파 (저항선)
            if (level.type === 'resistance' && prevPrice < level.price && currentPrice >= level.price) {
                breaches.push({
                    coin,
                    name: config.name,
                    symbol: config.symbol,
                    price: currentPrice,
                    level: level.price,
                    label: level.label,
                    direction: 'up',
                    type: 'resistance'
                })
                alertCooldowns.set(cooldownKey, Date.now())
            }

            // 하향 돌파 (지지선)
            if (level.type === 'support' && prevPrice > level.price && currentPrice <= level.price) {
                breaches.push({
                    coin,
                    name: config.name,
                    symbol: config.symbol,
                    price: currentPrice,
                    level: level.price,
                    label: level.label,
                    direction: 'down',
                    type: 'support'
                })
                alertCooldowns.set(cooldownKey, Date.now())
            }
        }
    }

    return breaches
}

// ============================================
// 알림 메시지 생성
// ============================================

async function formatAlertMessage(breach) {
    const change = await get24hChange(breach.symbol)
    const emoji = breach.direction === 'up' ? '🚀' : '🔻'
    const arrow = breach.direction === 'up' ? '▲' : '▼'
    const action = breach.direction === 'up' ? '상향 돌파' : '하향 이탈'

    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    })

    return `${emoji} 가격 알림 | ${breach.name}

━━━━━━━━━━━━━━━━━━━━

🎯 ${breach.label} ${action}!

• 현재가: $${breach.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
• 24h 변동: ${arrow} ${Math.abs(change).toFixed(2)}%
• 돌파 레벨: $${breach.level.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━

⏰ ${koreaTime} (KST)
📊 실시간 차트: trantradinglab.com

#${breach.name.replace(/\s/g, '')} #가격알림 #TranTradingLab`
}

// ============================================
// 텔레그램 전송
// ============================================

async function sendAlert(message) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: NEWS_CHANNEL_ID,
                text: message
            })
        })
        const result = await res.json()
        return result.ok
    } catch (e) {
        console.error('Telegram send error:', e.message)
        return false
    }
}

// ============================================
// 이전 가격 저장 (간단한 메모리 저장소)
// 실제 운영에서는 KV 스토어 권장
// ============================================

let previousPrices = null

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Checking price levels...')

        const currentPrices = await getCurrentPrices()

        if (Object.keys(currentPrices).length === 0) {
            return res.status(500).json({ error: 'Failed to fetch prices' })
        }

        // 첫 실행 시에는 이전 가격이 없으므로 저장만 하고 종료
        if (!previousPrices) {
            previousPrices = currentPrices
            console.log('Initial prices stored:', currentPrices)
            return res.status(200).json({ message: 'Initial prices stored', prices: currentPrices })
        }

        // 돌파 감지
        const breaches = checkBreaches(currentPrices, previousPrices)

        if (breaches.length > 0) {
            console.log(`Found ${breaches.length} breach(es)!`)

            for (const breach of breaches) {
                const message = await formatAlertMessage(breach)
                const sent = await sendAlert(message)
                console.log(`Alert for ${breach.name}: ${sent ? 'Sent' : 'Failed'}`)
            }
        } else {
            console.log('No breaches detected')
        }

        // 현재 가격을 이전 가격으로 저장
        previousPrices = currentPrices

        return res.status(200).json({
            success: true,
            prices: currentPrices,
            breaches: breaches.length,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Price alert error:', error)
        return res.status(500).json({ error: error.message })
    }
}
