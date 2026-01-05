/**
 * Cloud Logic Simulation Test (Deep Dive Article Version)
 */

import FormData from 'form-data'
import fs from 'fs'
import dotenv from 'dotenv'
import { uploadImageFromUrl, createAnalysisPost } from '../api/utils/supabaseClient.js'

dotenv.config()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002815876265'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// ... (Mock Data Helpers - Same as before)
async function getCryptoData() { return { BTC: { price: 95000, change: 1.2 }, ETH: { price: 2800, change: -0.5 }, SOL: { price: 100, change: 2.1 } } }
async function getStockData() { return { 'S&P500': { change: 0.5 }, 'KOSPI': { change: -0.2 } } }
async function getFearGreedIndex() { return { value: 65, change: 5 } }
async function getGlobalCryptoData() { return { btcDominance: '58.5', btcAthChange: '-2.1' } }
async function getTopNews() { return ['비트코인 10만달러 돌파 임박', '연준 금리 인하 시사'] }

// 1. Telegram Version (Short)
async function generateTelegramBriefing(data, news) {
    const { crypto, stocks, fearGreed } = data
    const context = `BTC: $${crypto.BTC?.price} (${crypto.BTC?.change}%)\nS&P500: ${stocks['S&P500']?.change}%\nNews: ${news.join(', ')}`
    const systemPrompt = `당신은 여의도에서 20년 이상 굴러먹은 베테랑 '시황 깎는 노인'입니다. 후배들에게 들려주듯 핵심만 짚어주는 구어체 브리핑을 작성합니다.`
    const userPrompt = `아래 데이터를 보고 1000자 이내의 짧고 굵은 모닝 브리핑을 작성해.\n데이터: ${context}\n형식: ☀️ TRAN 모닝 브리핑\n...`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-5.2', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.85, max_completion_tokens: 1000 })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

// 2. Website Version (Long)
async function generateDeepDiveArticle(data, news) {
    const { crypto, stocks, fearGreed, globalData } = data
    const context = `Global Crypto: BTC Dom ${globalData.btcDominance}%, BTC $${crypto.BTC.price}\nNews: ${news.join('; ')}`

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가(Chief Market Analyst)입니다.
웹사이트에 게재될 **심층 마켓 리서치 리포트(Deep Dive Report)**를 작성합니다.
... (Prompt Identical to Morning Briefing Script) ...`

    const userPrompt = `오늘의 시장 데이터를 기반으로 프리미엄 모닝 리포트를 작성하세요.\n데이터: ${context}`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
                temperature: 0.7,
                max_completion_tokens: 2500
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim()
    } catch { return null }
}

function parseTitle(text) {
    if (!text) return 'Test Article'
    const lines = text.split('\n')
    const header = lines.find(l => l.startsWith('# '))
    return header ? header.replace('# ', '').trim() : 'TRAN Research Insight'
}

async function runTest() {
    console.log('🧪 Starting Dual-Content Generation Test...')

    // Data
    const [crypto, stocks, fearGreed, globalData, news] = await Promise.all([
        getCryptoData(), getStockData(), getFearGreedIndex(), getGlobalCryptoData(), getTopNews()
    ])
    const allData = { crypto, stocks, fearGreed, globalData }

    // Generate Parallel
    console.log('  🧠 Generating Telegram Briefing (Short)...')
    console.log('  🧠 Generating Website Research (Long)...')

    const [tgMessage, webArticle] = await Promise.all([
        generateTelegramBriefing(allData, news),
        generateDeepDiveArticle(allData, news)
    ])

    console.log(`  📝 Telegram Length: ${tgMessage?.length} chars`)
    console.log(`  📝 Website Length: ${webArticle?.length} chars`)

    if (webArticle && webArticle.length > tgMessage.length * 1.5) {
        console.log('  ✅ Content Differentiation Successful: Website content is significantly longer.')
    } else {
        console.warn('  ⚠️ Warning: Website content might be too short.')
    }

    // Save to DB (Website Only for test)
    if (webArticle) {
        console.log('  🌐 Posting Deep Dive to Supabase...')
        const { data, error } = await createAnalysisPost({
            title: parseTitle(webArticle),
            summary: webArticle.slice(0, 150) + '...',
            content: webArticle,
            category: '市场分析',
            author: 'TRAN Research',
            imageUrl: 'https://via.placeholder.com/1024' // Mock image for speed
        })
        if (error) console.error('  ❌ DB Error:', error)
        else console.log('  ✅ DB Success! ID:', data?.id)
    }
}

runTest()
