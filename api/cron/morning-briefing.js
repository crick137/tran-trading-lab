/**
 * 🌅 TRAN 얼티밋 마켓 브리핑 v5 (Cloud Version - Premium)
 * Vercel Cron: 매일 아침 8시 (KST) 자동 실행
 */

import FormData from 'form-data'
import { uploadImageFromUrl, createAnalysisPost } from '../utils/supabaseClient.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Missing environment variables')

// ... (Data Fetching Helpers: getCryptoData, getStockData, etc. KEEP SAME)
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
                volume: parseFloat(data.quoteVolume) / 1e9
            }
        }
        return result
    } catch { return { BTC: { price: 95000, change: 0, volume: 1 } } }
}

async function getStockData() {
    const symbols = { 'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11', 'VIX': '^VIX', 'DXY': 'DX-Y.NYB', '삼성전자': '005930.KS' }
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

async function getGlobalCryptoData() {
    try {
        const [global, btc] = await Promise.all([
            fetch('https://api.coingecko.com/api/v3/global').then(r => r.json()),
            fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false').then(r => r.json())
        ])
        return {
            btcDominance: global.data?.market_cap_percentage?.btc?.toFixed(1) || '50',
            btcAthChange: btc.market_data?.ath_change_percentage?.usd?.toFixed(1) || '-10'
        }
    } catch { return { btcDominance: '50', btcAthChange: '-10' } }
}

const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-crypto', url: 'https://www.hankyung.com/feed/crypto', name: '한경 코인' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' }
]

async function getTopNews() {
    try {
        const allNews = []
        const parseRSS = (xml, sourceName) => {
            const items = []
            const regex = /<item>([\s\S]*?)<\/item>/g
            let match
            while ((match = regex.exec(xml)) !== null) {
                const itemContent = match[1]
                const titleMatch = /<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>/.exec(itemContent)
                if (titleMatch) items.push({ title: titleMatch[1].trim(), source: sourceName })
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
        return allNews.slice(0, 5).map(n => n.title)
    } catch { return [] }
}

import { generateMorningBanner } from '../utils/imageHelper.js'

// generateMarketBanner is now imported from imageHelper.js

// 1. Telegram: Short, Chatty, "Briefing"
async function generateTelegramBriefing(data, news) {
    const { crypto, stocks, fearGreed } = data
    const context = `BTC: $${crypto.BTC?.price} (${crypto.BTC?.change}%)\nS&P500: ${stocks['S&P500']?.change}%\nNews: ${news.join(', ')}`

    // "Yeouido Veteran" Persona
    const systemPrompt = `당신은 여의도에서 20년 이상 굴러먹은 베테랑 '시황 깎는 노인'입니다. 후배들에게 들려주듯 핵심만 짚어주는 구어체 브리핑을 작성합니다.`
    const userPrompt = `아래 데이터를 보고 1000자 이내의 짧고 굵은 모닝 브리핑을 작성해.\n데이터: ${context}\n형식: ☀️ TRAN 모닝 브리핑\n...`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.85, max_completion_tokens: 1000
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

// 2. Website: Long, Professional, "Research Article"
async function generateDeepDiveArticle(data, news) {
    const { crypto, stocks, fearGreed, globalData } = data
    const context = `
    Global Crypto: BTC Dom ${globalData.btcDominance}%, BTC $${crypto.BTC?.price} (${crypto.BTC?.change}%)
    Indices: S&P500 ${stocks['S&P500']?.change}%, VIX ${stocks['VIX']?.price}
    Sentiment: ${fearGreed.value}
    Key News: ${news.join('; ')}
    `

    // "Research Institute" Persona - High Intellectual Standard
    const systemPrompt = `당신은 TRAN Trading Lab의 수석 전략가(Chief Strategist)입니다.
웹사이트에 구독자 전용으로 게재될 **'Institutional Grade' 모닝 리포트**를 작성합니다.

【품질 원칙 (Quality Control)】
1. **No Fluff**: '투자는 신중해야 합니다', '지켜봐야 합니다' 같은 무의미한 조언 금지.
2. **Data-First**: 모든 주장은 제공된 데이터(BTC 도미넌스, VIX, 금리 등)에 기반해야 함.
3. **Second-Order Thinking**: 단순한 가격 변동 서술을 넘어, 그것이 시장 참여자의 심리와 파생상품 시장에 미칠 연쇄 효과를 분석.
4. **Professional Tone**: 블룸버그/월스트리트저널의 사설(Editorial) 톤. 건조하지만 날카롭게.
5. **Structure**:
    - **Executive Summary**: 3분 안에 읽을 수 있는 핵심 요약 (Bullet points).
    - **Macro Linkage**: 거시경제 변수(달러, 국채금리)와 크립토의 상관관계 해설.
    - **Technical Deep Dive**: 주요 지지/저항 레벨과 차트 패턴 분석 (가상의 시나리오라도 논리적으로).
    - **Actionable Strategy**: 변동성 돌파, 저점 매수, 리스크 헤징 등 구체적 전략 제시.

글의 분량은 **공백 포함 2500자 내외**로 작성하며, 가독성을 위해 Markdown H2, H3, Bold 처리를 적극 활용하십시오.`

    const userPrompt = `오늘의 시장 데이터를 기반으로 심층 리포트를 작성하세요.\n데이터: ${context}`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.5, // Lower temperature for more analytical/grounded output
                max_completion_tokens: 3000
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

function parseTitle(text) {
    if (!text) return `마켓 리서치 리포트 (${new Date().toLocaleDateString()})`
    // Try to find a markdown header
    const lines = text.split('\n')
    const header = lines.find(l => l.startsWith('# '))
    if (header) return header.replace('# ', '').trim()
    // Or just generating a title based on date
    return `TRAN 모닝 인사이트: ${new Date().toLocaleDateString()}`
}

function extractSummary(text) {
    // Try to find Executive Summary section
    // Or just take first 200 chars
    return text.slice(0, 200) + '...'
}

// 3. Audio: Podcast Generation
async function generatePodcastScript(data, news) {
    const context = `BTC: $${data.crypto.BTC?.price}, News: ${news.join(', ')}`
    const systemPrompt = `당신은 'TRAN 모닝 라디오'의 호스트입니다.
텍스트를 읽는 게 아니라, **청취자에게 말하듯이** 자연스러운 라디오 스크립트를 작성합니다.
- 오프닝: 활기찬 아침 인사와 오늘의 핵심 키워드.
- 본론: 시장 상황을 대화하듯 편안하게 전달.
- 클로징: 청취자의 성공 투자를 기원하는 멘트.
분량: 읽었을 때 1분 30초 분량 (약 400-500자).`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `라디오 스크립트 작성해줘. 데이터: ${context}` }],
                temperature: 0.8
            })
        })
        return (await res.json()).choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

async function generateAudio(text) {
    if (!text) return null
    try {
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tts-1-hd', // High Definition
                input: text,
                voice: 'onyx' // Deep, authoritative male voice
            })
        })
        const buffer = await res.arrayBuffer()
        return Buffer.from(buffer)
    } catch { return null }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const [crypto, stocks, fearGreed, globalData, news] = await Promise.all([
            getCryptoData(), getStockData(), getFearGreedIndex(), getGlobalCryptoData(), getTopNews()
        ])
        const allData = { crypto, stocks, fearGreed, globalData }

        // Parallel Generation: Telegram + Website + Image + Podcast Script
        const [tgMessage, webArticle, imageUrl, podcastScript] = await Promise.all([
            generateTelegramBriefing(allData, news),
            generateDeepDiveArticle(allData, news),
            generateMorningBanner(fearGreed.value, crypto.BTC.change),
            generatePodcastScript(allData, news)
        ])

        // Audio Synthesis (Sequential to save prompt tokens/rate limits if needed, but okay in parallel usually)
        const audioBuffer = await generateAudio(podcastScript)

        if (!tgMessage && !webArticle) return res.status(500).json({ error: 'AI generation failed' })

        // 1. Telegram
        if (tgMessage) {
            const tgParam = imageUrl ? {
                chat_id: CHANNEL_ID, photo: imageUrl, caption: tgMessage
            } : { chat_id: CHANNEL_ID, text: tgMessage }
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${imageUrl ? 'sendPhoto' : 'sendMessage'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tgParam)
            })
        }

        // 2. Website
        if (webArticle) {
            let savedImageUrl = imageUrl
            if (imageUrl) {
                const permUrl = await uploadImageFromUrl(imageUrl, 'morning-briefs')
                if (permUrl) savedImageUrl = permUrl
            }

            let savedAudioUrl = null
            if (audioBuffer) {
                // Generate unique filename
                const filename = `morning-briefs/audio_${Date.now()}.mp3`
                // Dynamic Import Supabase Client to use server key
                const { createClient } = await import('@supabase/supabase-js')
                const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

                // Upload to 'images' bucket (or a dedicated audio bucket if you prefer, but 'images' usually public)
                // Assuming 'images' bucket allows audio files or is generally public. 
                // If strictly image only, we might fail. Let's try 'images' bucket first as it's set up. (or 'media' if existing)
                const { data: audioData, error: audioError } = await sb.storage
                    .from('images')
                    .upload(filename, audioBuffer, { contentType: 'audio/mpeg', upsert: false })

                if (!audioError) {
                    const { data: publicData } = sb.storage.from('images').getPublicUrl(filename)
                    savedAudioUrl = publicData.publicUrl
                }
            }

            const title = parseTitle(webArticle)
            const summary = extractSummary(webArticle)

            await createAnalysisPost({
                title: title,
                summary: summary,
                content: webArticle,
                category: '市场分析',
                author: 'TRAN Research',
                imageUrl: savedImageUrl,
                readTime: '8 min',
                audio_url: savedAudioUrl // Save Audio URL
            })
        }

        return res.status(200).json({ success: true, website_posted: !!webArticle })

    } catch (e) {
        console.error('Error:', e)
        return res.status(500).json({ error: e.message })
    }
}
