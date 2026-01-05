/**
 * 📚 TRAN 精选文章翻译 (Curated Article Translation)
 * Vercel Cron: 每天早 7 点 (KST) 执行
 * 
 * 功能: 从英文权威来源抓取一篇高质量金融文章，翻译成韩语发布
 */

import { uploadImageFromUrl, createAnalysisPost } from '../utils/supabaseClient.js'
import { generateNewsImage } from '../utils/imageHelper.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Missing environment variables')

// 候选英文来源 RSS (高质量金融分析)
const CURATED_SOURCES = [
    { id: 'coindesk-features', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', lang: 'en' },
    { id: 'reuters-markets', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best', name: 'Reuters', lang: 'en' },
    { id: 'investing-analysis', url: 'https://www.investing.com/rss/news_301.rss', name: 'Investing.com', lang: 'en' },
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

        if (title && link && description.length > 100) {
            items.push({
                title,
                link,
                description: description.slice(0, 500),
                source: feedInfo.name,
                pubDate: pubDate ? new Date(pubDate).getTime() : Date.now()
            })
        }
    }
    return items
}

async function fetchCandidateArticles() {
    const allArticles = []
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    const fetchPromises = CURATED_SOURCES.map(async (source) => {
        try {
            const res = await fetch(source.url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(8000)
            })
            if (!res.ok) return []
            const xml = await res.text()
            const items = parseRssXml(xml, source)
            return items.filter(item => item.pubDate >= oneDayAgo)
        } catch {
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allArticles.push(...items))

    // 按内容长度排序（倾向于深度文章）
    allArticles.sort((a, b) => b.description.length - a.description.length)
    return allArticles.slice(0, 10) // 取前10篇候选
}

async function selectBestArticle(candidates) {
    if (candidates.length === 0) return null

    const titles = candidates.map((c, i) => `${i + 1}. [${c.source}] ${c.title}`).join('\n')

    const systemPrompt = `당신은 금융 콘텐츠 큐레이터입니다. 아래 후보 중에서 가장 교육적 가치가 높고 인사이트가 풍부한 기사 하나를 선택하세요.`
    const userPrompt = `후보 목록:\n${titles}\n\n가장 좋은 기사 번호만 답하세요 (예: 3)`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.3, max_tokens: 10
            })
        })
        const json = await res.json()
        const answer = json.choices?.[0]?.message?.content?.trim()
        const index = parseInt(answer) - 1
        if (index >= 0 && index < candidates.length) return candidates[index]
    } catch { }

    return candidates[0] // 默认选第一个
}

async function translateArticle(article) {
    const systemPrompt = `당신은 전문 금융 번역가입니다. 영어 기사를 한국어로 번역합니다.
【번역 원칙】
1. 전문 용어(ETF, FOMC 등)는 원어 그대로 유지
2. 자연스러운 한국어 문장 구조로 의역
3. 원문의 논조와 뉘앙스 보존
4. Markdown 형식으로 출력 (H2, 리스트 활용)`

    const userPrompt = `제목: ${article.title}\n\n본문:\n${article.description}\n\n위 영어 기사를 한국어로 번역하세요.`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.5, max_completion_tokens: 2000
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

async function generateTelegramSummary(article, translatedTitle) {
    return `📚 **오늘의 필독 아티클**

📰 ${translatedTitle}

📖 원문: ${article.source}
🔗 ${article.link}

#정선기사 #TranTradingLab`
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('📚 Fetching candidate articles...')
        const candidates = await fetchCandidateArticles()

        if (candidates.length === 0) {
            return res.status(200).json({ message: 'No suitable articles found' })
        }

        console.log(`📋 Found ${candidates.length} candidates, selecting best...`)
        const selected = await selectBestArticle(candidates)

        if (!selected) {
            return res.status(200).json({ message: 'No article selected' })
        }

        console.log(`✅ Selected: ${selected.title}`)

        // 并行: 翻译 + 生成配图
        const [translatedContent, imageUrl] = await Promise.all([
            translateArticle(selected),
            generateNewsImage(selected.title)
        ])

        if (!translatedContent) {
            return res.status(500).json({ error: 'Translation failed' })
        }

        // 解析翻译后的标题
        const lines = translatedContent.split('\n')
        const translatedTitle = lines.find(l => l.startsWith('# ') || l.startsWith('## '))?.replace(/^#+ /, '') || `번역: ${selected.title}`

        // 1. Telegram
        const tgMessage = await generateTelegramSummary(selected, translatedTitle)
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

        // 2. Website
        let savedImageUrl = imageUrl
        if (imageUrl) {
            const permUrl = await uploadImageFromUrl(imageUrl, 'curated-articles')
            if (permUrl) savedImageUrl = permUrl
        }

        await createAnalysisPost({
            title: `📚 ${translatedTitle}`,
            summary: `원문: ${selected.source} | ${selected.title.slice(0, 50)}...`,
            content: translatedContent + `\n\n---\n\n📖 **원문 출처**: [${selected.source}](${selected.link})`,
            category: '精选翻译',
            author: 'TRAN Curator',
            imageUrl: savedImageUrl,
            readTime: '5 min'
        })

        return res.status(200).json({ success: true, article: selected.title })
    } catch (e) {
        console.error('Error:', e)
        return res.status(500).json({ error: e.message })
    }
}
