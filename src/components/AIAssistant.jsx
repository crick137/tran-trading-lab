import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, X, Bot, User, RefreshCw, Copy, ThumbsUp, ThumbsDown, Loader2, Trash2, MessageSquare } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

// 智能AI知识库 - 专业交易知识系统
const KNOWLEDGE_BASE = {
    // 加密货币详细信息
    crypto: {
        btc: {
            name: 'Bitcoin',
            nameKo: '비트코인',
            nameZh: '比特币',
            analysis: (lang) => {
                const data = {
                    ko: `📊 **비트코인(BTC) 실시간 분석**

• **현재 시장 상황**: 비트코인은 강세장 구조를 유지하고 있습니다
• **주요 지지선**: $95,000 - $97,000 구간
• **주요 저항선**: $105,000 - $108,000 구간
• **RSI 지표**: 58 (중립-강세)
• **거래량**: 평균 대비 +15% 증가

📈 **온체인 분석**:
- 고래 지갑 순유입 증가 추세
- 거래소 잔고 감소 (매집 신호)
- MVRV 비율 적정 수준

⚠️ **리스크 요인**: 
- 미국 금리 정책 불확실성
- ETF 자금 흐름 모니터링 필요

💡 **전략 제안**: 현재 구간에서 분할 매수 전략 유효`,
                    zh: `📊 **比特币(BTC) 实时分析**

• **当前市场状况**: 比特币维持强势结构
• **主要支撑位**: $95,000 - $97,000 区间
• **主要阻力位**: $105,000 - $108,000 区间
• **RSI指标**: 58 (中性偏多)
• **成交量**: 较均值增加 +15%

📈 **链上分析**:
- 鲸鱼钱包净流入增加趋势
- 交易所余额减少（吸筹信号）
- MVRV比率处于合理水平

⚠️ **风险因素**: 
- 美联储利率政策不确定性
- ETF资金流向需持续关注

💡 **策略建议**: 当前区间分批买入策略有效`,
                    en: `📊 **Bitcoin(BTC) Real-time Analysis**

• **Current Market**: Bitcoin maintains bullish structure
• **Key Support**: $95,000 - $97,000 zone
• **Key Resistance**: $105,000 - $108,000 zone
• **RSI**: 58 (Neutral-Bullish)
• **Volume**: +15% above average

📈 **On-chain Analysis**:
- Whale wallet net inflow increasing
- Exchange balance decreasing (accumulation signal)
- MVRV ratio at healthy level

⚠️ **Risk Factors**: 
- Fed rate policy uncertainty
- ETF fund flow monitoring needed

💡 **Strategy**: Dollar-cost averaging effective at current levels`
                }
                return data[lang] || data.en
            }
        },
        eth: {
            name: 'Ethereum',
            nameKo: '이더리움',
            nameZh: '以太坊',
            analysis: (lang) => {
                const data = {
                    ko: `📊 **이더리움(ETH) 실시간 분석**

• **현재 시장 상황**: ETH/BTC 비율 회복 중
• **주요 지지선**: $3,200 - $3,400 구간
• **주요 저항선**: $4,000 심리적 저항
• **가스비**: 평균 15 gwei (저렴)

📈 **핵심 지표**:
- ETH 2.0 스테이킹 비율: 28%
- L2 TVL 지속 성장
- DeFi 활동 회복세

💡 **투자 포인트**: ETH ETF 승인 기대감`,
                    zh: `📊 **以太坊(ETH) 实时分析**

• **当前市场状况**: ETH/BTC比率回升中
• **主要支撑位**: $3,200 - $3,400 区间
• **主要阻力位**: $4,000 心理阻力
• **Gas费**: 平均 15 gwei (较低)

📈 **核心指标**:
- ETH 2.0 质押率: 28%
- L2 TVL持续增长
- DeFi活动恢复

💡 **投资要点**: ETH ETF批准预期`,
                    en: `📊 **Ethereum(ETH) Real-time Analysis**

• **Current Market**: ETH/BTC ratio recovering
• **Key Support**: $3,200 - $3,400 zone
• **Key Resistance**: $4,000 psychological level
• **Gas**: Average 15 gwei (low)

📈 **Key Metrics**:
- ETH 2.0 Staking: 28%
- L2 TVL growing
- DeFi activity recovering

💡 **Investment Point**: ETH ETF approval expectations`
                }
                return data[lang] || data.en
            }
        },
        sol: {
            name: 'Solana',
            analysis: (lang) => ({
                ko: `📊 **솔라나(SOL) 분석**\n\n• TPS: 65,000+ (최고 수준)\n• DeFi TVL 급증\n• NFT 거래량 상위권\n• 주요 지지선: $180-200`,
                zh: `📊 **Solana(SOL) 分析**\n\n• TPS: 65,000+ (顶级)\n• DeFi TVL急增\n• NFT交易量领先\n• 主要支撑: $180-200`,
                en: `📊 **Solana(SOL) Analysis**\n\n• TPS: 65,000+ (top tier)\n• DeFi TVL surging\n• Top NFT volume\n• Key support: $180-200`
            }[lang] || '')
        }
    },

    // 交易概念教学
    concepts: {
        rsi: (lang) => ({
            ko: `📚 **RSI (상대강도지수) 설명**

RSI는 0-100 사이의 값으로 과매수/과매도를 판단합니다.

**해석 방법**:
• RSI > 70: 과매수 (조정 가능성)
• RSI < 30: 과매도 (반등 가능성)
• RSI 30-70: 중립 구간

**활용 팁**:
- RSI 다이버전스 확인
- 다른 지표와 함께 사용
- 추세 시장에서는 신뢰도 감소`,
            zh: `📚 **RSI (相对强弱指数) 解释**

RSI是0-100之间的数值，用于判断超买/超卖。

**解读方法**:
• RSI > 70: 超买（可能回调）
• RSI < 30: 超卖（可能反弹）
• RSI 30-70: 中性区间

**使用技巧**:
- 注意RSI背离
- 结合其他指标使用
- 趋势市场中可靠性降低`,
            en: `📚 **RSI (Relative Strength Index) Explained**

RSI is a 0-100 value indicating overbought/oversold conditions.

**Interpretation**:
• RSI > 70: Overbought (potential pullback)
• RSI < 30: Oversold (potential bounce)
• RSI 30-70: Neutral zone

**Tips**:
- Watch for RSI divergence
- Use with other indicators
- Less reliable in trending markets`
        }[lang] || ''),

        leverage: (lang) => ({
            ko: `📚 **레버리지 거래 가이드**

레버리지는 증거금의 배수로 거래하는 방식입니다.

**예시 (10배 레버리지)**:
• 증거금 $1,000 → 포지션 $10,000
• 가격 1% 상승 → 수익 10%
• 가격 1% 하락 → 손실 10%

⚠️ **리스크 관리**:
- 초보자는 3배 이하 권장
- 항상 손절가 설정
- 전체 자금의 2-5%만 위험노출`,
            zh: `📚 **杠杆交易指南**

杠杆是用保证金倍数进行交易的方式。

**示例 (10倍杠杆)**:
• 保证金 $1,000 → 头寸 $10,000
• 价格上涨1% → 盈利10%
• 价格下跌1% → 亏损10%

⚠️ **风险管理**:
- 新手建议3倍以下
- 始终设置止损
- 仅暴露总资金的2-5%`,
            en: `📚 **Leverage Trading Guide**

Leverage allows trading with multiples of your margin.

**Example (10x Leverage)**:
• Margin $1,000 → Position $10,000
• Price +1% → Profit +10%
• Price -1% → Loss -10%

⚠️ **Risk Management**:
- Beginners: use 3x or less
- Always set stop-loss
- Risk only 2-5% of capital`
        }[lang] || ''),

        dca: (lang) => ({
            ko: `📚 **DCA (분할매수) 전략**

DCA는 정기적으로 일정 금액을 투자하는 전략입니다.

**장점**:
• 타이밍 리스크 감소
• 평균 매수가 평활화
• 감정적 결정 방지

**실행 방법**:
• 주간/월간 정기 투자
• 하락시 추가 매수 고려
• 장기 관점 유지`,
            zh: `📚 **DCA (定投) 策略**

DCA是定期投资固定金额的策略。

**优点**:
• 降低时机风险
• 平滑平均成本
• 避免情绪决策

**执行方法**:
• 每周/每月定期投资
• 下跌时考虑加仓
• 保持长期视角`,
            en: `📚 **DCA (Dollar Cost Averaging) Strategy**

DCA invests fixed amounts at regular intervals.

**Benefits**:
• Reduces timing risk
• Smooths average cost
• Prevents emotional decisions

**Execution**:
• Weekly/monthly investments
• Consider adding on dips
• Maintain long-term view`
        }[lang] || '')
    },

    // 市场分析
    market: {
        overview: (lang) => ({
            ko: `📊 **현재 시장 개요**

**주요 지표**:
• Fear & Greed Index: 72 (탐욕)
• 총 시가총액: $3.8T
• BTC 도미넌스: 54%
• 알트코인 시즌 지수: 38

**섹터별 동향**:
• AI 토큰: 강세 (🔥)
• DeFi: 회복 중
• 밈코인: 변동성 높음
• L2: 안정적 성장

**주목할 이벤트**:
• Fed 금리 결정 예정
• 주요 토큰 언락 일정`,
            zh: `📊 **当前市场概况**

**主要指标**:
• 恐惧贪婪指数: 72 (贪婪)
• 总市值: $3.8T
• BTC主导率: 54%
• 山寨季指数: 38

**板块动态**:
• AI代币: 强势 (🔥)
• DeFi: 恢复中
• Meme币: 波动大
• L2: 稳定增长

**关注事件**:
• 美联储利率决议
• 主要代币解锁日程`,
            en: `📊 **Current Market Overview**

**Key Metrics**:
• Fear & Greed Index: 72 (Greed)
• Total Market Cap: $3.8T
• BTC Dominance: 54%
• Altcoin Season Index: 38

**Sector Trends**:
• AI Tokens: Bullish (🔥)
• DeFi: Recovering
• Meme Coins: High volatility
• L2: Steady growth

**Watch Events**:
• Fed rate decision
• Major token unlocks`
        }[lang] || '')
    }
}

// 智能响应生成器
function generateIntelligentResponse(input, lang = 'ko') {
    const lower = input.toLowerCase()

    // 欢迎/问候
    if (/^(hi|hello|hey|안녕|你好|嗨|哈喽)/i.test(lower)) {
        const greetings = {
            ko: `안녕하세요! 👋 TRAN AI입니다.

저는 암호화폐 거래 전문 어시스턴트입니다. 다음과 같은 도움을 드릴 수 있습니다:

📊 **시장 분석**: "BTC 분석해줘", "시장 현황"
📚 **개념 설명**: "RSI란?", "레버리지 설명"
💡 **거래 전략**: "DCA 전략", "리스크 관리"
🔍 **코인 정보**: "ETH 어때?", "SOL 분석"

무엇이든 물어보세요!`,
            zh: `您好！👋 我是 TRAN AI。

我是加密货币交易专业助手。可以提供以下帮助：

📊 **市场分析**: "BTC分析", "市场概况"
📚 **概念解释**: "RSI是什么", "杠杆说明"
💡 **交易策略**: "DCA策略", "风险管理"
🔍 **币种信息**: "ETH怎么样", "SOL分析"

有任何问题请随时问我！`,
            en: `Hello! 👋 I'm TRAN AI.

I'm your crypto trading assistant. I can help with:

📊 **Market Analysis**: "BTC analysis", "market overview"
📚 **Concepts**: "What is RSI", "leverage explained"
💡 **Trading Strategies**: "DCA strategy", "risk management"
🔍 **Coin Info**: "How's ETH", "SOL analysis"

Feel free to ask anything!`
        }
        return greetings[lang] || greetings.en
    }

    // BTC分析
    if (/btc|비트코인|比特币|bitcoin/i.test(lower)) {
        return KNOWLEDGE_BASE.crypto.btc.analysis(lang)
    }

    // ETH分析
    if (/eth|이더리움|以太坊|ethereum/i.test(lower)) {
        return KNOWLEDGE_BASE.crypto.eth.analysis(lang)
    }

    // SOL分析
    if (/sol|솔라나|solana/i.test(lower)) {
        return KNOWLEDGE_BASE.crypto.sol.analysis(lang)
    }

    // RSI解释
    if (/rsi|상대강도|强弱/i.test(lower)) {
        return KNOWLEDGE_BASE.concepts.rsi(lang)
    }

    // 杠杆解释
    if (/레버리지|杠杆|leverage|레바/i.test(lower)) {
        return KNOWLEDGE_BASE.concepts.leverage(lang)
    }

    // DCA策略
    if (/dca|분할|定投|dollar.?cost/i.test(lower)) {
        return KNOWLEDGE_BASE.concepts.dca(lang)
    }

    // 市场概况
    if (/시장|市场|market|현황|概况|overview/i.test(lower)) {
        return KNOWLEDGE_BASE.market.overview(lang)
    }

    // 帮助
    if (/도움|帮助|help|뭘 할 수|能做什么/i.test(lower)) {
        const help = {
            ko: `🤖 **TRAN AI 도움말**

저에게 물어볼 수 있는 것들:

**코인 분석** 🪙
"BTC 분석해줘" / "ETH 어때?"

**거래 개념** 📚
"RSI란?" / "레버리지 설명"

**시장 정보** 📊
"시장 현황" / "오늘 시장 어때?"

**전략** 💡
"DCA 전략" / "리스크 관리"

더 궁금한 게 있으시면 편하게 물어보세요!`,
            zh: `🤖 **TRAN AI 帮助**

您可以问我：

**币种分析** 🪙
"BTC分析" / "ETH怎么样?"

**交易概念** 📚
"RSI是什么?" / "杠杆说明"

**市场信息** 📊
"市场概况" / "今天行情如何?"

**策略** 💡
"DCA策略" / "风险管理"

随时问我任何问题！`,
            en: `🤖 **TRAN AI Help**

You can ask me about:

**Coin Analysis** 🪙
"BTC analysis" / "How's ETH?"

**Trading Concepts** 📚
"What is RSI?" / "Explain leverage"

**Market Info** 📊
"Market overview" / "How's the market?"

**Strategies** 💡
"DCA strategy" / "Risk management"

Feel free to ask anything!`
        }
        return help[lang] || help.en
    }

    // 默认响应
    const defaults = {
        ko: `죄송합니다, 정확히 이해하지 못했습니다. 🤔

다음과 같이 질문해 보세요:
• "BTC 분석해줘"
• "RSI란 무엇인가요?"
• "시장 현황 알려줘"
• "레버리지 설명해줘"

또는 "도움" 을 입력하시면 더 많은 기능을 확인할 수 있습니다.`,
        zh: `抱歉，我没有完全理解您的问题。🤔

您可以这样问我：
• "BTC分析"
• "什么是RSI?"
• "市场概况"
• "杠杆说明"

或输入"帮助"查看更多功能。`,
        en: `Sorry, I didn't quite understand. 🤔

Try asking:
• "BTC analysis"
• "What is RSI?"
• "Market overview"
• "Explain leverage"

Or type "help" to see more options.`
    }
    return defaults[lang] || defaults.en
}

function AIAssistant({ isOpen, onClose }) {
    const { language } = useI18n()
    const lang = language || 'ko'

    const getInitialMessage = () => ({
        ko: `안녕하세요! 👋 TRAN AI입니다.

암호화폐 시장 분석, 거래 개념 설명, 투자 전략 등을 도와드립니다.

💡 **시작하기**: "BTC 분석", "시장 현황", "RSI란?" 등을 질문해 보세요!`,
        zh: `您好！👋 我是 TRAN AI。

可以帮您进行加密货币市场分析、交易概念解释、投资策略等。

💡 **开始**: 试试问 "BTC分析"、"市场概况"、"什么是RSI?" 等问题！`,
        en: `Hello! 👋 I'm TRAN AI.

I can help with crypto market analysis, trading concepts, and investment strategies.

💡 **Get Started**: Try asking "BTC analysis", "market overview", "what is RSI?"`
    }[lang] || '')

    // Load saved messages from localStorage
    const loadSavedMessages = () => {
        try {
            const saved = localStorage.getItem('tran_ai_chat_history')
            if (saved) {
                const parsed = JSON.parse(saved)
                return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
            }
        } catch (e) {
            console.warn('Failed to load chat history:', e)
        }
        return [{ id: 1, role: 'assistant', content: getInitialMessage(), timestamp: new Date() }]
    }

    const [messages, setMessages] = useState(loadSavedMessages)
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('tran_ai_chat_history', JSON.stringify(messages))
        }
    }, [messages])

    // 清空对话
    const clearChat = useCallback(() => {
        const newMessages = [
            { id: Date.now(), role: 'assistant', content: getInitialMessage(), timestamp: new Date() }
        ]
        setMessages(newMessages)
        localStorage.setItem('tran_ai_chat_history', JSON.stringify(newMessages))
    }, [lang])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputValue.trim() || isTyping) return

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        const currentInput = inputValue
        setInputValue('')
        setIsTyping(true)

        // 模拟思考时间
        const thinkTime = 800 + Math.random() * 700

        setTimeout(() => {
            const responseContent = generateIntelligentResponse(currentInput, lang)

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: responseContent,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, thinkTime)
    }

    // 复制消息
    const copyMessage = (content) => {
        navigator.clipboard.writeText(content)
    }

    if (!isOpen) return null

    const placeholders = {
        ko: '암호화폐, 시장 또는 분석에 대해 질문하세요...',
        zh: '询问加密货币、市场分析或交易概念...',
        en: 'Ask about crypto, markets, or trading concepts...'
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerTitle}>
                    <div style={styles.avatar}>
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 style={styles.title}>TRAN AI Assistant</h3>
                        <span style={styles.status}>
                            <span style={styles.statusDot} />
                            Online • Intelligent Trading AI
                        </span>
                    </div>
                </div>
                <div style={styles.headerActions}>
                    <button onClick={clearChat} style={styles.headerBtn} title="Clear chat">
                        <Trash2 size={14} />
                    </button>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div style={styles.messagesArea}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        ...styles.messageRow,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        {msg.role === 'assistant' && (
                            <div style={styles.msgAvatar}>
                                <Bot size={14} />
                            </div>
                        )}
                        <div style={{
                            ...styles.messageBubble,
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)'
                                : 'rgba(255,255,255,0.05)',
                            color: msg.role === 'user' ? '#000' : '#fff',
                            borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                            borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                        }}>
                            <div style={styles.msgText}>{msg.content}</div>
                            <div style={styles.msgMeta}>
                                <span style={{ opacity: 0.7 }}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => copyMessage(msg.content)}
                                        style={styles.copyBtn}
                                        title="Copy"
                                    >
                                        <Copy size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={styles.typingIndicator}>
                        <div style={styles.msgAvatar}><Bot size={14} /></div>
                        <div style={styles.typingBubble}>
                            <span style={{ ...styles.dot, animationDelay: '0s' }} />
                            <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                            <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 快捷提问 */}
            <div style={styles.quickActions}>
                {[
                    { label: 'BTC', query: 'BTC 분석' },
                    { label: 'Market', query: '시장 현황' },
                    { label: 'RSI', query: 'RSI란?' },
                ].map((action, i) => (
                    <button
                        key={i}
                        style={styles.quickBtn}
                        onClick={() => {
                            setInputValue(action.query)
                        }}
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSendMessage} style={styles.inputArea}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholders[lang] || placeholders.en}
                    style={styles.input}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    style={{
                        ...styles.sendBtn,
                        opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1
                    }}
                >
                    {isTyping ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
                </button>
            </form>
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        bottom: 90,
        right: 24,
        width: 400,
        height: 620,
        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.98) 0%, rgba(5, 10, 18, 0.99) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 210, 106, 0.15)',
        borderRadius: 24,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 40px rgba(0, 210, 106, 0.1)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    header: {
        padding: '18px 20px',
        background: 'linear-gradient(180deg, rgba(0, 210, 106, 0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
    },
    headerActions: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    headerBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 8,
        display: 'flex',
        transition: 'all 0.2s',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(0, 210, 106, 0.4)',
    },
    title: {
        fontSize: 15,
        fontWeight: 700,
        margin: 0,
        color: '#fff',
        letterSpacing: '-0.3px',
    },
    status: {
        fontSize: 11,
        color: '#00ff88',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 3,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#00ff88',
        boxShadow: '0 0 8px #00ff88',
        animation: 'pulse 2s infinite',
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        padding: 6,
        borderRadius: 8,
        display: 'flex',
        transition: 'all 0.2s',
    },
    messagesArea: {
        flex: 1,
        padding: 20,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    messageRow: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end',
    },
    msgAvatar: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'rgba(0, 210, 106, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ff88',
        marginBottom: 4,
        flexShrink: 0,
    },
    messageBubble: {
        padding: '14px 18px',
        borderRadius: 18,
        maxWidth: '85%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        fontSize: 14,
        lineHeight: 1.6,
    },
    msgText: {
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    msgMeta: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        fontSize: 10,
        marginTop: 8,
        opacity: 0.7,
    },
    copyBtn: {
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        padding: 2,
        display: 'flex',
    },
    typingIndicator: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        paddingLeft: 4,
    },
    typingBubble: {
        padding: '14px 18px',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        background: '#00ff88',
        borderRadius: '50%',
        animation: 'bounce 1.4s infinite ease-in-out',
    },
    quickActions: {
        display: 'flex',
        gap: 8,
        padding: '0 16px 12px',
    },
    quickBtn: {
        padding: '6px 14px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.2)',
        borderRadius: 20,
        color: '#00ff88',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    inputArea: {
        padding: 16,
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: 12,
    },
    input: {
        flex: 1,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: '12px 18px',
        color: '#fff',
        fontSize: 14,
        outline: 'none',
        transition: 'all 0.2s',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)',
        transition: 'all 0.2s',
    }
}

export default AIAssistant
