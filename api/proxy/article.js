/**
 * Vercel Serverless Function: Article Content Proxy
 * Endpoint: /api/proxy/article?url=<article_url>
 * Fetches and parses article content for in-app reading
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { url } = req.query
    if (!url) {
        return res.status(400).json({ success: false, error: 'URL parameter required' })
    }

    try {
        console.log(`🕷️ Fetching article: ${url}`)

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6'
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`)
        }

        const html = await response.text()

        let title = ''
        let content = ''

        // Extract title from og:title or <title>
        const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        title = ogTitleMatch ? ogTitleMatch[1] : (titleMatch ? titleMatch[1] : '')
        title = title.trim()

        // Site-specific extraction for Korean news sites
        if (url.includes('etoday.co.kr')) {
            // 이투데이
            const articleMatch = html.match(/<div[^>]*class="[^"]*articleView[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*article_copy/i)
                || html.match(/<div[^>]*class="[^"]*newsContent[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
                || html.match(/<div[^>]*id="articleBody"[^>]*>([\s\S]*?)<\/div>/i)
            if (articleMatch) content = articleMatch[1]
        } else if (url.includes('hankyung.com')) {
            // 한국경제
            const articleMatch = html.match(/<div[^>]*id="articletxt"[^>]*>([\s\S]*?)<\/div>/i)
                || html.match(/<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
            if (articleMatch) content = articleMatch[1]
        } else {
            // Generic extraction
            const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
            if (articleMatch) content = articleMatch[1]
        }

        // Fallback: extract all paragraphs
        if (!content || content.length < 100) {
            const paragraphs = []
            const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
            let pMatch
            while ((pMatch = pRegex.exec(html)) !== null) {
                // Clean the paragraph text
                let text = pMatch[1]
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&[a-z]+;/gi, '')
                    .trim()

                // Skip short or junk paragraphs
                if (text.length > 30 &&
                    !text.includes('검색어') &&
                    !text.includes('로그인') &&
                    !text.includes('무단전재') &&
                    !text.includes('저작권')) {
                    paragraphs.push(`<p>${text}</p>`)
                }
            }
            content = paragraphs.slice(0, 30).join('')
        }

        // Clean content
        content = content
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<aside[\s\S]*?<\/aside>/gi, '')
            .replace(/<form[\s\S]*?<\/form>/gi, '')
            .replace(/<button[\s\S]*?<\/button>/gi, '')
            .replace(/<input[^>]*>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<img[^>]*>/gi, '') // Remove images for cleaner reading
            .trim()

        // Final check
        if (!content || content.length < 50) {
            content = '<p style="color: rgba(255,255,255,0.5);">无法自动提取文章内容。请点击右上角按钮查看原文。</p>'
        }

        res.status(200).json({
            success: true,
            data: {
                title,
                content,
                source_url: url
            }
        })
    } catch (error) {
        console.error('Article proxy error:', error.message)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
