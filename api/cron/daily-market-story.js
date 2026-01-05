/**
 * 📖 TRAN 每日市场故事 (Premium - Story Mode)
 * Vercel Cron: 每天 21:00 (KST) 执行
 */

import { uploadImageFromUrl, createAnalysisPost } from '../utils/supabaseClient.js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) throw new Error('Missing environment variables')

// ... (Get Market Story Data helper - Keep Same)
async function getMarketStoryData() {
    try {
        const [cryptoRes, fngRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(['BTCUSDT', 'ETHUSDT'])),
            fetch('https://api.alternative.me/fng/?limit=2')
        ])
        const cryptoData = await cryptoRes.json()
        const fngData = await fngRes.json()
        const btc = cryptoData.find(c => c.symbol === 'BTCUSDT')
        return {
            btc: { price: parseFloat(btc.lastPrice), change: parseFloat(btc.priceChangePercent) },
            fng: { value: parseInt(fngData.data[0].value) }
        }
    } catch { return { btc: { price: 95000, change: 0 }, fng: { value: 50 } } }
}

import { generateStoryImage } from '../utils/imageHelper.js'

// generateStoryImage is now imported from imageHelper.js

// 1. Telegram: Just the Story
async function generateShortStory(data) {
    const systemPrompt = `당신은 금융 시장을 의인화한 판타지 소설 작가입니다.`
    const userPrompt = `오늘의 에피소드를 작성해. 상황: 비트코인 $${data.btc.price} (등락 ${data.btc.change}%)\n【출력 형식】\n📖 TRAN 마켓 사가(Saga)\n제 ${Math.floor(Math.random() * 1000)}장: [제목]\n...`
    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-5.2', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.9, max_completion_tokens: 1500 })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

// 2. Website: Story + "Author's Note" (Analysis)
async function generateExtendedStory(data, shortStory) {
    if (!shortStory) return null
    // Nobel Prize Author Persona
    const systemPrompt = `당신은 노벨 문학상을 수상한 소설가이자, 전설적인 헤지펀드 매니저의 이중 생활을 하는 인물입니다.
방금 당신이 쓴 판타지 소설(Market Saga)에 대해, **문학적 비평과 시장 분석이 결합된 '작가의 노트(Author's Note)'**를 작성합니다.

【작성 가이드】
1. **Deconstruct**: 소설 속 '용(Dragon)'이나 '폭풍(Storm)'이 현실 시장의 어떤 매크로 지표(금리, 유동성 등)를 상징하는지 해설하십시오.
2. **Psychology**: 소설 주인공의 고뇌를 통해 현재 투자자들이 겪고 있는 FOMO(놓칠까 봐 두려움)나 FUD(공포) 심리를 심리학적으로 분석하십시오.
3. **Philosophy**: 단순한 투자를 넘어, '시장'이라는 거대한 유기체에 대한 철학적 단상(에세이)을 남기십시오.

형식: Markdown 에세이 스타일. 분량: 공백 포함 1500자 추가.`

    const userPrompt = `
    원문 소설:
    ${shortStory}

    요청:
    위 소설 뒤에 '## 🖋️ 작가의 노트: 현실과 환상의 경계' 섹션을 추가하고, 집필 의도와 시장 해석을 담아 에세이를 완성하십시오.
    `

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.8,
                max_completion_tokens: 1500
            })
        })
        const json = await res.json()
        // Combine Short Story + Author's Note
        const commentary = json.choices?.[0]?.message?.content?.trim()
        return `${shortStory}\n\n---\n\n${commentary}`
    } catch { return shortStory } // Fallback to just story
}

function parseTitle(text) {
    if (!text) return 'TRAN Market Saga'
    const lines = text.split('\n')
    const titleLine = lines.find(l => l.includes('제') && l.includes('장:'))
    if (titleLine) return titleLine.split(':')[1].trim()
    return 'TRAN Market Saga'
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const data = await getMarketStoryData()

        // 1. Generate Base Story & Image
        const [shortStory, imageUrl] = await Promise.all([
            generateShortStory(data),
            generateStoryImage(data.btc.change)
        ])

        if (!shortStory) return res.status(500).json({ error: 'AI generation failed' })

        // 2. Telegram Send
        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST', body: JSON.stringify({ chat_id: CHANNEL_ID, photo: imageUrl, caption: shortStory }), headers: { 'Content-Type': 'application/json' }
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST', body: JSON.stringify({ chat_id: CHANNEL_ID, text: shortStory }), headers: { 'Content-Type': 'application/json' }
            })
        }

        // 3. Website (Extension)
        // We generate the extension *after* sending to TG to ensure TG isn't delayed by the 2nd generation
        const extendedStory = await generateExtendedStory(data, shortStory)

        let savedImageUrl = imageUrl
        if (imageUrl) {
            const permUrl = await uploadImageFromUrl(imageUrl, 'stories')
            if (permUrl) savedImageUrl = permUrl
        }

        const title = parseTitle(shortStory)
        await createAnalysisPost({
            title: title || `📖 마켓 스토리 (${new Date().toLocaleDateString()})`,
            summary: shortStory.slice(0, 150) + '...',
            content: extendedStory,
            category: '市场分析',
            author: 'Fantasy Novelist',
            imageUrl: savedImageUrl,
            readTime: '5 min'
        })

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}
