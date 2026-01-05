/**
 * 🌅 TRAN 얼티밋 마켓 브리핑 v5 (Cloud Version)
 * Vercel Cron용: 매일 아침 8시 (KST) 자동 실행
 * 채널: @http4477
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import FormData from 'form-data'

const TELEGRAM_BOT_TOKEN = '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8'
const CHANNEL_ID = '-1002815876265' // @http4477 numeric ID
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBSeChx2bYTPMrcRLfbPoWpFtUq8wjgHDQ' // Hardcoded for convenience

const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-crypto', url: 'https://www.hankyung.com/feed/crypto', name: '한경 코인' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' }
]

// ============================================
// Gemini 이미지 생성 (In-Memory Buffer)
// ============================================

async function generateMarketBanner(fearGreedValue, btcChange) {
    if (!GEMINI_API_KEY) {
        console.log('Gemini API Key missing')
        return null
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp-image-generation',
        })

        const mood = fearGreedValue <= 25 ? 'dramatic dark stormy bearish' :
            fearGreedValue >= 75 ? 'bright golden bullish celebration' : 'calm neutral balanced'
        const trend = btcChange >= 0 ? 'upward trending green' : 'downward trending red'

        const prompt = `A professional crypto market dashboard banner image. ${mood} mood with ${trend} visual elements. Abstract Bitcoin chart visualization with candlesticks. Futuristic digital art style with neon glow effects. Dark background with blue and gold accents. No text. 16:9 horizontal aspect ratio.`

        console.log('Generating Gemini image...')

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
        })

        const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)

        if (imagePart?.inlineData?.data) {
            // Buffer 반환 (파일 저장 안함)
            return Buffer.from(imagePart.inlineData.data, 'base64')
        }
    } catch (e) {
        console.error('Gemini Gen Error:', e.message)
    }
    return null
}

// ============================================
// 데이터 수집 함수들
// ============================================

async function getCryptoData() {
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
        const result = {}
        for (const sym of symbols) {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`)
            const data = await res.json()
            result[sym.replace('USDT', '')] = {
                price: parseFloat(data.lastPrice),
                change: parseFloat(data.priceChangePercent),
                high: parseFloat(data.highPrice),
                low: parseFloat(data.lowPrice),
                volume: parseFloat(data.quoteVolume) / 1e9
            }
        }
        return result
    } catch { return { BTC: { price: 95000, change: 0, high: 96000, low: 94000, volume: 1 } } }
}

async function getFuturesData() {
    try {
        const [fundingRes, oiRes] = await Promise.all([
            fetch('https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=1'),
            fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT')
        ])
        const funding = await fundingRes.json()
        const oi = await oiRes.json()
        return {
            fundingRate: (parseFloat(funding[0]?.fundingRate || 0) * 100).toFixed(4),
            openInterest: (parseFloat(oi?.openInterest || 0) / 1000).toFixed(1)
        }
    } catch { return { fundingRate: '0.01', openInterest: '200' } }
}

async function getStockData() {
    console.log('Fetching Stock Data from Yahoo Finance...')
    const symbols = { 'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11', 'VIX': '^VIX', 'DXY': 'DX-Y.NYB', '삼성전자': '005930.KS', 'SK하이닉스': '000660.KS' }
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
            } else if (meta) {
                result[name] = { price: meta.regularMarketPrice, change: 0 }
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

async function getGlobalCryptoData() {
    try {
        const [global, btc] = await Promise.all([
            fetch('https://api.coingecko.com/api/v3/global').then(r => r.json()),
            fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false').then(r => r.json())
        ])
        return {
            btcDominance: global.data?.market_cap_percentage?.btc?.toFixed(1) || '50',
            totalMarketCap: (global.data?.total_market_cap?.usd / 1e12).toFixed(2) || '2.5',
            btcAth: btc.market_data?.ath?.usd || 100000,
            btcAthChange: btc.market_data?.ath_change_percentage?.usd?.toFixed(1) || '-10'
        }
    } catch { return { btcDominance: '50', totalMarketCap: '2.5', btcAth: 100000, btcAthChange: '-10' } }
}

async function getForexData() {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD')
        const data = await res.json()
        return { KRW: data.rates.KRW || 1450, JPY: data.rates.JPY || 150 }
    } catch { return { KRW: 1450, JPY: 150 } }
}

async function getTopNews() {
    try {
        console.log('Fetching Multi-Source News...')
        const allNews = []

        const parseRSS = (xml, sourceName) => {
            const items = []
            const regex = /<item>([\s\S]*?)<\/item>/g
            let match
            while ((match = regex.exec(xml)) !== null) {
                const itemContent = match[1]
                const titleMatch = /<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>/.exec(itemContent)
                const linkMatch = /<link>([^<]+)<\/link>/.exec(itemContent)
                const dateMatch = /<pubDate>([^<]+)<\/pubDate>/.exec(itemContent)

                if (titleMatch && linkMatch) {
                    items.push({
                        title: titleMatch[1].trim(),
                        link: linkMatch[1].trim(),
                        time: dateMatch ? new Date(dateMatch[1]).getTime() : Date.now(),
                        source: sourceName
                    })
                }
            }
            return items
        }

        const fetchPromises = NEWS_FEEDS.map(async feed => {
            try {
                const res = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) })
                if (!res.ok) return []
                const xml = await res.text()
                return parseRSS(xml, feed.name)
            } catch { return [] }
        })

        const results = await Promise.all(fetchPromises)
        results.forEach(items => allNews.push(...items))

        const seen = new Set()
        const uniqueNews = allNews
            .sort((a, b) => b.time - a.time)
            .filter(n => {
                if (seen.has(n.title)) return false
                seen.add(n.title)
                return true
            })

        if (uniqueNews.length === 0) return ['뉴스 데이터 없음']

        return uniqueNews.slice(0, 5).map(n => `[${n.source}] ${n.title}`)
    } catch { return ['뉴스 데이터 수집 실패'] }
}

// ============================================
// AI 분석 (Groq)
// ============================================

async function generateFullBriefing(data, news) {
    console.log('Generating Full AI Briefing via Groq...')
    const { crypto, stocks, forex, fearGreed, globalData, futures } = data

    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long', hour: '2-digit', minute: '2-digit'
    })

    const marketDataContext = `
【실시간 시장 데이터 - ${koreaTime}】

📊 암호화폐:
- BTC: $${crypto.BTC?.price?.toLocaleString()} (${crypto.BTC?.change >= 0 ? '+' : ''}${crypto.BTC?.change?.toFixed(2)}%)
- ETH: $${crypto.ETH?.price?.toLocaleString()} (${crypto.ETH?.change >= 0 ? '+' : ''}${crypto.ETH?.change?.toFixed(2)}%)
- SOL: $${crypto.SOL?.price?.toLocaleString()} (${crypto.SOL?.change >= 0 ? '+' : ''}${crypto.SOL?.change?.toFixed(2)}%)
- BTC ATH 대비: ${globalData.btcAthChange}%
- BTC 24h 거래량: $${crypto.BTC?.volume?.toFixed(1)}B
- BTC 도미넌스: ${globalData.btcDominance}%

📈 선물:
- 펀딩비: ${futures.fundingRate}%
- 미결제약정: ${futures.openInterest}K BTC

📉 주식시장:
- S&P500: ${stocks['S&P500']?.price?.toLocaleString()} (${stocks['S&P500']?.change >= 0 ? '+' : ''}${stocks['S&P500']?.change?.toFixed(2)}%)
- NASDAQ: ${stocks.NASDAQ?.price?.toLocaleString()} (${stocks.NASDAQ?.change >= 0 ? '+' : ''}${stocks.NASDAQ?.change?.toFixed(2)}%)
- KOSPI: ${stocks.KOSPI?.price?.toLocaleString()} (${stocks.KOSPI?.change >= 0 ? '+' : ''}${stocks.KOSPI?.change?.toFixed(2)}%)
- VIX: ${stocks.VIX?.price?.toFixed(2)}
- 달러인덱스: ${stocks.DXY?.price?.toFixed(2)}
- 삼성전자: ₩${stocks['삼성전자']?.price?.toLocaleString()} (${stocks['삼성전자']?.change >= 0 ? '+' : ''}${stocks['삼성전자']?.change?.toFixed(2)}%)
- SK하이닉스: ₩${stocks['SK하이닉스']?.price?.toLocaleString()} (${stocks['SK하이닉스']?.change >= 0 ? '+' : ''}${stocks['SK하이닉스']?.change?.toFixed(2)}%)

🌡️ 센티먼트:
- 공포/탐욕 지수: ${fearGreed.value} (전일 대비 ${fearGreed.change >= 0 ? '+' : ''}${fearGreed.change})

💱 환율:
- 원/달러: ₩${forex.KRW?.toLocaleString()}
- 엔/달러: ¥${forex.JPY?.toFixed(1)}

📰 최신 뉴스 헤드라인:
${news.map((n, i) => `${i + 1}. ${n}`).join('\n')}
`

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가이자 금융 스토리텔러입니다.

【핵심 규칙 - 반드시 준수】
1. 오직 한국어만 사용. 중국어, 일본어, 영어 단어 절대 금지.
2. "[변동 없음]", "[데이터 없음]" 같은 플레이스홀더 절대 금지.
3. "AI", "분석 결과", "예측" 같은 단어 사용 금지.

【헤드라인 작성법】
- 단순 숫자 나열 금지 (예: "비트코인 1.8% 상승" ← 안 됨)
- 금융 전문 용어와 은유 활용 (예: "아일랜드 효과", "유동성 폭포수", "데드캣 바운스")
- 블룸버그/한국경제신문 헤드라인 스타일

【💡 시장 분석 스토리텔링 가이드】
시장 분석 섹션은 마치 소설의 한 장면처럼 작성하세요:

1. 창의적인 제목: 인용구 형식 ("황소들의 마지막 춤", "폭풍 전의 고요")
2. 비유와 은유 적극 활용:
   - "비트코인이 $90K 지지선에서 춤을 추고 있다"
   - "기관 투자자들이 조용히 물량을 쌓아올리는 사이..."
   - "VIX 14.5는 시장이 잠들었다는 신호가 아니라, 폭풍 전의 고요함일 수 있다"
3. 긴장감과 드라마:
   - 황소(상승) vs 곰(하락)의 대결 구도로 묘사
   - "만약 ~한다면" 시나리오 제시
4. 마무리는 행동 촉구:
   - "지금은 관망할 때가 아니다. 리스크 관리와 함께 기회를 포착하라."

【금지 표현】
- "~입니다", "~있습니다" 반복 자제
- "상승세/하락세를 보이고 있습니다" 같은 진부한 표현
- 괄호 안 플레이스홀더
- 🔴🔵 같은 색깔 원 이모지 금지. 대신 ▲ (상승, 녹색 의미), ▼ (하락, 적색 의미) 화살표 사용`

    const userPrompt = `아래 실시간 시장 데이터를 바탕으로, 다음 형식에 맞춰 완전한 한국어 마켓 브리핑을 작성하세요.

${marketDataContext}

【출력 형식】
☀️ TRAN 얼티밋 마켓 브리핑
📅 ${koreaTime}

━━━━━━━━━━━━━━━━━━━━

📰 오늘의 헤드라인
1️⃣ [창의적이고 전문적인 첫 번째 헤드라인 - 주식/경제 관련]
2️⃣ [창의적이고 전문적인 두 번째 헤드라인 - 암호화폐 관련]
3️⃣ [창의적이고 전문적인 세 번째 헤드라인 - 환율/거시경제 관련]

━━━━━━━━━━━━━━━━━━━━

🌡️ 시장 센티먼트
• 공포/탐욕: [값] [이모지] [설명] ([변동])
• VIX: [값] [변동]
• 달러인덱스: [값] [변동]

━━━━━━━━━━━━━━━━━━━━

📊 글로벌 증시
• S&P500: [가격] [변동]
• NASDAQ: [가격] [변동]
• KOSPI: [가격] [변동]

🇰🇷 한국 대표주
• 삼성전자: [가격] [변동]
• SK하이닉스: [가격] [변동]

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 심층 분석
• 현재가: [가격] [변동]
• ATH 대비: [값]
• 24h 거래량: [값]

📈 선물 시장
• 펀딩비: [값] ([해석])
• 미결제약정: [값] ([추세])

💰 크립토 시장
• BTC 도미넌스: [값] [추세]
• ETH: [가격] [변동]
• SOL: [가격] [변동]

━━━━━━━━━━━━━━━━━━━━

💱 환율
• 원/달러: [값] ([해석])
• 엔/달러: [값]

━━━━━━━━━━━━━━━━━━━━

💡 시장 분석 (TranTradingLab Insight)

"[창의적인 분석 제목]"

1. [첫 번째 핵심 포인트 제목]:
[2-3문장의 심층 분석]

2. [두 번째 핵심 포인트 제목]:
[2-3문장의 심층 분석]

3. 전략적 대응:
[투자자를 위한 액션 아이템]

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#시장분석 #비트코인 #투자전략 #TranTradingLab

【중요】
- 위 형식을 정확히 따르세요
- 모든 데이터는 제공된 실시간 값을 사용하세요
- 헤드라인은 뉴스 데이터를 참고하되 더 창의적으로 재작성하세요
- 분석은 전문적이고 인사이트 있게 작성하세요`

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
        const content = json.choices?.[0]?.message?.content?.trim()
        if (!content) {
            console.error('Groq returned empty content:', json)
            return null
        }
        return content
    } catch (e) {
        console.error('Groq API error:', e.message)
        return null
    }
}

// ============================================
// 포맷팅 및 전송
// ============================================

const fmt = (p, d = 2) => typeof p === 'number' ? (p >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: d }) : p.toFixed(d)) : '-'
const chg = (c) => typeof c === 'number' ? `${c >= 0 ? '▲+' : '▼'}${c.toFixed(2)}%` : ''
const fgEmoji = (v) => v <= 25 ? '😱 극단적 공포' : v <= 45 ? '😰 공포' : v <= 55 ? '😐 중립' : v <= 75 ? '😊 탐욕' : '🤑 극단적 탐욕'

// HTML Escape Helper
function escapeHtml(text) {
    if (!text) return ''
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getKoreaDateTime() {
    return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' })
}

export default async function handler(req, res) {
    // Vercel Cron 인증
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Fetching market data...')
        const [crypto, stocks, forex, fearGreed, globalData, futures, news] = await Promise.all([
            getCryptoData(), getStockData(), getForexData(), getFearGreedIndex(), getGlobalCryptoData(), getFuturesData(), getTopNews()
        ])

        const allData = { crypto, stocks, forex, fearGreed, globalData, futures }

        // Generate FULL briefing via Groq AI
        const message = await generateFullBriefing(allData, news)

        if (!message) {
            console.error('Failed to generate AI briefing')
            return res.status(500).json({ error: 'AI generation failed' })
        }

        console.log(`AI Briefing Generated (${message.length} chars)`)

        // 1. 배너 이미지 생성 및 전송
        console.log('Creating banner...')
        const imageBuffer = await generateMarketBanner(fearGreed.value, crypto.BTC.change)

        if (imageBuffer) {
            console.log('Sending photo with buffer...')
            const form = new FormData()
            form.append('chat_id', CHANNEL_ID)
            form.append('photo', imageBuffer, { filename: 'banner.png' })
            form.append('caption', '📊 오늘의 시장 센티먼트 - TRAN Trading Lab')

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: form.getHeaders(),
                body: form
            })
        } else {
            console.log('Sending fallback photo URL...')
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: 'https://alternative.me/crypto/fear-and-greed-index.png',
                    caption: '📊 공포/탐욕 지수 (Fear & Greed Index)'
                })
            })
        }

        // 2. 텍스트 브리핑 전송
        console.log('Sending text briefing...')
        const resText = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message,
                // parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        })

        const result = await resText.json()

        return res.status(200).json({
            success: true,
            channel: CHANNEL_ID,
            generated_image: !!imageBuffer,
            telegram_result: result
        })

    } catch (e) {
        console.error('Error:', e)
        return res.status(500).json({ error: e.message })
    }
}
