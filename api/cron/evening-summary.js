/**
 * 🌙 TRAN 마켓 클로징 서머리 (Premium)
 * Vercel Cron: 매일 저녁 8시 (KST) 자동 실행
 */

import { uploadImageFromUrl, createAnalysisPost } from '../utils/supabaseClient.js'
import { generateAssetComparisonChart } from '../utils/chartHelper.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Missing environment variables')

// ... (Data Fetching Helpers: Same as before)
async function getCryptoData() {
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT']
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(symbols))
        const data = await res.json()
        const result = {}
        for (const item of data) {
            result[item.symbol.replace('USDT', '')] = {
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
            const closes = data.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(c => c !== null)
            const meta = data.chart?.result?.[0]?.meta
            if (closes && closes.length >= 2) {
                const currentPrice = meta.regularMarketPrice || closes[closes.length - 1]
                const prevClose = closes[closes.length - 2]
                result[name] = { price: currentPrice, change: ((currentPrice - prevClose) / prevClose * 100) }
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
    const sorted = Object.entries(crypto).map(([name, data]) => ({ name, ...data })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    return { gainers: sorted.filter(c => c.change > 0).slice(0, 3), losers: sorted.filter(c => c.change < 0).slice(0, 3) }
}

import { generateEveningBanner } from '../utils/imageHelper.js'

// generateEveningBanner is now imported from imageHelper.js

// 1. Telegram: Short, Emotional, "Closing Bell"
async function generateTelegramSummary(data) {
    const { crypto, stocks, movers } = data
    const context = `BTC: $${crypto.BTC?.price} (${crypto.BTC?.change}%)`
    const systemPrompt = `당신은 하루의 전투를 끝내고 퇴근길 맥주 한잔을 기울이는 '여의도 차트쟁이'입니다. 짧게(800자 이내) 오늘 하루를 회고합니다.`
    const userPrompt = `오늘 장 마감 브리핑을 작성해. 데이터: ${context}`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-5.2', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.8, max_completion_tokens: 1000 })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

// 2. Website: Detailed Market Wrap Article
async function generateMarketWrapArticle(data) {
    const { crypto, stocks, fearGreed, movers } = data
    const context = `
    Closing Prices: BTC $${crypto.BTC?.price}, ETH $${crypto.ETH?.price}, SOL $${crypto.SOL?.price}
    Top Gainers: ${movers.gainers.map(g => g.name).join(', ')}
    Top Losers: ${movers.losers.map(l => l.name).join(', ')}
    Sentiment: ${fearGreed.value}
    `
    // Institutional Grade Wrap
    const systemPrompt = `당신은 TRAN Trading Lab의 시니어 마켓 에디터입니다.
웹사이트용 **'Daily Market Wrap (Institutional)'** 리포트를 작성합니다.

【핵심 원칙】
1. **De-AI Style**: "시장은 변동성을 보였습니다" 같은 뻔한 문장 금지. 대신 "S&P500이 4300선을 위협하며 VIX가 3% 급등했습니다"처럼 구체적 팩트로 서술.
2. **Causality**: '가격이 올랐다'가 아니라 '왜 올랐고(Why), 이것이 무엇을 의미하는지(So What)'에 집중.
3. **Sector Rotation**: 자금이 어디에서 어디로 이동했는지(예: AI 테마 -> Layer 2) 자금 흐름(Flow) 중심 분석.

【필수 섹션】
1. **Daily Snapshot**: 오늘의 시장 승자/패자 요약 및 투심(Sentiment) 변화.
2. **Key Narrative**: 오늘 시장을 지배한 단 하나의 내러티브 분석 (예: ETF 승인 루머, 금리 동결 기대 등).
3. **On-Chain Signals**: (가상의 데이터를 논리적으로 구성하여) 고래들의 지갑 이동, 펀딩비 추이 등 온체인 관점의 해석.
4. **Tomorrow's Alpha**: 내일 주목해야 할 코인이나 섹터, 주요 경제 일정.

분량: **공백 포함 2000자 이상**. Markdown 사용.`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Write the Daily Market Wrap based on: ${context}` }],
                temperature: 0.6,
                max_completion_tokens: 2500
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

function parseTitle(text) {
    if (!text) return `마켓 마감 리포트 (${new Date().toLocaleDateString()})`
    const lines = text.split('\n')
    const header = lines.find(l => l.startsWith('# '))
    if (header) return header.replace('# ', '').trim()
    return `TRAN Daily Wrap: ${new Date().toLocaleDateString()}`
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const [crypto, stocks, fearGreed] = await Promise.all([getCryptoData(), getStockData(), getFearGreedIndex()])
        const movers = await getTopMovers(crypto)
        const allData = { crypto, stocks, fearGreed, movers }

        const [tgMessage, webArticle, imageUrl] = await Promise.all([
            generateTelegramSummary(allData),
            generateMarketWrapArticle(allData),
            generateEveningBanner(crypto.BTC?.change || 0)
        ])

        // 1. Telegram
        if (tgMessage) {
            const tgParam = imageUrl ? {
                chat_id: CHANNEL_ID, photo: imageUrl, caption: tgMessage
            } : { chat_id: CHANNEL_ID, text: tgMessage }
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${imageUrl ? 'sendPhoto' : 'sendMessage'}`, {
                method: 'POST', body: JSON.stringify(tgParam), headers: { 'Content-Type': 'application/json' }
            })

            // 1b. Asset Comparison Chart
            const assetChanges = {
                'BTC': crypto.BTC?.change || 0,
                'ETH': crypto.ETH?.change || 0,
                'SOL': crypto.SOL?.change || 0,
                'XRP': crypto.XRP?.change || 0,
                'BNB': crypto.BNB?.change || 0
            }
            const chartUrl = generateAssetComparisonChart(assetChanges)
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: chartUrl,
                    caption: '📊 오늘의 암호화폐 성적표'
                })
            })
        }

        // 2. Website
        if (webArticle) {
            let savedImageUrl = imageUrl
            if (imageUrl) {
                const permUrl = await uploadImageFromUrl(imageUrl, 'evening-summary')
                if (permUrl) savedImageUrl = permUrl
            }
            const title = parseTitle(webArticle)

            await createAnalysisPost({
                title: title,
                summary: webArticle.slice(0, 200) + '...',
                content: webArticle,
                category: '市场分析',
                author: 'TRAN Research',
                imageUrl: savedImageUrl,
                readTime: '6 min'
            })
        }

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}
