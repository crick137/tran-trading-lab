/**
 * 🐋 Whale Alerts (English)
 * Vercel Cron: Daily execution
 * Channel: @TranTradingLabEN
 * 
 * Large transaction detection and alerts
 */

import { kv } from '@vercel/kv'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = '@TranTradingLabEN'

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

// Minimum alert amount (USD)
const MIN_ALERT_AMOUNT = 10000000 // $10M

// Duplicate prevention (Vercel KV)
const ALERTS_STORAGE_KEY = 'whale-alerts-en:recent-alerts'
const MAX_RECENT = 100

async function getRecentAlerts() {
    try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const stored = await kv.get(ALERTS_STORAGE_KEY)
            return new Set(stored || [])
        }
    } catch (e) {
        console.warn('KV storage not available, using fallback:', e.message)
    }
    return new Set()
}

async function addRecentAlert(alertId) {
    try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const recentAlerts = await getRecentAlerts()
            recentAlerts.add(alertId)

            if (recentAlerts.size > MAX_RECENT) {
                const first = recentAlerts.values().next().value
                recentAlerts.delete(first)
            }

            await kv.set(ALERTS_STORAGE_KEY, Array.from(recentAlerts), { ex: 86400 })
            return true
        }
    } catch (e) {
        console.warn('KV storage not available:', e.message)
    }
    return false
}

async function getRecentLargeTransactions() {
    const transactions = []

    // Bitcoin large transactions (Blockchain.info API)
    try {
        const btcRes = await fetch('https://blockchain.info/unconfirmed-transactions?format=json')
        const btcData = await btcRes.json()

        // Get BTC price
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        const priceData = await priceRes.json()
        const btcPrice = parseFloat(priceData.price)

        for (const tx of btcData.txs?.slice(0, 50) || []) {
            const outputValue = tx.out?.reduce((sum, o) => sum + (o.value || 0), 0) / 1e8
            const usdValue = outputValue * btcPrice

            if (usdValue >= MIN_ALERT_AMOUNT) {
                transactions.push({
                    id: tx.hash,
                    coin: 'BTC',
                    coinName: 'Bitcoin',
                    amount: outputValue,
                    amountUsd: usdValue,
                    from: tx.inputs?.[0]?.prev_out?.addr?.slice(0, 8) + '...' || 'Unknown',
                    to: tx.out?.[0]?.addr?.slice(0, 8) + '...' || 'Unknown',
                    type: 'transfer',
                    timestamp: tx.time * 1000
                })
            }
        }
    } catch (e) {
        console.error('BTC whale check error:', e.message)
    }

    return transactions
}

function formatWhaleAlert(tx) {
    const emoji = tx.amountUsd >= 50000000 ? '🐳' : '🐋'
    const size = tx.amountUsd >= 100000000 ? 'MEGA' : tx.amountUsd >= 50000000 ? 'LARGE' : 'MEDIUM'

    const timeStr = new Date(tx.timestamp).toLocaleString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit', minute: '2-digit'
    })

    const amountFormatted = tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const usdFormatted = (tx.amountUsd / 1000000).toFixed(1)

    return `${emoji} ${size} Whale Movement Detected!

━━━━━━━━━━━━━━━━━━━━

💰 ${tx.coinName} ${amountFormatted} ${tx.coin}
💵 ~$${usdFormatted}M

📤 From: ${tx.from}
📥 To: ${tx.to}

━━━━━━━━━━━━━━━━━━━━

⏰ ${timeStr} (UTC)
🔗 Tx: ${tx.id?.slice(0, 16)}...

#WhaleAlert #${tx.coinName} #TranTradingLab`
}

async function sendAlert(message) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
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

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Checking for whale transactions...')

        const transactions = await getRecentLargeTransactions()
        const recentAlerts = await getRecentAlerts()

        let alertsSent = 0

        for (const tx of transactions) {
            if (recentAlerts.has(tx.id)) continue

            const message = formatWhaleAlert(tx)
            const sent = await sendAlert(message)

            if (sent) {
                alertsSent++
                await addRecentAlert(tx.id)
            }

            console.log(`Whale alert for ${tx.coinName}: ${sent ? 'Sent' : 'Failed'}`)
        }

        return res.status(200).json({
            success: true,
            transactionsFound: transactions.length,
            alertsSent,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Whale alert error:', error)
        return res.status(500).json({ error: error.message })
    }
}
