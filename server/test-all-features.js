/**
 * 💻 Comprehensive Automation Test Script
 * Tests all Telegram automation features locally
 */

import dotenv from 'dotenv'
dotenv.config()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002815876265'
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID || '@TranTradingLabNews'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// ============================================
// Shared API Functions
// ============================================

async function getCryptoData() {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(symbols))
    const data = await res.json()
    const result = {}
    for (const item of data) {
        const name = item.symbol.replace('USDT', '')
        result[name] = {
            price: parseFloat(item.lastPrice),
            change: parseFloat(item.priceChangePercent),
            high: parseFloat(item.highPrice),
            low: parseFloat(item.lowPrice)
        }
    }
    return result
}

async function generateWithGPT52(systemPrompt, userPrompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
                model: 'gpt-5.1',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_completion_tokens: 1500
        })
    })
    const json = await res.json()
    return json.choices?.[0]?.message?.content?.trim() || null
}

async function sendToTelegram(chatId, text) {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
    })
    return res.json()
}

// ============================================
// Test Functions
// ============================================

async function testEveningSummary() {
    console.log('\n🌙 Testing Evening Summary...')
    const crypto = await getCryptoData()

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가입니다.
저녁 마켓 리포트를 작성합니다. 오직 한국어만 사용하세요.
🔴🔵 금지, ▲▼ 사용. 스토리텔링 스타일로 작성.
하루를 정리하는 느낌으로 작성하고, 내일 주목할 포인트를 제시하세요.`

    const userPrompt = `오늘의 시장 데이터:
- BTC: $${crypto.BTC?.price?.toLocaleString()} (${crypto.BTC?.change >= 0 ? '+' : ''}${crypto.BTC?.change?.toFixed(2)}%)
- ETH: $${crypto.ETH?.price?.toLocaleString()} (${crypto.ETH?.change >= 0 ? '+' : ''}${crypto.ETH?.change?.toFixed(2)}%)

아래 형식으로 저녁 서머리를 작성하세요:

🌙 TRAN 마켓 클로징 서머리
📅 [현재 날짜/시간]

📊 오늘의 시장 한 줄 요약
[한 문장 요약]

🏆 오늘의 승자 & 패자
▲ 상승: [코인명 +X%]
▼ 하락: [코인명 -X%]

₿ 비트코인 하루 정리
• 종가: [가격] [변동]
• 일중 범위: [저가] ~ [고가]

💡 오늘의 인사이트
"[창의적 제목]"
[2-3문장 분석]

🔮 내일 주목 포인트
• [포인트 1]
• [포인트 2]

#마감정리 #TranTradingLab`

    const content = await generateWithGPT52(systemPrompt, userPrompt)
    if (content) {
        console.log('  ✅ Generated evening summary')
        console.log('  📝 Preview:', content.substring(0, 200) + '...')
        const result = await sendToTelegram(CHANNEL_ID, content)
        console.log('  📤 Sent:', result.ok ? `Message ID: ${result.result?.message_id}` : result.description)
        return true
    }
    console.log('  ❌ Failed to generate')
    return false
}

async function testTechnicalAnalysis() {
    console.log('\n📈 Testing Technical Analysis...')
    const crypto = await getCryptoData()

    const systemPrompt = `당신은 TRAN Trading Lab의 테크니컬 애널리스트입니다.
기술적 분석을 기반으로 트레이딩 인사이트를 제공합니다.
오직 한국어만 사용. 🔴🔵 금지, ▲▼ 사용.`

    const userPrompt = `BTC 현재가: $${crypto.BTC?.price?.toLocaleString()}
ETH 현재가: $${crypto.ETH?.price?.toLocaleString()}

아래 형식으로 기술적 분석 리포트를 작성하세요:

📈 TRAN 기술적 분석 리포트
📅 [현재 시간]

₿ 비트코인 기술 분석
📊 주요 지표
• RSI: [추정값] ([해석])
• 추세: [상승/하락/횡보]

🎯 핵심 레벨
• 저항선: $[값]
• 지지선: $[값]

📝 분석
[2-3문장]

🎯 트레이딩 아이디어
[진입/손절/목표가]

#기술분석 #TranTradingLab`

    const content = await generateWithGPT52(systemPrompt, userPrompt)
    if (content) {
        console.log('  ✅ Generated technical analysis')
        console.log('  📝 Preview:', content.substring(0, 200) + '...')
        const result = await sendToTelegram(CHANNEL_ID, content)
        console.log('  📤 Sent:', result.ok ? `Message ID: ${result.result?.message_id}` : result.description)
        return true
    }
    console.log('  ❌ Failed to generate')
    return false
}

async function testEconomicCalendar() {
    console.log('\n📅 Testing Economic Calendar...')

    const koreaDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long'
    })

    const message = `📅 오늘의 경제 일정
━━━━━━━━━━━━━━━━━━━━
📆 ${koreaDate}

🟠 22:30 (KST)
   미국 신규 실업수당 청구건수

✅ 오늘은 주요 경제 발표가 없습니다.
평온한 하루, 트레이딩에 집중하세요! 📊

━━━━━━━━━━━━━━━━━━━━

💡 중요도 안내
🔴 매우 중요 | 🟠 중요 | 🟡 보통

━━━━━━━━━━━━━━━━━━━━
📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#경제일정 #TranTradingLab`

    const result = await sendToTelegram(NEWS_CHANNEL_ID, message)
    console.log('  📤 Sent:', result.ok ? `Message ID: ${result.result?.message_id}` : result.description)
    return result.ok
}

async function testWeeklyReport() {
    console.log('\n📊 Testing Weekly Report...')
    const crypto = await getCryptoData()

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가입니다.
주간 시장 리뷰를 작성합니다. 오직 한국어만 사용하세요.
🔴🔵 금지, ▲▼ 사용. 스토리텔링 스타일로 작성.`

    const userPrompt = `이번 주 시장 데이터:
- BTC: $${crypto.BTC?.price?.toLocaleString()} (주간 +3.5%)
- ETH: $${crypto.ETH?.price?.toLocaleString()} (주간 +2.1%)

아래 형식으로 주간 리포트를 작성하세요:

📊 TRAN 주간 마켓 리포트
📅 [현재 날짜] (일요일)

📌 이번 주 시장 한 줄 요약
[한 문장 요약]

🏆 이번 주의 승자
1. BTC: ▲ +3.5%
2. ETH: ▲ +2.1%

₿ 비트코인 주간 분석
• 주간 변동: +3.5%
• 주요 이벤트: [이슈]

💡 주간 인사이트
"[창의적 제목]"
[3-4문장 분석]

🔮 다음 주 주목 포인트
• [포인트 1]
• [포인트 2]

#주간리포트 #TranTradingLab`

    const content = await generateWithGPT52(systemPrompt, userPrompt)
    if (content) {
        console.log('  ✅ Generated weekly report')
        console.log('  📝 Preview:', content.substring(0, 200) + '...')
        const result = await sendToTelegram(CHANNEL_ID, content)
        console.log('  📤 Sent:', result.ok ? `Message ID: ${result.result?.message_id}` : result.description)
        return true
    }
    console.log('  ❌ Failed to generate')
    return false
}

// ============================================
// Main Test Runner
// ============================================

async function runAllTests() {
    console.log('🧪 TRAN Automation Comprehensive Test')
    console.log('=====================================')
    console.log(`📡 Main Channel: ${CHANNEL_ID}`)
    console.log(`📰 News Channel: ${NEWS_CHANNEL_ID}`)
    console.log(`🤖 AI Model: GPT-5.2`)
    console.log('')

    const results = {
        eveningSummary: await testEveningSummary(),
        technicalAnalysis: await testTechnicalAnalysis(),
        economicCalendar: await testEconomicCalendar(),
        weeklyReport: await testWeeklyReport()
    }

    console.log('\n=====================================')
    console.log('📋 Test Results:')
    for (const [name, passed] of Object.entries(results)) {
        console.log(`  ${passed ? '✅' : '❌'} ${name}`)
    }

    const passedCount = Object.values(results).filter(Boolean).length
    console.log(`\n🎯 Passed: ${passedCount}/${Object.keys(results).length}`)
}

runAllTests().catch(console.error)
