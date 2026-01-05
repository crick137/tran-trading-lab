/**
 * 🔍 TRAN 뉴스 심층 분석 (Premium - Deep Dive)
 * Vercel Cron: 每天 18:00 (KST) 执行
 */

import { uploadImageFromUrl, createAnalysisPost } from '../utils/supabaseClient.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Environment variables missing')

// ... (News Fetching Logic - Keep Same)
const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-crypto', url: 'https://www.hankyung.com/feed/crypto', name: '한경 코인' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' }
]

function parseRssXml(xml, feedInfo) {
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1]
        const getTagContent = (tag) => {
            const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
            const m = regex.exec(itemXml)
            return m ? (m[1] || m[2] || '').trim() : ''
        }
        const title = getTagContent('title')
        const link = getTagContent('link')
        const description = getTagContent('description')
        const pubDate = getTagContent('pubDate')
        if (title && link) {
            items.push({
                title, link,
                description: description.replace(/<[^>]*>/g, '').slice(0, 200),
                source: feedInfo.name,
                pubDate: pubDate ? new Date(pubDate).getTime() : Date.now()
            })
        }
    }
    return items
}

async function fetchTopNews() {
    const allNews = []
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const fetchPromises = NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) })
            if (!response.ok) return []
            const xml = await response.text()
            const items = parseRssXml(xml, feed)
            return items.filter(item => item.pubDate >= oneDayAgo)
        } catch { return [] }
    })
    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))
    allNews.sort((a, b) => b.pubDate - a.pubDate)
    return allNews.slice(0, 5)
}

function isImportantNews(news) {
    const keywords = ['비트코인', 'BTC', '금리', 'FOMC', 'SEC', 'ETF', '전쟁', '해킹', '규제']
    return keywords.some(k => (news.title + news.description).includes(k))
}

import { generateNewsImage } from '../utils/imageHelper.js'

// generateNewsImage is now imported from imageHelper.js

// 1. Telegram
async function generateTelegramAnalysis(news) {
    const systemPrompt = `당신은 탐사 보도 전문 기자입니다. 뉴스 헤드라인 이면의 진실을 파헤치는 날카로운 분석을 짧게(800자) 작성합니다.`
    const userPrompt = `뉴스: ${news.title}\n내용: ${news.description}\n분석해.`
    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.8, max_completion_tokens: 1000
            })
        })
        return (await res.json()).choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

// 2. Website (Deep Dive)
async function generateDeepDiveReport(news) {
    const systemPrompt = `당신은 TRAN Trading Lab의 수석 지정학/거시경제 연구원입니다.
웹사이트에 구독자 전용으로 게재될 **'Strategic Intelligence' 심층 리포트**를 작성합니다.

【분석 프레임워크: Thinking in Second-Order Effects】
뉴스 헤드라인 자체는 중요하지 않습니다. 그 뉴스가 트리거할 **'나비 효과'**를 시뮬레이션하십시오.

【작성 가이드】
1. **Contextualization**: 이 사건이 2008년 금융위기, 2020년 코로나 등 과거의 어떤 사건과 유사한 패턴(Fractal)을 보이는지 비교 분석하십시오.
2. **Impact Radius**: 이 뉴스가 영향을 미칠 자산군을 명확히 정의(Crypto > Tech Stocks > Emerging Markets 등).
3. **Institutional Perspective**: 블랙록(BlackRock)이나 JP모건의 펀드매니저라면 이 뉴스를 보고 포트폴리오를 어떻게 재조정(Rebalancing) 할지 1인칭 관점에서 서술하십시오.
4. **Scenario Planning**: 
    - Bull Case (낙관 시나리오)
    - Bear Case (비관 시나리오)
    - Base Case (가장 유력한 시나리오)

형식: Markdown Report (H2, H3, 리스트). 분량: 공백 포함 2500자 이상.`

    const userPrompt = `뉴스: ${news.title}\nStrategic Intelligence 리포트를 작성하십시오.`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.65, max_completion_tokens: 3000
            })
        })
        return (await res.json()).choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const topNews = await fetchTopNews()
        if (topNews.length === 0) return res.status(200).json({ message: 'No news' })
        const relevant = topNews.filter(isImportantNews)
        const target = relevant.length > 0 ? relevant[0] : topNews[0]

        const [tgAnalysis, webReport, imageUrl] = await Promise.all([
            generateTelegramAnalysis(target),
            generateDeepDiveReport(target),
            generateNewsImage(target.title)
        ])

        if (!tgAnalysis) return res.status(500).json({ error: 'AI failed' })

        // 1. Telegram
        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST', body: JSON.stringify({ chat_id: TELEGRAM_CHANNEL_ID, photo: imageUrl, caption: tgAnalysis }), headers: { 'Content-Type': 'application/json' }
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST', body: JSON.stringify({ chat_id: TELEGRAM_CHANNEL_ID, text: tgAnalysis }), headers: { 'Content-Type': 'application/json' }
            })
        }

        // 2. Website
        if (webReport) {
            let savedImageUrl = imageUrl
            if (imageUrl) {
                const permUrl = await uploadImageFromUrl(imageUrl, 'news-analysis')
                if (permUrl) savedImageUrl = permUrl
            }

            await createAnalysisPost({
                title: `🔍 ${target.title}`,
                summary: target.description,
                content: webReport,
                category: '市场分析',
                author: 'Deep Dive Investigator',
                imageUrl: savedImageUrl,
                readTime: '8 min'
            })
        }

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}
