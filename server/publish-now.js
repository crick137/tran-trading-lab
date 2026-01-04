/**
 * 发布新闻 - 마켓 뉴스 样式（多条新闻合并发送）
 * 格式参考用户示例：列表 + 原文链接 + 自动预览
 */

const TELEGRAM_BOT_TOKEN = '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8'
const CHANNEL_ID = '@TranTradingLabNews'

// 新闻源 - 包含国际财经
const NEWS_FEEDS = [
    // 한국 뉴스
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경', category: '증권' },
    { id: 'hankyung-economy', url: 'https://www.hankyung.com/feed/economy', name: '한경', category: '경제' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이', category: '종합' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경', category: '경제' },

    // 글로벌 뉴스
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', category: '비트코인' },
    { id: 'investing', url: 'https://www.investing.com/rss/news.rss', name: 'Investing', category: 'Global' },
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

        if (title && link) {
            items.push({
                title: title.replace(/\s+/g, ' ').trim(),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category
            })
        }
    }
    return items
}

async function fetchNews() {
    console.log('📰 뉴스 가져오는 중...')
    const allNews = []

    for (const feed of NEWS_FEEDS) {
        try {
            const res = await fetch(feed.url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(8000)
            })
            if (res.ok) {
                const xml = await res.text()
                const items = parseRssXml(xml, feed)
                allNews.push(...items)
                console.log(`  ✓ ${feed.name}: ${items.length}개`)
            }
        } catch (e) {
            console.log(`  ✗ ${feed.name}: ${e.message}`)
        }
    }

    return allNews
}

// 发送消息（带链接预览）
async function sendMessage(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHANNEL_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false  // 开启链接预览（显示第一个链接的图片）
        })
    })
    return res.json()
}

async function publishMarketNews(count = 5) {
    console.log(`\n🚀 마켓 뉴스 (Top ${count}) 발행 시작...\n`)

    const news = await fetchNews()
    console.log(`\n📋 총 ${news.length}개 뉴스 수집됨`)

    // 选择前N条，确保来源多样化
    const seen = new Set()
    const selected = []

    for (const n of news) {
        // 限制每个来源最多2条
        const sourceCount = selected.filter(s => s.source === n.source).length
        if (sourceCount < 2 && !seen.has(n.title)) {
            selected.push(n)
            seen.add(n.title)
            if (selected.length >= count) break
        }
    }

    // 构建消息 - 마켓 뉴스 样式
    const lines = [`📰 <b>마켓 뉴스 (Top ${count})</b>\n`]

    for (const n of selected) {
        // 格式：- 来源 标题 원문
        lines.push(`- ${n.source} ${n.title} <a href="${n.source_url}">원문</a>`)
    }

    lines.push('')
    lines.push('#뉴스 #마켓 #TranTradingLab')

    const message = lines.join('\n')

    console.log('\n📝 발행할 메시지:')
    console.log('─'.repeat(50))
    console.log(message.replace(/<[^>]*>/g, ''))  // 预览（去除HTML标签）
    console.log('─'.repeat(50))

    const result = await sendMessage(message)

    if (result.ok) {
        console.log(`\n✅ 성공! (Message ID: ${result.result.message_id})`)
    } else {
        console.log(`\n❌ 실패: ${result.description}`)
    }
}

publishMarketNews(5).catch(console.error)
