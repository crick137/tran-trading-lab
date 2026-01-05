/**
 * 📊 TRAN 주간 마켓 리포트
 * Vercel Cron: 매주 일요일 10:00 (KST) 실행
 * 채널: @http4477
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002815876265'
const GROQ_API_KEY = process.env.GROQ_API_KEY

// ============================================
// 주간 데이터 수집
// ============================================

async function getWeeklyPerformance() {
    const coins = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT']
    const performance = []

    for (const symbol of coins) {
        try {
            const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=7`)
            const data = await res.json()

            if (data.length >= 7) {
                const weekStart = parseFloat(data[0][1])
                const weekEnd = parseFloat(data[data.length - 1][4])
                const change = ((weekEnd - weekStart) / weekStart) * 100
                const volume = data.reduce((sum, d) => sum + parseFloat(d[7]), 0)

                performance.push({
                    symbol: symbol.replace('USDT', ''),
                    price: weekEnd,
                    weeklyChange: change,
                    volume: volume / 1e9
                })
            }
        } catch (e) {
            console.error(`Error fetching ${symbol}:`, e.message)
        }
    }

    return performance.sort((a, b) => b.weeklyChange - a.weeklyChange)
}

async function getWeeklyStockPerformance() {
    const indices = { 'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11' }
    const result = {}

    for (const [name, symbol] of Object.entries(indices)) {
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            const data = await res.json()
            const closes = data.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(c => c !== null) || []

            if (closes.length >= 2) {
                const weekStart = closes[0]
                const weekEnd = closes[closes.length - 1]
                result[name] = {
                    price: weekEnd,
                    weeklyChange: ((weekEnd - weekStart) / weekStart) * 100
                }
            }
        } catch { }
    }

    return result
}

async function getWeeklyFearGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=7')
        const data = await res.json()
        const values = data.data.map(d => parseInt(d.value))
        return {
            current: values[0],
            weekStart: values[values.length - 1],
            average: Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        }
    } catch {
        return { current: 50, weekStart: 50, average: 50 }
    }
}

// ============================================
// AI 주간 분석 생성
// ============================================

async function generateWeeklyAnalysis(data) {
    const { cryptoPerf, stockPerf, fearGreed } = data

    const koreaDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric'
    })

    const topGainers = cryptoPerf.slice(0, 3)
    const topLosers = cryptoPerf.slice(-3).reverse()

    const marketContext = `
【이번 주 시장 데이터】

🏆 주간 상승 TOP 3:
${topGainers.map((c, i) => `${i + 1}. ${c.symbol}: ${c.weeklyChange >= 0 ? '+' : ''}${c.weeklyChange.toFixed(2)}%`).join('\n')}

📉 주간 하락 TOP 3:
${topLosers.map((c, i) => `${i + 1}. ${c.symbol}: ${c.weeklyChange.toFixed(2)}%`).join('\n')}

₿ 비트코인 주간:
- 현재가: $${cryptoPerf.find(c => c.symbol === 'BTC')?.price?.toLocaleString()}
- 주간 변동: ${cryptoPerf.find(c => c.symbol === 'BTC')?.weeklyChange?.toFixed(2)}%

📈 주식시장 주간:
- S&P500: ${stockPerf['S&P500']?.weeklyChange?.toFixed(2)}%
- NASDAQ: ${stockPerf['NASDAQ']?.weeklyChange?.toFixed(2)}%
- KOSPI: ${stockPerf['KOSPI']?.weeklyChange?.toFixed(2)}%

🌡️ 공포/탐욕:
- 주초: ${fearGreed.weekStart}
- 현재: ${fearGreed.current}
- 주간 평균: ${fearGreed.average}
`

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가입니다.
주간 시장 리뷰를 작성합니다. 오직 한국어만 사용하세요.
🔴🔵 금지, ▲▼ 사용. 스토리텔링 스타일로 작성.`

    const userPrompt = `아래 주간 데이터로 주간 리포트를 작성하세요.

${marketContext}

【출력 형식】
📊 TRAN 주간 마켓 리포트
📅 ${koreaDate} (일요일)

━━━━━━━━━━━━━━━━━━━━

📌 이번 주 시장 한 줄 요약
[이번 주 시장을 한 문장으로 요약]

━━━━━━━━━━━━━━━━━━━━

🏆 이번 주의 승자
${topGainers.map((c, i) => `${i + 1}. ${c.symbol}: ▲ +${c.weeklyChange.toFixed(2)}%`).join('\n')}

📉 이번 주의 패자
${topLosers.map((c, i) => `${i + 1}. ${c.symbol}: ▼ ${c.weeklyChange.toFixed(2)}%`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 주간 분석
• 주간 변동: [값]
• 주요 이벤트: [이번 주 BTC 관련 주요 이슈]

━━━━━━━━━━━━━━━━━━━━

📈 글로벌 증시 주간
• S&P500: [변동]
• NASDAQ: [변동]
• KOSPI: [변동]

━━━━━━━━━━━━━━━━━━━━

💡 주간 인사이트

"[창의적인 주간 분석 제목]"

[3-4문장의 주간 시장 분석 및 다음 주 전망]

━━━━━━━━━━━━━━━━━━━━

🔮 다음 주 주목 포인트
• [다음 주 주목할 첫 번째 이벤트]
• [다음 주 주목할 두 번째 이벤트]
• [다음 주 주목할 세 번째 이벤트]

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#주간리포트 #비트코인 #TranTradingLab`

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_tokens: 2000
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || null
    } catch (e) {
        console.error('Groq API error:', e.message)
        return null
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
        console.log('Generating weekly report...')

        const [cryptoPerf, stockPerf, fearGreed] = await Promise.all([
            getWeeklyPerformance(),
            getWeeklyStockPerformance(),
            getWeeklyFearGreed()
        ])

        const message = await generateWeeklyAnalysis({ cryptoPerf, stockPerf, fearGreed })

        if (!message) {
            return res.status(500).json({ error: 'AI generation failed' })
        }

        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message
            })
        })

        const result = await telegramRes.json()
        console.log('Weekly report sent:', result.ok ? 'Success' : result.description)

        return res.status(200).json({ success: true, messageId: result.result?.message_id })

    } catch (error) {
        console.error('Weekly report error:', error)
        return res.status(500).json({ error: error.message })
    }
}
