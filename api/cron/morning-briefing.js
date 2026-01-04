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
    const symbols = { 'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11', 'VIX': '^VIX', 'DXY': 'DX-Y.NYB', '삼성전자': '005930.KS', 'SK하이닉스': '000660.KS' }
    const result = {}
    for (const [name, sym] of Object.entries(symbols)) {
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            const data = await res.json()
            const meta = data.chart?.result?.[0]?.meta
            if (meta) result[name] = { price: meta.regularMarketPrice, change: meta.previousClose ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) : 0 }
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

async function generateAnalysis(data) {
    const { crypto, stocks, fearGreed, globalData, futures, forex } = data
    const prompt = `【시장 데이터】
BTC: $${crypto.BTC?.price} (${crypto.BTC?.change}%), ATH대비 ${globalData.btcAthChange}%
펀딩: ${futures.fundingRate}%, 미결제: ${futures.openInterest}K
S&P500: ${stocks['S&P500']?.change}%, VIX: ${stocks.VIX?.price}
공포/탐욕: ${fearGreed.value}
【요청】
5문장 시장 분석. 숫자 필수. 전문적. AI/분석결과 단어 금지.`

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: 'You are a professional crypto analyst.' }, { role: 'user', content: prompt }],
                temperature: 0.7, max_tokens: 600
            })
        })
        const json = await res.json()
        let text = json.choices?.[0]?.message?.content?.trim() || ''
        return text.replace(/AI|인공지능|분석 결과/g, '') || '시장 분석 데이터 생성 중...'
    } catch { return '시장 분석 데이터를 불러올 수 없습니다.' }
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
        const analysis = await generateAnalysis(allData)

        // 메시지 생성 (Plain Text)
        const message = `☀️ TRAN 얼티밋 마켓 브리핑
📅 ${getKoreaDateTime()}

━━━━━━━━━━━━━━━━━━━━

📰 오늘의 헤드라인
${news.map((n, i) => `${i + 1}. ${n.slice(0, 40)}${n.length > 40 ? '...' : ''}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

🌡️ 시장 센티먼트
• 공포/탐욕: ${fearGreed.value} ${fgEmoji(fearGreed.value)} (${fearGreed.change >= 0 ? '+' : ''}${fearGreed.change})
• VIX: ${stocks.VIX?.price?.toFixed(2)}
• 달러인덱스: ${stocks.DXY?.price?.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━

📊 글로벌 증시
• S&P500: ${fmt(stocks['S&P500']?.price)} ${chg(stocks['S&P500']?.change)}
• NASDAQ: ${fmt(stocks.NASDAQ?.price)} ${chg(stocks.NASDAQ?.change)}
• KOSPI: ${fmt(stocks.KOSPI?.price)} ${chg(stocks.KOSPI?.change)}

🇰🇷 한국 대표주
• 삼성전자: ₩${fmt(stocks['삼성전자']?.price, 0)} ${chg(stocks['삼성전자']?.change)}
• SK하이닉스: ₩${fmt(stocks['SK하이닉스']?.price, 0)} ${chg(stocks['SK하이닉스']?.change)}

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 심층 분석
• 현재가: $${fmt(crypto.BTC?.price)} ${chg(crypto.BTC?.change)}
• ATH 대비: ${globalData.btcAthChange}%
• 24h 거래량: $${crypto.BTC?.volume?.toFixed(1)}B

📈 선물 시장
• 펀딩비: ${futures.fundingRate}%
• 미결제약정: ${futures.openInterest}K BTC

💰 크립토 시장
• BTC 도미넌스: ${globalData.btcDominance}%
• ETH: $${fmt(crypto.ETH?.price)} ${chg(crypto.ETH?.change)}
• SOL: $${fmt(crypto.SOL?.price)} ${chg(crypto.SOL?.change)}

━━━━━━━━━━━━━━━━━━━━

💱 환율
• 원/달러: ₩${fmt(forex.KRW, 0)}
• 엔/달러: ¥${fmt(forex.JPY, 1)}

━━━━━━━━━━━━━━━━━━━━

💡 시장 분석

${analysis.slice(0, 1000)}

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: ${CHANNEL_ID}
🌐 웹: trantradinglab.com

#시장분석 #비트코인 #투자전략`

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
