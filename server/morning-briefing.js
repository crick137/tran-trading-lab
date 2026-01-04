/**
 * 🌅 TRAN 얼티밋 마켓 브리핑 v5
 * Gemini AI 배너 이미지 생성 + 모든 프리미엄 기능
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TELEGRAM_BOT_TOKEN = '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8'
const CHANNEL_ID = '@TranTradingLabNews'
const GROQ_API_KEY = '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'

// Gemini API Key (https://aistudio.google.com/apikey 에서 무료 발급)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'

// AI 생성 배너 이미지 (로컬 파일)
const BANNER_IMAGE_PATH = path.join(__dirname, 'banner.png')

// ============================================
// Gemini 이미지 생성 (Imagen)
// ============================================

async function generateMarketBanner(fearGreedValue, btcChange) {
    // Gemini API Key가 없으면 스킵
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        console.log('  ℹ️ Gemini API Key 없음 - 기본 차트 사용')
        return null
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

        // Gemini 2.0 Flash를 사용한 이미지 생성 (Imagen 3)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp-image-generation',
        })

        // 시장 상태에 따른 프롬프트 결정
        const mood = fearGreedValue <= 25 ? 'dramatic dark stormy bearish' :
            fearGreedValue >= 75 ? 'bright golden bullish celebration' : 'calm neutral balanced'
        const trend = btcChange >= 0 ? 'upward trending green' : 'downward trending red'

        const prompt = `A professional crypto market dashboard banner image. ${mood} mood with ${trend} visual elements. Abstract Bitcoin chart visualization with candlesticks. Futuristic digital art style with neon glow effects. Dark background with blue and gold accents. No text. 16:9 horizontal aspect ratio.`

        console.log('  🎨 Gemini 이미지 생성 중...')

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseModalities: ['image', 'text'],
            }
        })

        const response = result.response
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)

        if (imagePart?.inlineData?.data) {
            // base64 이미지를 파일로 저장
            const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
            fs.writeFileSync(BANNER_IMAGE_PATH, imageBuffer)
            console.log('  ✓ AI 배너 이미지 생성 완료')
            return BANNER_IMAGE_PATH
        }
    } catch (e) {
        console.log('  ✗ Gemini 이미지 생성 실패:', e.message)
    }
    return null
}

// ============================================
// 차트 이미지 생성
// ============================================

// TradingView 미니 차트 URL (실시간)
function getTradingViewChartUrl(symbol = 'BTCUSDT', interval = 'D') {
    // TradingView의 무료 스냅샷 위젯 사용
    return `https://www.tradingview.com/x/snapshot/?symbol=BINANCE:${symbol}&interval=${interval}&width=800&height=400`
}

// Alternative.me 공포/탐욕 차트
function getFearGreedChartUrl() {
    return 'https://alternative.me/crypto/fear-and-greed-index.png'
}

// ============================================
// 1. 암호화폐 데이터 (Binance)
// ============================================

async function getCryptoData() {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
    const result = {}

    for (const sym of symbols) {
        try {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`)
            const data = await res.json()
            result[sym.replace('USDT', '')] = {
                price: parseFloat(data.lastPrice),
                change: parseFloat(data.priceChangePercent),
                high: parseFloat(data.highPrice),
                low: parseFloat(data.lowPrice),
                volume: parseFloat(data.quoteVolume) / 1e9
            }
        } catch (e) { }
    }
    return result
}

// ============================================
// 2. 선물 데이터 - 펀딩비, 미결제약정 (Binance Futures)
// ============================================

async function getFuturesData() {
    try {
        // 펀딩비
        const fundingRes = await fetch('https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=1')
        const fundingData = await fundingRes.json()

        // 미결제약정
        const oiRes = await fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT')
        const oiData = await oiRes.json()

        return {
            fundingRate: (parseFloat(fundingData[0]?.fundingRate || 0) * 100).toFixed(4),
            openInterest: (parseFloat(oiData?.openInterest || 0) / 1000).toFixed(1) // 천 BTC 단위
        }
    } catch (e) {
        return { fundingRate: '0.01', openInterest: '200' }
    }
}

// ============================================
// 3. 글로벌 증시 (Yahoo Finance)
// ============================================

async function getStockData() {
    const symbols = {
        'S&P500': '^GSPC', 'NASDAQ': '^IXIC', 'KOSPI': '^KS11',
        'VIX': '^VIX', 'DXY': 'DX-Y.NYB',
        '삼성전자': '005930.KS', 'SK하이닉스': '000660.KS'
    }
    const result = {}

    for (const [name, sym] of Object.entries(symbols)) {
        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            const data = await res.json()
            const meta = data.chart?.result?.[0]?.meta

            if (meta) {
                const price = meta.regularMarketPrice
                const prevClose = meta.previousClose || meta.chartPreviousClose
                result[name] = {
                    price,
                    change: prevClose ? ((price - prevClose) / prevClose * 100) : 0
                }
            }
        } catch (e) { }
    }
    return result
}

// ============================================
// 4. 공포/탐욕 지수 (Alternative.me)
// ============================================

async function getFearGreedIndex() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2')
        const data = await res.json()
        if (data.data?.length >= 2) {
            return {
                value: parseInt(data.data[0].value),
                text: data.data[0].value_classification,
                change: parseInt(data.data[0].value) - parseInt(data.data[1].value)
            }
        }
    } catch (e) { }
    return { value: 50, text: 'Neutral', change: 0 }
}

// ============================================
// 5. 글로벌 크립토 데이터 (CoinGecko)
// ============================================

async function getGlobalCryptoData() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/global')
        const data = await res.json()

        // BTC ATH 데이터
        const btcRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false')
        const btcData = await btcRes.json()

        return {
            btcDominance: data.data?.market_cap_percentage?.btc?.toFixed(1) || '50',
            totalMarketCap: (data.data?.total_market_cap?.usd / 1e12).toFixed(2) || '2.5',
            btcAth: btcData?.market_data?.ath?.usd || 108000,
            btcAthChange: btcData?.market_data?.ath_change_percentage?.usd?.toFixed(1) || '-15'
        }
    } catch (e) {
        return { btcDominance: '50', totalMarketCap: '2.5', btcAth: 108000, btcAthChange: '-15' }
    }
}

// ============================================
// 6. 환율 (ECB via Frankfurter)
// ============================================

async function getForexData() {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD')
        const data = await res.json()
        return { KRW: data.rates.KRW || 1450, JPY: data.rates.JPY || 150 }
    } catch (e) {
        return { KRW: 1450, JPY: 150 }
    }
}

// ============================================
// 7. 최신 뉴스 헤드라인 (RSS)
// ============================================

async function getTopNews() {
    try {
        const res = await fetch('https://www.hankyung.com/feed/finance', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        const xml = await res.text()

        const items = []
        const regex = /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>[\s\S]*?<\/item>/g
        let match
        while ((match = regex.exec(xml)) !== null && items.length < 3) {
            items.push(match[1].trim())
        }
        return items
    } catch (e) {
        return ['시장 뉴스를 불러오는 중...']
    }
}

// ============================================
// 8. 고급 시장 분석 (Groq AI)
// ============================================

async function generateAnalysis(data) {
    try {
        const { crypto, stocks, fearGreed, globalData, futures, forex } = data
        const btc = crypto.BTC
        const vix = stocks.VIX?.price || 15
        const fundingRate = parseFloat(futures.fundingRate)

        // 시장 상태 판단
        const marketState = fearGreed.value <= 25 ? '극단적 공포' :
            fearGreed.value >= 75 ? '극단적 탐욕' : '중립'
        const fundingState = fundingRate > 0.05 ? '롱 과열' :
            fundingRate < -0.01 ? '숏 과열' : '균형'

        const prompt = `【시장 데이터】
BTC: $${btc?.price?.toLocaleString()} (${btc?.change?.toFixed(1)}%), ATH 대비 ${globalData.btcAthChange}%
펀딩비: ${futures.fundingRate}%, 미결제약정: ${futures.openInterest}K BTC
S&P500: ${stocks['S&P500']?.change?.toFixed(1)}%, VIX: ${vix.toFixed(1)}
공포/탐욕: ${fearGreed.value}/100, 원/달러: ₩${forex.KRW?.toLocaleString()}

【요청】
위 데이터를 바탕으로 5문장의 시장 분석을 작성하세요.

1문장: 현재 시장 상황 요약 (예: "글로벌 증시 강세 속 비트코인은 조정 국면")
2문장: 펀딩비 ${futures.fundingRate}%가 의미하는 것 (롱/숏 포지션 상황)
3문장: 공포/탐욕 ${fearGreed.value}과 VIX ${vix.toFixed(1)} 조합 해석
4문장: BTC 지지선($${btc?.low?.toLocaleString()})과 저항선($${btc?.high?.toLocaleString()})
5문장: 투자자가 오늘 취해야 할 전략

규칙: 숫자 필수 언급, 전문적이면서 이해하기 쉽게, "AI/분석결과" 단어 금지`

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 삼성자산운용 출신 CIO입니다. 한국 투자자에게 프라이빗 뱅킹 수준의 시장 분석을 제공합니다. 항상 구체적인 숫자와 명확한 논리로 설명합니다.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 600
            })
        })

        if (!response.ok) {
            console.log('API 응답 오류:', response.status, response.statusText)
            return getDefaultAnalysis()
        }

        const result = await response.json()
        let analysis = result.choices?.[0]?.message?.content?.trim() || ''

        // AI 관련 표현 제거
        analysis = analysis.replace(/AI|인공지능|분석 결과|데이터에 따르면|알고리즘/g, '')

        return analysis || getDefaultAnalysis()
    } catch (e) {
        console.log('분석 오류:', e.message)
        return getDefaultAnalysis()
    }
}

function getDefaultAnalysis() {
    return '시장은 현재 균형점을 찾아가는 과정에 있습니다. 주요 지표들의 방향성을 확인한 후 포지션 조정을 고려하시기 바랍니다.'
}

// ============================================
// 포맷팅 유틸리티
// ============================================

const fmt = (p, d = 2) => typeof p === 'number' ? (p >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: d }) : p.toFixed(d)) : '-'
const chg = (c) => typeof c === 'number' ? `${c >= 0 ? '▲+' : '▼'}${c.toFixed(2)}%` : ''
const fgEmoji = (v) => v <= 25 ? '😱 극단적 공포' : v <= 45 ? '😰 공포' : v <= 55 ? '😐 중립' : v <= 75 ? '😊 탐욕' : '🤑 극단적 탐욕'

function getKoreaDateTime() {
    return new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
        hour: '2-digit', minute: '2-digit'
    })
}

// ============================================
// 메시지 생성
// ============================================

async function generateBriefing() {
    console.log('📊 데이터 수집 중...')

    const [crypto, stocks, forex, fearGreed, globalData, futures, news] = await Promise.all([
        getCryptoData(),
        getStockData(),
        getForexData(),
        getFearGreedIndex(),
        getGlobalCryptoData(),
        getFuturesData(),
        getTopNews()
    ])

    console.log('  ✓ 암호화폐, 증시, 환율, 심리지수, 선물, 뉴스 수집 완료')

    const allData = { crypto, stocks, forex, fearGreed, globalData, futures }

    console.log('📝 분석 작성 중...')
    const analysis = await generateAnalysis(allData)

    const btc = crypto.BTC
    const vix = stocks.VIX
    const dxy = stocks.DXY

    let message = `☀️ <b>TRAN 얼티밋 마켓 브리핑</b>
📅 ${getKoreaDateTime()}

━━━━━━━━━━━━━━━━━━━━

📰 <b>오늘의 헤드라인</b>
${news.map((n, i) => `${i + 1}. ${n.slice(0, 40)}${n.length > 40 ? '...' : ''}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

🌡️ <b>시장 센티먼트</b>
• 공포/탐욕: <b>${fearGreed.value}</b> ${fgEmoji(fearGreed.value)} (${fearGreed.change >= 0 ? '+' : ''}${fearGreed.change})
• VIX: ${vix?.price?.toFixed(2)} ${vix?.price < 15 ? '(낮음)' : vix?.price < 25 ? '(보통)' : '(높음)'}
• 달러인덱스: ${dxy?.price?.toFixed(2)} ${chg(dxy?.change)}

━━━━━━━━━━━━━━━━━━━━

📊 <b>글로벌 증시</b>
• S&P500: ${fmt(stocks['S&P500']?.price)} ${chg(stocks['S&P500']?.change)}
• NASDAQ: ${fmt(stocks.NASDAQ?.price)} ${chg(stocks.NASDAQ?.change)}
• KOSPI: ${fmt(stocks.KOSPI?.price)} ${chg(stocks.KOSPI?.change)}

🇰🇷 <b>한국 대표주</b>
• 삼성전자: ₩${fmt(stocks['삼성전자']?.price, 0)} ${chg(stocks['삼성전자']?.change)}
• SK하이닉스: ₩${fmt(stocks['SK하이닉스']?.price, 0)} ${chg(stocks['SK하이닉스']?.change)}

━━━━━━━━━━━━━━━━━━━━

₿ <b>비트코인 심층 분석</b>
• 현재가: <b>$${fmt(btc?.price)}</b> ${chg(btc?.change)}
• 24h 범위: $${fmt(btc?.low)} ~ $${fmt(btc?.high)}
• ATH 대비: ${globalData.btcAthChange}% (ATH: $${fmt(globalData.btcAth, 0)})
• 24h 거래량: $${btc?.volume?.toFixed(1)}B

📈 <b>선물 시장</b>
• 펀딩비: ${futures.fundingRate}% ${parseFloat(futures.fundingRate) > 0.05 ? '(롱 과열)' : parseFloat(futures.fundingRate) < -0.01 ? '(숏 과열)' : '(중립)'}
• 미결제약정: ${futures.openInterest}K BTC

💰 <b>크립토 시장</b>
• BTC 도미넌스: ${globalData.btcDominance}%
• 전체 시가총액: $${globalData.totalMarketCap}T
• ETH: $${fmt(crypto.ETH?.price)} ${chg(crypto.ETH?.change)}
• SOL: $${fmt(crypto.SOL?.price)} ${chg(crypto.SOL?.change)}

━━━━━━━━━━━━━━━━━━━━

💱 <b>환율</b>
• 원/달러: ₩${fmt(forex.KRW, 0)}
• 엔/달러: ¥${fmt(forex.JPY, 1)}

━━━━━━━━━━━━━━━━━━━━

💡 <b>시장 분석</b>

${analysis}

━━━━━━━━━━━━━━━━━━━━

📊 <b>차트 바로가기</b>
• <a href="https://www.tradingview.com/chart/?symbol=BINANCE:BTCUSDT">BTC 차트</a> | <a href="https://www.tradingview.com/chart/?symbol=KRX:005930">삼성전자</a> | <a href="https://www.tradingview.com/chart/?symbol=KRX:KOSPI">KOSPI</a>

━━━━━━━━━━━━━━━━━━━━

📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

<i>📊 출처: Binance, Yahoo Finance, CoinGecko, Alternative.me, ECB
※ 투자 참고용이며, 투자 결정은 본인 책임입니다.</i>

#시장분석 #비트코인 #KOSPI #투자전략`

    return message.trim()
}

// ============================================
// 발행
// ============================================

async function sendBriefing() {
    console.log('\n☀️ 얼티밋 마켓 브리핑 v4 발행 시작...\n')

    const message = await generateBriefing()

    console.log('\n' + '─'.repeat(50))
    console.log(message.replace(/<[^>]*>/g, '').slice(0, 1500) + '...')
    console.log('─'.repeat(50))

    // 1. 배너 이미지 전송
    console.log('\n🎨 배너 이미지 전송 중...')

    // 고정 배너 이미지 URL (GitHub 또는 Cloudinary 호스팅 권장)
    // 현재는 공포/탐욕 지수 차트 사용
    const bannerUrl = getFearGreedChartUrl()

    try {
        const photoRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                photo: bannerUrl,
                caption: '📊 오늘의 시장 센티먼트 - TRAN Trading Lab'
            })
        })
        const photoResult = await photoRes.json()
        console.log(photoResult.ok ? '  ✓ 배너 이미지 전송 완료' : `  ✗ 배너 전송 실패: ${photoResult.description}`)
    } catch (e) {
        console.log('  ✗ 이미지 전송 오류:', e.message)
    }

    // 2. 텍스트 브리핑 전송
    console.log('\n📝 브리핑 메시지 전송 중...')
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHANNEL_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        })
    })

    const result = await res.json()
    console.log(result.ok ? `\n✅ 발행 완료! (ID: ${result.result.message_id})` : `\n❌ 실패: ${result.description}`)
}

sendBriefing().catch(console.error)
