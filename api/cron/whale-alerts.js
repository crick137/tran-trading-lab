/**
 * 🐋 TRAN 고래 알림
 * Vercel Cron: 매 10분마다 실행
 * 채널: @TranTradingLabNews
 * 
 * 대형 거래 감지 및 알림
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID || '@TranTradingLabNews'

// 최소 알림 금액 (USD)
const MIN_ALERT_AMOUNT = 10000000 // $10M

// 중복 방지를 위한 최근 알림 해시
const recentAlerts = new Set()
const MAX_RECENT = 100

// ============================================
// Whale Alert API (무료 대안: Blockchain.com API)
// ============================================

async function getRecentLargeTransactions() {
    const transactions = []

    // Bitcoin 대형 거래 조회 (Blockchain.info API)
    try {
        const btcRes = await fetch('https://blockchain.info/unconfirmed-transactions?format=json')
        const btcData = await btcRes.json()

        // BTC 가격 조회
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
                    coinName: '비트코인',
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

    // Ethereum 대형 거래 (Etherscan API - 무료 티어 사용)
    // Note: 실제 운영시 ETHERSCAN_API_KEY 환경변수 필요
    try {
        const ethPrice = await getEthPrice()
        const ethRes = await fetch('https://api.etherscan.io/api?module=account&action=txlist&address=0x0000000000000000000000000000000000000000&startblock=0&endblock=99999999&page=1&offset=10&sort=desc')
        // Note: 이것은 예시입니다. 실제로는 큰 지갑들을 모니터링해야 합니다.
    } catch (e) {
        console.error('ETH whale check error:', e.message)
    }

    return transactions
}

async function getEthPrice() {
    try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
        const data = await res.json()
        return parseFloat(data.price)
    } catch {
        return 3000
    }
}

// ============================================
// 거래소 입출금 감지 (Binance 대형 이체)
// ============================================

async function getExchangeFlows() {
    const flows = []

    // 바이낸스 대형 입출금 지갑 모니터링
    const knownExchangeWallets = [
        { address: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo', name: 'Binance Cold Wallet', exchange: 'Binance' },
        { address: 'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97', name: 'Binance Hot Wallet', exchange: 'Binance' },
    ]

    // 이 부분은 실제 API 호출로 교체 필요
    // 데모용으로 빈 배열 반환

    return flows
}

// ============================================
// 알림 메시지 생성
// ============================================

function formatWhaleAlert(tx) {
    const emoji = tx.amountUsd >= 50000000 ? '🐳' : '🐋'
    const size = tx.amountUsd >= 100000000 ? '초대형' : tx.amountUsd >= 50000000 ? '대형' : '중형'

    const koreaTime = new Date(tx.timestamp).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit', minute: '2-digit'
    })

    const amountFormatted = tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const usdFormatted = (tx.amountUsd / 1000000).toFixed(1)

    return `${emoji} ${size} 고래 이동 감지!

━━━━━━━━━━━━━━━━━━━━

💰 ${tx.coinName} ${amountFormatted} ${tx.coin}
💵 약 $${usdFormatted}M (${(tx.amountUsd / 1e9 * 100).toFixed(2)}% of daily volume)

📤 From: ${tx.from}
📥 To: ${tx.to}

━━━━━━━━━━━━━━━━━━━━

⏰ ${koreaTime} (KST)
🔗 Tx: ${tx.id?.slice(0, 16)}...

#고래알림 #${tx.coinName} #TranTradingLab`
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
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Checking for whale transactions...')

        const transactions = await getRecentLargeTransactions()

        let alertsSent = 0

        for (const tx of transactions) {
            // 중복 체크
            if (recentAlerts.has(tx.id)) continue

            const message = formatWhaleAlert(tx)
            const sent = await sendAlert(message)

            if (sent) {
                alertsSent++
                recentAlerts.add(tx.id)

                // 메모리 관리: 오래된 항목 제거
                if (recentAlerts.size > MAX_RECENT) {
                    const first = recentAlerts.values().next().value
                    recentAlerts.delete(first)
                }
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
