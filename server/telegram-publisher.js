/**
 * TRAN Trading Lab - Auto News Publisher
 * 매시간 3개 뉴스를 자동으로 Telegram에 발행
 */

import cron from 'node-cron'

// ============================================
// Configuration
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@TranTradingLabNews'

if (!TELEGRAM_BOT_TOKEN) {
    console.error('⚠️ TELEGRAM_BOT_TOKEN environment variable is required')
    process.exit(1)
}

// 扩展的韩国金融新闻源
const EXPANDED_NEWS_FEEDS = [
    // 韩国主流财经媒体
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한국경제 증권', category: '증권' },
    { id: 'hankyung-economy', url: 'https://www.hankyung.com/feed/economy', name: '한국경제 경제', category: '경제' },
    { id: 'hankyung-international', url: 'https://www.hankyung.com/feed/international', name: '한국경제 국제', category: '국제' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이', category: '종합' },

    // 추가 한국 뉴스 소스
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매일경제 경제', category: '경제' },
    { id: 'mk-stock', url: 'https://www.mk.co.kr/rss/30200030/', name: '매일경제 증시', category: '증시' },
    { id: 'sedaily', url: 'https://www.sedaily.com/rss/NewsList/GK', name: '서울경제 경제', category: '경제' },

    // 글로벌 금융 뉴스 (영어)
    { id: 'reuters-business', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best', name: 'Reuters', category: 'Global' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', category: 'Crypto' },
    { id: 'investing-news', url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com', category: 'Global' },
]

// 이미 발행된 뉴스 ID 추적 (중복 방지)
const publishedNewsIds = new Set()

// ============================================
// Telegram API Functions
// ============================================

async function sendTelegramMessage(text, parseMode = 'HTML') {
    if (!TELEGRAM_CHANNEL_ID) {
        console.log('⚠️ TELEGRAM_CHANNEL_ID not set. Message would be:')
        console.log(text)
        return { ok: false, error: 'Channel ID not set' }
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHANNEL_ID,
                text: text,
                parse_mode: parseMode,
                disable_web_page_preview: false
            })
        })

        const result = await response.json()
        if (result.ok) {
            console.log('✅ Telegram message sent successfully')
        } else {
            console.error('❌ Telegram error:', result.description)
        }
        return result
    } catch (error) {
        console.error('❌ Telegram API error:', error.message)
        return { ok: false, error: error.message }
    }
}

// ============================================
// News Fetching & Formatting
// ============================================

function parseRssXml(xml, feedInfo) {
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1]

        const getTagContent = (tag) => {
            const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
            const m = regex.exec(itemXml)
            if (m) return (m[1] || m[2] || '').trim()
            return ''
        }

        const title = getTagContent('title')
        const link = getTagContent('link')
        const description = getTagContent('description')
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            const id = `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`
            items.push({
                id,
                title,
                summary: description.replace(/<[^>]*>/g, '').slice(0, 150),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category,
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
            })
        }
    }
    return items
}

async function fetchAllNews() {
    console.log('📰 Fetching news from all sources...')
    const allNews = []

    const fetchPromises = EXPANDED_NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                signal: AbortSignal.timeout(10000)
            })

            if (!response.ok) {
                console.warn(`  ⚠️ ${feed.name}: HTTP ${response.status}`)
                return []
            }

            const xml = await response.text()
            const items = parseRssXml(xml, feed)
            console.log(`  ✓ ${feed.name}: ${items.length} items`)
            return items
        } catch (err) {
            console.warn(`  ✗ ${feed.name}: ${err.message}`)
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))

    // 按时间排序，最新的在前
    allNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    console.log(`📰 Total news fetched: ${allNews.length}`)
    return allNews
}

function formatNewsForTelegram(newsArray) {
    // 聚合格式：Top 5 新闻列表
    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

    let message = `📰 <b>마켓 뉴스 (Top ${newsArray.length})</b>        ${today}\n\n`

    newsArray.forEach((news, i) => {
        // 截断标题到合适长度
        const shortTitle = news.title.length > 40 ? news.title.slice(0, 40) + '...' : news.title
        // 来源简称
        const shortSource = news.source.replace('한국경제 ', '한경 ').replace('매일경제 ', '매경 ').replace('서울경제 ', '서경 ')

        message += `- ${shortSource} ${shortTitle} <a href="${news.source_url}">원문</a>\n`
    })

    message += `\n#뉴스 #마켓 #TranTradingLab`

    return message
}

function getCategoryEmoji(category) {
    const emojiMap = {
        '증권': '📈',
        '증시': '📊',
        '경제': '💹',
        '국제': '🌍',
        '종합': '📰',
        'Global': '🌐',
        'Crypto': '₿',
    }
    return emojiMap[category] || '📌'
}

// ============================================
// Main Publishing Logic
// ============================================

async function publishNewsToTelegram(count = 5) {
    console.log(`\n🚀 [${new Date().toISOString()}] Starting news publishing job...`)

    try {
        const allNews = await fetchAllNews()

        // 过滤已发布的新闻
        const freshNews = allNews.filter(n => !publishedNewsIds.has(n.id))
        console.log(`📋 Fresh news available: ${freshNews.length}`)

        if (freshNews.length === 0) {
            console.log('ℹ️ No new articles to publish')
            return
        }

        // 选择前N条
        const toPublish = freshNews.slice(0, count)

        // 创建聚合消息
        const message = formatNewsForTelegram(toPublish)
        const result = await sendTelegramMessage(message)

        if (result.ok || !TELEGRAM_CHANNEL_ID) {
            // 标记所有已发布的新闻
            toPublish.forEach(news => publishedNewsIds.add(news.id))
            console.log(`✅ Published aggregated news (${toPublish.length} items)`)
        }

    } catch (error) {
        console.error('❌ Publishing error:', error.message)
    }
}

// ============================================
// Scheduler Setup
// ============================================

function startScheduler() {
    console.log('⏰ Starting Auto News Publisher...')
    console.log(`   Bot Token: ${TELEGRAM_BOT_TOKEN.slice(0, 10)}...`)
    console.log(`   Channel ID: ${TELEGRAM_CHANNEL_ID || '(NOT SET - will only log)'}`)

    // 每小时的第0分钟执行
    cron.schedule('0 * * * *', () => {
        publishNewsToTelegram(3)
    })

    console.log('✅ Scheduler started: Publishing 3 news every hour at :00')
    console.log('💡 Run initial publish now...\n')

    // 立即执行一次
    publishNewsToTelegram(3)
}

// ============================================
// Exports & CLI
// ============================================

export {
    publishNewsToTelegram,
    fetchAllNews,
    sendTelegramMessage,
    startScheduler,
    EXPANDED_NEWS_FEEDS
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
    startScheduler()
}
