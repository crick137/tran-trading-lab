/**
 * Vercel Serverless Function: Korean News RSS Fetcher
 * Endpoint: /api/news/korean
 */

// 한국 금융 뉴스 RSS 소스 (verified working feeds)
const KOREAN_NEWS_FEEDS = [
    // 전체 (All) - 이투데이 종합
    { id: 'etoday-all', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이', category: 'all' },
    // 증권 (Finance/Stocks) - 이투데이 증권·금융
    { id: 'etoday-finance', url: 'https://rss.etoday.co.kr/eto/finance_news.xml', name: '이투데이 증권', category: 'finance' },
    // 경제 (Economy) - 이투데이 경제
    { id: 'etoday-economy', url: 'https://rss.etoday.co.kr/eto/economy_news.xml', name: '이투데이 경제', category: 'economy' },
    // 국제 (Global) - 이투데이 글로벌
    { id: 'etoday-global', url: 'https://rss.etoday.co.kr/eto/global_news.xml', name: '이투데이 국제', category: 'global' },
    // 부동산 (Real Estate) - 이투데이 부동산
    { id: 'etoday-land', url: 'https://rss.etoday.co.kr/eto/land_news.xml', name: '이투데이 부동산', category: 'realestate' },
    // IT/암호화폐 (Crypto/Tech) - 이투데이 IT
    { id: 'etoday-it', url: 'https://rss.etoday.co.kr/eto/it_news.xml', name: '이투데이 IT', category: 'crypto' },
    // 매일경제 헤드라인 (backup)
    { id: 'mk-headline', url: 'https://www.mk.co.kr/rss/30000001/', name: '매일경제', category: 'all' },
]

// 简单的 XML 解析 (无外部依赖)
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
            items.push({
                id: `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
                title,
                summary: description.replace(/<[^>]*>/g, '').slice(0, 200),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category,
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                sentiment: 'neutral'
            })
        }
    }
    return items
}

// Vercel Serverless Handler
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    try {
        console.log('📰 Fetching Korean news from RSS feeds...')
        const allNews = []

        const fetchPromises = KOREAN_NEWS_FEEDS.map(async (feed) => {
            try {
                const response = await fetch(feed.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/rss+xml, application/xml, text/xml'
                    }
                })

                if (!response.ok) {
                    console.warn(`Failed to fetch ${feed.name}: ${response.status}`)
                    return []
                }

                const xml = await response.text()
                const items = parseRssXml(xml, feed)
                console.log(`  ✓ ${feed.name}: ${items.length} items`)
                return items
            } catch (err) {
                console.warn(`Error fetching ${feed.name}:`, err.message)
                return []
            }
        })

        const results = await Promise.all(fetchPromises)
        results.forEach(items => allNews.push(...items))

        // 按日期排序
        allNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        console.log(`📰 Total Korean news fetched: ${allNews.length}`)

        res.status(200).json({
            success: true,
            data: allNews,
            count: allNews.length
        })
    } catch (error) {
        console.error('Korean news API error:', error.message)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
