/**
 * 💬 TRAN 新闻 AI 评论 (News Commentary)
 * Vercel Cron: 每 4 小时执行
 * 
 * 功能: 抓取最新金融新闻，AI 生成专业评论和市场情绪判断
 */

import { createClient } from '@supabase/supabase-js'
import { generateNewsImage } from '../utils/imageHelper.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Missing environment variables')

// 韩国财经新闻源
const NEWS_SOURCES = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-crypto', url: 'https://www.hankyung.com/feed/crypto', name: '한경 코인' },
    { id: 'mk-stock', url: 'https://www.mk.co.kr/rss/30200030/', name: '매경 증시' },
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
        const description = getTagContent('description').replace(/<[^>]*>/g, '')
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            items.push({
                title,
                link,
                description: description.slice(0, 300),
                source: feedInfo.name,
                pubDate: pubDate ? new Date(pubDate).getTime() : Date.now()
            })
        }
    }
    return items
}

async function fetchLatestNews() {
    const allNews = []
    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000

    const fetchPromises = NEWS_SOURCES.map(async (source) => {
        try {
            const res = await fetch(source.url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(8000)
            })
            if (!res.ok) return []
            const xml = await res.text()
            const items = parseRssXml(xml, source)
            return items.filter(item => item.pubDate >= fourHoursAgo)
        } catch {
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))

    // 按时间排序
    allNews.sort((a, b) => b.pubDate - a.pubDate)
    return allNews.slice(0, 5) // 取最新5条
}

function isImportantNews(news) {
    const keywords = ['비트코인', 'BTC', '금리', 'FOMC', 'SEC', 'ETF', '전쟁', '해킹', '규제', '파산', '급등', '급락', 'Fed', '인플레이션']
    return keywords.some(k => (news.title + news.description).includes(k))
}

async function generateCommentary(news) {
    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 애널리스트입니다.
뉴스에 대해 간결하고 날카로운 AI 코멘터리를 작성합니다.

【출력 형식】
1. 💬 **한줄평**: 15자 이내의 핵심 인사이트
2. 📊 **분석** (100자): 이 뉴스가 시장에 미칠 영향 분석
3. 🎯 **시그널**: 🟢매수기회 / 🔴리스크 / ⚪관망
4. ⭐ **중요도**: 1-5 (별표로 표시)

JSON 형식으로 출력하세요:
{"oneliner": "...", "analysis": "...", "signal": "green/red/neutral", "importance": 3}`

    const userPrompt = `뉴스 제목: ${news.title}\n내용: ${news.description}\n\n위 뉴스에 대해 코멘터리를 작성하세요.`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.7, max_tokens: 500
            })
        })
        const json = await res.json()
        const content = json.choices?.[0]?.message?.content?.trim()

        // Parse JSON response
        const parsed = JSON.parse(content)
        return parsed
    } catch (e) {
        console.error('Commentary generation failed:', e.message)
        return null
    }
}

function formatTelegramMessage(news, commentary) {
    const signalEmoji = commentary.signal === 'green' ? '🟢매수기회' :
        commentary.signal === 'red' ? '🔴리스크' : '⚪관망'
    const stars = '⭐'.repeat(commentary.importance)

    return `📰 **${news.title}**

💬 ${commentary.oneliner}

📊 ${commentary.analysis}

🎯 시그널: ${signalEmoji}
${stars} 중요도

🔗 [원문](${news.link})

#뉴스분석 #AI코멘터리 #TranTradingLab`
}

async function saveCommentary(news, commentary) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    await supabase.from('news_commentary').insert({
        title: news.title,
        source: news.source,
        source_url: news.link,
        oneliner: commentary.oneliner,
        analysis: commentary.analysis,
        signal: commentary.signal,
        importance: commentary.importance,
        created_at: new Date().toISOString()
    })
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('📰 Fetching latest news...')
        const allNews = await fetchLatestNews()

        if (allNews.length === 0) {
            return res.status(200).json({ message: 'No recent news' })
        }

        // 优先处理重要新闻
        const important = allNews.filter(isImportantNews)
        const target = important.length > 0 ? important[0] : allNews[0]

        console.log(`📝 Generating commentary for: ${target.title}`)
        const commentary = await generateCommentary(target)

        if (!commentary) {
            return res.status(500).json({ error: 'Commentary generation failed' })
        }

        // 生成配图
        const imageUrl = await generateNewsImage(target.title)

        // 1. Telegram
        const tgMessage = formatTelegramMessage(target, commentary)
        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHANNEL_ID, photo: imageUrl, caption: tgMessage, parse_mode: 'Markdown' })
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHANNEL_ID, text: tgMessage, parse_mode: 'Markdown' })
            })
        }

        // 2. Save to Database
        await saveCommentary(target, commentary)

        return res.status(200).json({
            success: true,
            news: target.title,
            signal: commentary.signal,
            importance: commentary.importance
        })
    } catch (e) {
        console.error('Error:', e)
        return res.status(500).json({ error: e.message })
    }
}
