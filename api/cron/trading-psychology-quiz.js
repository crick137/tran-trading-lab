/**
 * 🧠 TRAN 交易者心理测试
 * Vercel Cron: 每天 15:00 (KST) 执行 = UTC 06:00
 * 频道: @http4477
 * 
 * 每日一个交易心理问题，AI生成答案和解析
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required')
}

// ============================================
// 心理测试题库
// ============================================

const PSYCHOLOGY_TOPICS = [
    {
        category: '손실 처리',
        questions: [
            '당신의 포지션이 20% 손실을 기록하고 있습니다. 첫 번째 반응은?',
            '연속으로 3번 손실 거래를 했습니다. 다음 단계는?',
            '손절선을 설정했지만, 가격이 그 근처에서 움직입니다. 어떻게 하시겠습니까?'
        ]
    },
    {
        category: 'FOMO (공포)',
        questions: [
            '비트코인이 급등하고 있는데, 아직 진입하지 않았습니다. 어떻게 하시겠습니까?',
            '모든 사람이 특정 코인에 투자하고 있다는 뉴스를 봅니다. 반응은?',
            '친구가 큰 수익을 냈다고 자랑합니다. 당신의 감정은?'
        ]
    },
    {
        category: '수익 실현',
        questions: [
            '포지션이 50% 수익을 기록했습니다. 다음 행동은?',
            '목표가에 도달했지만, 더 오를 것 같습니다. 어떻게 하시겠습니까?',
            '작은 수익을 여러 번 실현하는 것 vs 큰 수익을 한 번에 노리는 것, 선호하는 것은?'
        ]
    },
    {
        category: '리스크 관리',
        questions: [
            '한 거래에 총 자산의 몇 %를 투자하시겠습니까?',
            '손실이 계속 커지고 있습니다. 언제 포기하시겠습니까?',
            '레버리지를 사용할 때, 최대 몇 배까지 사용하시겠습니까?'
        ]
    },
    {
        category: '감정 컨트롤',
        questions: [
            '거래 중 가장 어려운 감정은 무엇입니까?',
            '스트레스를 받을 때 어떻게 대처하시겠습니까?',
            '거래 실패 후 어떻게 회복하시겠습니까?'
        ]
    },
    {
        category: '패턴 인식',
        questions: [
            '같은 실수를 반복하는 이유는 무엇이라고 생각하십니까?',
            '과거 거래를 분석할 때 가장 중요하게 보는 것은?',
            '시장 패턴을 인식하는 데 가장 도움이 되는 것은?'
        ]
    }
]

// ============================================
// 获取今日问题
// ============================================

function getTodayQuestion() {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    
    const allQuestions = PSYCHOLOGY_TOPICS.flatMap(topic => 
        topic.questions.map(q => ({ category: topic.category, question: q }))
    )
    
    const questionIndex = dayOfYear % allQuestions.length
    return allQuestions[questionIndex]
}

// ============================================
// AI生成答案和解析
// ============================================

async function generateQuizAnswer(questionData) {
    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    const systemPrompt = `당신은 TRAN Trading Lab의 트레이딩 심리 전문가입니다.
트레이딩 심리 문제에 대해 전문적이고 실용적인 답변을 제공합니다.

【핵심 규칙】
1. 오직 한국어만 사용
2. 심리학적 근거와 실제 트레이딩 경험 결합
3. 구체적이고 실행 가능한 조언
4. "AI", "분석 결과" 같은 단어 사용 금지
5. 공감적이고 이해하기 쉽게`

    const userPrompt = `아래 트레이딩 심리 문제에 대해 전문가 관점에서 답변하세요.

【문제 카테고리】${questionData.category}
【문제】${questionData.question}

【출력 형식】
🧠 TRAN 트레이딩 심리 퀴즈

━━━━━━━━━━━━━━━━━━━━

📋 오늘의 질문

카테고리: ${questionData.category}
질문: ${questionData.question}

━━━━━━━━━━━━━━━━━━━━

💡 전문가 답변

[문제에 대한 전문가의 답변과 조언을 3-4문장으로 작성]

━━━━━━━━━━━━━━━━━━━━

🔍 심리학적 해석

[이 문제가 왜 중요한지, 어떤 심리적 메커니즘이 작용하는지 설명]

━━━━━━━━━━━━━━━━━━━━

✅ 실전 적용 팁

[실제로 어떻게 대처해야 하는지 구체적인 방법 제시]

━━━━━━━━━━━━━━━━━━━━

💭 자기 성찰

[독자가 자신의 반응을 생각해볼 수 있는 질문이나 관점 제시]

━━━━━━━━━━━━━━━━━━━━

📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#트레이딩심리 #심리테스트 #TranTradingLab

【중요】
- 총 길이는 500-700자 정도
- 전문적이지만 이해하기 쉽게
- 구체적인 예시나 방법 포함
- 독자가 자신을 돌아볼 수 있게`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-5.1',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_completion_tokens: 1000
            })
        })

        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || null
    } catch (e) {
        console.error('OpenAI API error:', e.message)
        return null
    }
}

// ============================================
// 发送到Telegram
// ============================================

async function sendToTelegram(message) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHANNEL_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            })
        })

        return await res.json()
    } catch (e) {
        console.error('Telegram send error:', e.message)
        return { ok: false, error: e.message }
    }
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Generating trading psychology quiz...')

        // 获取今日问题
        const questionData = getTodayQuestion()
        console.log('Today question:', questionData)

        // 生成答案
        const answer = await generateQuizAnswer(questionData)

        if (!answer) {
            return res.status(500).json({ error: 'Failed to generate quiz answer' })
        }

        // 发送到Telegram
        const result = await sendToTelegram(answer)

        if (result.ok) {
            console.log('✅ Psychology quiz sent successfully')
            return res.status(200).json({
                success: true,
                messageId: result.result?.message_id,
                category: questionData.category,
                timestamp: new Date().toISOString()
            })
        } else {
            console.error('❌ Telegram send failed:', result.description)
            return res.status(500).json({
                error: 'Failed to send to Telegram',
                details: result.description
            })
        }

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
