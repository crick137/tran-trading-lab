/**
 * 🌙 TRAN 마켓 클로징 서머리
 * Vercel Cron: 매일 저녁 8시 (KST) 자동 실행
 * 채널: @http4477
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import FormData from 'form-data'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002815876265'
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// ============================================
// 데이터 수집 함수들
// ============================================

async function getCryptoData() {
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT']
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(symbols))
        const data = await res.json()
        const result = {}
        for (const item of data) {
            const name = item.symbol.replace('USDT', '')
            result[name] = {
                price: parseFloat(item.lastPrice),
                change: parseFloat(item.priceChangePercent),
                volume: parseFloat(item.quoteVolume) / 1e9,
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice)
            }
        }
        return result
    } catch { return {} }
}

async function getStockData() {
    const symbols = { 'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11', 'VIX': '^VIX', 'DXY': 'DX-Y.NYB' }
    const result = {}
    for (const [name, sym] of Object.entries(symbols)) {
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            const data = await res.json()
            const chartResult = data.chart?.result?.[0]
            const meta = chartResult?.meta
            const closes = chartResult?.indicators?.quote?.[0]?.close?.filter(c => c !== null)
            if (meta && closes && closes.length >= 2) {
                const currentPrice = meta.regularMarketPrice || closes[closes.length - 1]
                const prevClose = closes[closes.length - 2]
                result[name] = { price: currentPrice, change: prevClose ? ((currentPrice - prevClose) / prevClose * 100) : 0 }
            }
        } catch { }
    }
    return result
}

async function getFearGreedIndex() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2')
        const data = await res.json()
        return { value: parseInt(data.data[0].value), change: parseInt(data.data[0].value) - parseInt(data.data[1].value) }
    } catch { return { value: 50, change: 0 } }
}

async function getTopMovers(crypto) {
    const sorted = Object.entries(crypto)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    return {
        gainers: sorted.filter(c => c.change > 0).slice(0, 3),
        losers: sorted.filter(c => c.change < 0).slice(0, 3)
    }
}

// ============================================
// AI 분석 생성
// ============================================

async function generateEveningSummary(data) {
    const { crypto, stocks, fearGreed, movers } = data

    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long', hour: '2-digit', minute: '2-digit'
    })

    const marketDataContext = `
【오늘의 마감 데이터 - ${koreaTime}】

📊 암호화폐 마감:
- BTC: $${crypto.BTC?.price?.toLocaleString()} (${crypto.BTC?.change >= 0 ? '+' : ''}${crypto.BTC?.change?.toFixed(2)}%) | 고가: $${crypto.BTC?.high?.toLocaleString()} | 저가: $${crypto.BTC?.low?.toLocaleString()}
- ETH: $${crypto.ETH?.price?.toLocaleString()} (${crypto.ETH?.change >= 0 ? '+' : ''}${crypto.ETH?.change?.toFixed(2)}%)
- SOL: $${crypto.SOL?.price?.toLocaleString()} (${crypto.SOL?.change >= 0 ? '+' : ''}${crypto.SOL?.change?.toFixed(2)}%)

🏆 오늘의 상승 TOP:
${movers.gainers.map((c, i) => `${i + 1}. ${c.name}: +${c.change.toFixed(2)}%`).join('\n')}

📉 오늘의 하락 TOP:
${movers.losers.map((c, i) => `${i + 1}. ${c.name}: ${c.change.toFixed(2)}%`).join('\n')}

📈 주식시장:
- S&P500: ${stocks['S&P500']?.price?.toLocaleString()} (${stocks['S&P500']?.change >= 0 ? '+' : ''}${stocks['S&P500']?.change?.toFixed(2)}%)
- NASDAQ: ${stocks.NASDAQ?.price?.toLocaleString()} (${stocks.NASDAQ?.change >= 0 ? '+' : ''}${stocks.NASDAQ?.change?.toFixed(2)}%)
- KOSPI: ${stocks.KOSPI?.price?.toLocaleString()} (${stocks.KOSPI?.change >= 0 ? '+' : ''}${stocks.KOSPI?.change?.toFixed(2)}%)
- VIX: ${stocks.VIX?.price?.toFixed(2)}

🌡️ 공포/탐욕: ${fearGreed.value} (${fearGreed.change >= 0 ? '+' : ''}${fearGreed.change})
`

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가이자 금융 스토리텔러입니다.

【핵심 규칙】
1. 오직 한국어만 사용. 중국어, 일본어, 영어 단어 절대 금지.
2. "[변동 없음]", "[데이터 없음]" 같은 플레이스홀더 절대 금지.
3. 🔴🔵 같은 색깔 원 이모지 금지. 대신 ▲▼ 화살표 사용.

【저녁 리포트 스타일】
- 하루를 정리하는 느낌으로 작성
- 오늘 무슨 일이 있었는지 스토리텔링
- 내일 주목할 포인트 제시
- 비유와 은유 활용 ("황소의 하루", "곰의 반격")`

    const userPrompt = `아래 오늘의 마감 데이터를 바탕으로 저녁 마켓 서머리를 작성하세요.

${marketDataContext}

【출력 형식】
🌙 TRAN 마켓 클로징 서머리
📅 ${koreaTime}

━━━━━━━━━━━━━━━━━━━━

📊 오늘의 시장 한 줄 요약
[오늘 시장을 한 문장으로 요약]

━━━━━━━━━━━━━━━━━━━━

🏆 오늘의 승자 & 패자
▲ 상승 TOP: [코인명] (+X.XX%)
▼ 하락 TOP: [코인명] (-X.XX%)

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 하루 정리
• 종가: $[가격] ([변동])
• 일중 범위: $[저가] ~ $[고가]
• 거래량: [수준 평가]

━━━━━━━━━━━━━━━━━━━━

📈 글로벌 증시 마감
• S&P500: [가격] ([변동])
• NASDAQ: [가격] ([변동])
• KOSPI: [가격] ([변동])

━━━━━━━━━━━━━━━━━━━━

💡 오늘의 인사이트

"[창의적인 제목]"

[2-3문장의 오늘 시장 분석]

━━━━━━━━━━━━━━━━━━━━

🔮 내일 주목 포인트
• [내일 주목할 첫 번째 포인트]
• [내일 주목할 두 번째 포인트]

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#마감정리 #비트코인 #TranTradingLab`

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
                max_tokens: 1500
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
// Gemini 이미지 생성
// ============================================

async function generateEveningBanner(fearGreedValue, btcChange) {
    if (!GEMINI_API_KEY) return null
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        const mood = btcChange >= 0 ? 'bullish sunset with golden tones' : 'bearish twilight with cool purple tones'
        const prompt = `Create a professional financial market closing banner image. Style: ${mood}. Include: moon, city skyline at dusk, stock chart overlay, "MARKET CLOSE" text. Modern, sleek, 16:9 aspect ratio. No text except "MARKET CLOSE".`

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
        })

        const parts = result.response.candidates?.[0]?.content?.parts || []
        for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
                return Buffer.from(part.inlineData.data, 'base64')
            }
        }
    } catch (e) {
        console.error('Gemini image error:', e.message)
    }
    return null
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
        console.log('Fetching market data for evening summary...')
        const [crypto, stocks, fearGreed] = await Promise.all([
            getCryptoData(), getStockData(), getFearGreedIndex()
        ])

        const movers = await getTopMovers(crypto)
        const allData = { crypto, stocks, fearGreed, movers }

        const message = await generateEveningSummary(allData)

        if (!message) {
            console.error('Failed to generate evening summary')
            return res.status(500).json({ error: 'AI generation failed' })
        }

        console.log(`Evening Summary Generated (${message.length} chars)`)

        // 1. 배너 이미지 생성 및 전송
        const imageBuffer = await generateEveningBanner(fearGreed.value, crypto.BTC?.change || 0)

        if (imageBuffer) {
            const form = new FormData()
            form.append('chat_id', CHANNEL_ID)
            form.append('photo', imageBuffer, { filename: 'evening_banner.png' })
            form.append('caption', '🌙 마켓 클로징 - TRAN Trading Lab')

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: form.getHeaders(),
                body: form
            })
        }

        // 2. 텍스트 서머리 전송
        const resText = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message
            })
        })

        const result = await resText.json()
        console.log('Evening summary sent:', result.ok ? 'Success' : result.description)

        return res.status(200).json({ success: true, messageId: result.result?.message_id })

    } catch (error) {
        console.error('Evening summary error:', error)
        return res.status(500).json({ error: error.message })
    }
}
