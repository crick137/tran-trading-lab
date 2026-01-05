/**
 * 共享的图片生成辅助模块
 * 为所有 Cron 脚本提供统一的 DALL-E 图片生成功能
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

/**
 * 使用 DALL-E 3 生成图片
 * @param {string} prompt - 图片描述 prompt
 * @param {string} type - 图片类型（用于日志区分）
 * @returns {Promise<string|null>} - 返回图片 URL 或 null
 */
export async function generateImage(prompt, type = 'generic') {
    if (!OPENAI_API_KEY) {
        console.error(`❌ [ImageHelper] OPENAI_API_KEY not set. Cannot generate image for: ${type}`)
        return null
    }

    try {
        console.log(`🎨 [ImageHelper] Generating ${type} image...`)

        const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024'
            })
        })

        const json = await res.json()

        if (json.error) {
            console.error(`⚠️ [ImageHelper] DALL-E API Error for ${type}:`, json.error.message)
            return null
        }

        if (json.data?.[0]?.url) {
            console.log(`✅ [ImageHelper] Successfully generated ${type} image`)
            return json.data[0].url
        }

        console.warn(`⚠️ [ImageHelper] DALL-E returned no image data for ${type}`)
        return null

    } catch (e) {
        console.error(`❌ [ImageHelper] Exception during ${type} image generation:`, e.message)
        return null
    }
}

/**
 * 生成市场新闻摘要的横幅图片
 */
export async function generateNewsBanner() {
    const prompt = `A premium financial news header banner. Style: Modern, Bloomberg aesthetic. Theme: Global markets, abstract stock charts, world map. Colors: Dark navy with cyan and gold accents. No text.`
    return generateImage(prompt, 'news-banner')
}

/**
 * 生成晨间简报的横幅图片
 */
export async function generateMorningBanner(fearGreedValue, btcChange) {
    const mood = fearGreedValue <= 25 ? 'stormy, icy blue, frozen assets' :
        fearGreedValue >= 75 ? 'golden sunrise, bursting coins, energetic red' : 'balanced scales, calm dawn, zen garden'
    const trend = btcChange >= 0 ? 'bull running forward' : 'bear standing strong'
    const prompt = `A premium financial morning briefing header. Theme: ${mood}. Subject: Stylized ${trend}. Style: 3D render, Bloomberg, cinematic lighting. No text.`
    return generateImage(prompt, 'morning-briefing')
}

/**
 * 生成晚间总结的横幅图片
 */
export async function generateEveningBanner(btcChange) {
    const mood = btcChange >= 0 ? 'peaceful golden sunset' : 'moody rainy night'
    const prompt = `Premium financial evening summary background. Theme: ${mood}. Style: Cinematic concept art. No text.`
    return generateImage(prompt, 'evening-summary')
}

/**
 * 生成新闻分析的配图
 */
export async function generateNewsImage(title) {
    const prompt = `Editorial illustration for: "${title}". Style: Minimalist, conceptual. No text.`
    return generateImage(prompt, 'news-analysis')
}

/**
 * 生成每日故事的配图
 */
export async function generateStoryImage(btcChange) {
    const theme = btcChange > 0 ? "A golden mechanical bull" : "A gigantic stone bear"
    const prompt = `Fantasy book cover illustration. Subject: ${theme}. Style: Oil painting. No text.`
    return generateImage(prompt, 'market-story')
}
