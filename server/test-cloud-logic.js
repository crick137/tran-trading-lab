/**
 * Cloud Logic Simulation Test
 * Simulating: api/cron/morning-briefing.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import FormData from 'form-data'
import fs from 'fs' // only used for saving test banner locally if needed, but we upload directly

const TELEGRAM_BOT_TOKEN = '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8'
const CHANNEL_ID = '-1002815876265' // NG LAB numeric ID
const GROQ_API_KEY = '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'
const GEMINI_API_KEY = 'AIzaSyBSeChx2bYTPMrcRLfbPoWpFtUq8wjgHDQ'

const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-crypto', url: 'https://www.hankyung.com/feed/crypto', name: '한경 코인' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' }
]

console.log('🧪 Starting Cloud Logic Test...')
console.log(`Target Channel: ${CHANNEL_ID}`)

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

        console.log('  🎨 Generating Gemini image...')

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
        })

        const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)

        if (imagePart?.inlineData?.data) {
            console.log('    ✓ Image generated (Buffer)')
            return Buffer.from(imagePart.inlineData.data, 'base64')
        }
    } catch (e) {
        console.error('    ✗ Gemini Gen Error:', e.message)
    }
    return null
}

async function getCryptoData() {
    console.log('  📊 Fetching Crypto Data...')
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
        const result = {}
        for (const sym of symbols) {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`)
            const data = await res.json()
            result[sym.replace('USDT', '')] = {
                price: parseFloat(data.lastPrice),
                change: parseFloat(data.priceChangePercent),
                volume: parseFloat(data.quoteVolume) / 1e9
            }
        }
        return result
    } catch { return { BTC: { price: 95000, change: 0 } } }
}

async function getFuturesData() {
    try {
        const fundingRes = await fetch('https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=1')
        const funding = await fundingRes.json()
        return { fundingRate: (parseFloat(funding[0]?.fundingRate || 0) * 100).toFixed(4), openInterest: '300' }
    } catch { return { fundingRate: '0.01', openInterest: '200' } }
}

async function getStockData() {
    console.log('  📊 Fetching Stock Data...')
    return { 'S&P500': { price: 5800, change: 0.5 }, 'VIX': { price: 14.5 }, 'DXY': { price: 104.2 } }
}

async function getFearGreedIndex() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2')
        const data = await res.json()
        return { value: parseInt(data.data[0].value), change: 0 }
    } catch { return { value: 50, change: 0 } }
}

async function getGlobalCryptoData() {
    return { btcDominance: '55.2', totalMarketCap: '3.1', btcAthChange: '-5.2' }
}

async function getForexData() {
    return { KRW: 1430, JPY: 152 }
}

async function getTopNews() {
    console.log('  📰 Fetching Multi-Source News...')
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
}

async function generateAnalysis(data) {
    console.log('  🧠 Generating Full AI Analysis...')
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
                temperature: 0.7
            })
        })
        const json = await res.json()
        console.log('Groq API Response:', json); // Log full result object
        return json.choices?.[0]?.message?.content?.trim() || 'Analysis unavailable.'
    } catch { return 'Analysis unavailable.' }
}

const fmt = (p, decimalPlaces = 2) => p?.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces })
const fgEmoji = (v) => {
    if (v <= 25) return '😱' // Extreme Fear
    if (v <= 45) return '😨' // Fear
    if (v <= 55) return '😐' // Neutral
    if (v <= 75) return '😁' // Greed
    return '🤩' // Extreme Greed
}
const chg = (c) => {
    if (c === undefined || c === null) return ''
    const val = parseFloat(c)
    if (isNaN(val)) return ''
    const sign = val >= 0 ? '▲' : '▼'
    return `${sign} ${Math.abs(val).toFixed(2)}%`
}

function getKoreaDateTime() {
    return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
}

// HTML Escape Helper (Simplified)
function escapeHtml(text) {
    if (!text) return ''
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function runTest() {
    try {
        console.log('📊 Fetching Real Market Data...')
        const [crypto, stocks, forex, fearGreed, globalData, futures, news] = await Promise.all([
            getCryptoData(), getStockData(), getForexData(), getFearGreedIndex(), getGlobalCryptoData(), getFuturesData(), getTopNews()
        ])

        const allData = { crypto, stocks, forex, fearGreed, globalData, futures }
        const analysis = await generateAnalysis(allData)

        // Production Message Format (Plain Text)
        const message = `☀️ TRAN 얼티밋 마켓 브리핑
📅 ${getKoreaDateTime()}

━━━━━━━━━━━━━━━━━━━━

📰 오늘의 헤드라인
${news.map((n, i) => `${i + 1}. ${n.slice(0, 40)}${n.length > 40 ? '...' : ''}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

🌡️ 시장 센티먼트
• 공포/탐욕: ${fearGreed.value} ${fgEmoji(fearGreed.value)} (${fearGreed.change >= 0 ? '+' : ''}${fearGreed.change})
• VIX: ${stocks.VIX?.price?.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━

📊 글로벌 증시
• S&P500: ${fmt(stocks['S&P500']?.price)} ${chg(stocks['S&P500']?.change)}
• NASDAQ: ${fmt(stocks.NASDAQ?.price)} ${chg(stocks.NASDAQ?.change)}
• KOSPI: ${fmt(stocks.KOSPI?.price)} ${chg(stocks.KOSPI?.change)}

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 심층 분석
• 현재가: $${fmt(crypto.BTC?.price)} ${chg(crypto.BTC?.change)}
• ATH 대비: ${globalData.btcAthChange}%
• 24h 거래량: $${crypto.BTC?.volume?.toFixed(1)}B

📈 선물 시장
• 펀딩비: ${futures.fundingRate}%
• 미결제약정: ${futures.openInterest}K BTC

━━━━━━━━━━━━━━━━━━━━

💡 시장 분석

${analysis.slice(0, 1000)}

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: ${CHANNEL_ID} (ID check)
🌐 웹: trantradinglab.com

#시장분석 #비트코인 #투자전략`

        console.log(`  📝 Message Length: ${message.length} chars`)

        // 1. Image
        console.log('  📸 Creating banner...')
        const imageBuffer = await generateMarketBanner(fearGreed.value, crypto.BTC.change)

        if (imageBuffer) {
            console.log('  📤 Sending photo...')
            const form = new FormData()
            form.append('chat_id', CHANNEL_ID)
            form.append('photo', imageBuffer, { filename: 'banner.png' })
            form.append('caption', '📊 오늘의 시장 센티먼트 - TRAN Trading Lab')

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: form.getHeaders(),
                body: form
            })
        }

        // 2. Text
        console.log('  📝 Sending text...')
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

        console.log(`  📝 Response Status: ${resText.status} ${resText.statusText}`);
        const rawText = await resText.text();
        console.log('  📝 Raw Response:', rawText.slice(0, 200)); // Print first 200 chars

        let result;
        try {
            result = JSON.parse(rawText);
        } catch (e) {
            console.error('  ❌ JSON Parse Error:', e.message);
            return;
        }

        if (result.ok) {
            console.log('  ✅ Text Result: Success');
            console.log(`     Target Chat: "${result.result.chat.title}" (@${result.result.chat.username})`);
            console.log(`     Message ID: ${result.result.message_id}`);
        } else {
            console.log('  ❌ Text Result: ' + result.description);
        }

    } catch (e) {
        console.error('❌ Test Error:', e)
    }
}

runTest()
