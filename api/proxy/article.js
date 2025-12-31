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

        // Simple content extraction
        let title = ''
        let content = ''

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        if (titleMatch) {
            title = titleMatch[1].trim()
        }

        // Extract main content (simplified extraction)
        // Try common article selectors
        const contentPatterns = [
            /<article[^>]*>([\s\S]*?)<\/article>/i,
            /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
            /<div[^>]*id="article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
            /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        ]

        for (const pattern of contentPatterns) {
            const match = html.match(pattern)
            if (match && match[1] && match[1].length > 200) {
                content = match[1]
                break
            }
        }

        // Fallback: extract all paragraphs
        if (!content || content.length < 100) {
            const paragraphs = []
            const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
            let pMatch
            while ((pMatch = pRegex.exec(html)) !== null) {
                const text = pMatch[1].replace(/<[^>]*>/g, '').trim()
                if (text.length > 30) {
                    paragraphs.push(`<p>${text}</p>`)
                }
            }
            content = paragraphs.slice(0, 20).join('')
        }

        // Clean content
        content = content
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<aside[\s\S]*?<\/aside>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')

        if (!content || content.length < 50) {
            content = '<p>无法自动提取文章内容，请点击右上角按钮查看原文。</p>'
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
