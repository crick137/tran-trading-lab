import React from 'react'
import { BookOpen, TrendingUp, AlertTriangle, Calculator, Target, Shield, Lightbulb, ArrowLeft } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

// 凯利公式教育文章组件
const KellyArticle = ({ onBack, onOpenSimulator }) => {
    const { language } = useI18n()

    // 多语言文章内容
    const content = {
        ko: {
            title: '왜 승률 60%인데 계좌는 0원이 될까?',
            subtitle: '자금 관리의 비밀',
            intro: `많은 트레이더들이 완벽한 진입 시점(Entry)을 찾기 위해 차트를 분석합니다. 하지만 전설적인 수학자들과 퀀트 펀드 매니저들은 차트보다 **'이 공식'**을 먼저 봅니다.\n\n오늘은 카지노와 월스트리트에서 살아남는 유일한 생존 법칙, **켈리 공식(The Kelly Criterion)**에 대해 이야기하겠습니다.`,

            section1Title: '1. 트레이딩은 도박인가, 투자인가?',
            section1Content: `당신에게 승률 60%의 동전 던지기 게임을 제안한다고 가정해 봅시다.\n\n• 앞면이 나오면 건 돈의 2배를 줍니다.\n• 뒷면이 나오면 건 돈을 모두 잃습니다.\n\n당신은 전 재산의 얼마를 거시겠습니까?\n\n**100%?** 만약 한 번이라도 뒷면이 나오면 당신은 파산합니다.\n**1%?** 너무 적어서 부자가 되는 데 평생이 걸릴 것입니다.\n\n이 **'얼마를 걸 것인가(Position Sizing)'**에 대한 수학적 정답이 바로 켈리 공식입니다.`,

            section2Title: '2. 켈리 공식 (The Math)',
            section2Content: `복잡해 보이지만 원리는 간단합니다. 당신의 우위(Edge)만큼만 베팅하라는 것입니다.`,
            formula: 'f* = (bp - q) / b',
            formulaDesc: [
                { label: 'f* (최적 베팅 비율)', desc: '당신이 이번 거래에 투입해야 할 자본의 %' },
                { label: 'b (손익비, Odds)', desc: '이길 때 얻는 수익 / 질 때 잃는 손실 (예: 3배 수익이면 b=3)' },
                { label: 'p (승률)', desc: '이길 확률 (예: 40%면 0.4)' },
                { label: 'q (패율)', desc: '질 확률 (1 - p)' }
            ],

            section3Title: '3. 실전 예시 (Case Study)',
            section3Content: `TranTradingLab의 추세 추종 전략을 예로 들어봅시다.\n\n• 승률 (p): 40% (0.4)\n• 손익비 (b): 3:1 (3.0)\n\n공식에 대입해 봅시다:\n\nf* = (3 × 0.4 - 0.6) / 3 = (1.2 - 0.6) / 3 = 0.2\n\n**결과:** 수학적으로 당신은 자본의 **20%**를 베팅해야 자산이 가장 빠르게 증가합니다.`,

            section4Title: '4. 탐욕의 함정: 왜 "풀 켈리"를 쓰지 않는가?',
            section4Content: `계산상 20%가 나왔다고 해서 실제로 20%를 베팅하는 것은 위험합니다. 이를 '풀 켈리(Full Kelly)' 전략이라고 합니다.\n\n**높은 변동성:** 풀 켈리는 수익이 극대화되지만, 계좌가 반토막(-50%) 나는 일도 빈번하게 발생합니다. 대부분의 트레이더는 멘탈이 무너져 전략을 포기하게 됩니다.\n\n**추정의 오류:** 당신이 계산한 승률 40%는 과거 데이터일 뿐입니다. 미래 시장 상황이 변하여 승률이 조금이라도 떨어지면, 20% 베팅은 '파산'으로 이어질 수 있습니다.`,

            section5Title: '5. TranTradingLab의 조언: "하프 켈리"',
            section5Content: `우리는 하프 켈리 전략을 권장합니다. 공식으로 계산된 값의 **절반(50%)**만 베팅하는 것입니다.\n\n위 예시의 경우: 20% × 0.5 = **10%**\n\n**장점:** 수익률은 풀 켈리의 75% 수준을 유지하면서, 파산 위험(Risk of Ruin)은 0%에 수렴하게 만듭니다.`,
            quote: '"트레이딩의 제1원칙은 돈을 버는 것이 아니라, 살아남는 것입니다."',

            section6Title: '6. 요약 (Action Plan)',
            section6Content: '내일부터 거래를 시작하기 전에 이 3단계를 따르십시오.',
            actionSteps: [
                { step: '1', title: '자신의 기록을 확인하라', desc: '최근 50회의 거래에서 승률과 평균 손익비를 계산하십시오.' },
                { step: '2', title: 'f*를 계산하라', desc: '켈리 공식을 사용하여 이론적 최대 베팅 비율을 구하십시오.' },
                { step: '3', title: '반으로 줄여라', desc: '계산된 값의 절반 이하로만 진입하십시오. 이것이 당신의 안전벨트입니다.' }
            ],

            ctaBtn: '시뮬레이터로 직접 실험해보기 →',
            footer: 'TranTradingLab | Financial Logic Studio'
        },
        zh: {
            title: '为什么胜率60%账户还是会归零？',
            subtitle: '资金管理的秘密',
            intro: `很多交易者为了找到完美的入场时机而分析图表。但传奇数学家和量化基金经理们在看图表之前，会先看**「这个公式」**。\n\n今天我们来聊聊在赌场和华尔街生存的唯一法则——**凯利公式(The Kelly Criterion)**。`,

            section1Title: '1. 交易是赌博还是投资？',
            section1Content: `假设有人给你一个胜率60%的抛硬币游戏：\n\n• 正面朝上，你赢得下注金额的2倍\n• 反面朝上，你失去全部下注金额\n\n你会拿你全部资产的多少来下注？\n\n**100%？** 如果有一次反面朝上，你就破产了。\n**1%？** 太少了，你需要一辈子才能变富。\n\n**「该下注多少」(Position Sizing)** 的数学答案，就是凯利公式。`,

            section2Title: '2. 凯利公式 (The Math)',
            section2Content: `看起来复杂，但原理很简单：只下注你的优势那么多。`,
            formula: 'f* = (bp - q) / b',
            formulaDesc: [
                { label: 'f* (最优下注比例)', desc: '你这笔交易应该投入的资金百分比' },
                { label: 'b (盈亏比, Odds)', desc: '赢时收益 / 输时损失（例如：3倍收益则b=3）' },
                { label: 'p (胜率)', desc: '获胜概率（例如：40%则为0.4）' },
                { label: 'q (败率)', desc: '失败概率（1 - p）' }
            ],

            section3Title: '3. 实战案例 (Case Study)',
            section3Content: `以TranTradingLab的趋势跟踪策略为例：\n\n• 胜率 (p): 40% (0.4)\n• 盈亏比 (b): 3:1 (3.0)\n\n代入公式：\n\nf* = (3 × 0.4 - 0.6) / 3 = (1.2 - 0.6) / 3 = 0.2\n\n**结果：** 从数学上看，你应该下注资金的**20%**来实现资产最快增长。`,

            section4Title: '4. 贪婪的陷阱：为什么不用"满仓凯利"？',
            section4Content: `计算出20%并不意味着你就该真的下注20%。这叫"满仓凯利(Full Kelly)"策略。\n\n**高波动性：** 满仓凯利虽然收益最大化，但账户经常会腰斩(-50%)。大多数交易者会心态崩溃、放弃策略。\n\n**估算误差：** 你计算的40%胜率只是历史数据。未来市场变化，胜率稍微下降，20%下注就可能导致「破产」。`,

            section5Title: '5. TranTradingLab建议："半凯利"',
            section5Content: `我们推荐半凯利策略：只下注公式计算结果的**一半(50%)**。\n\n上面的例子：20% × 0.5 = **10%**\n\n**优点：** 保持满凯利75%的收益率，同时将破产风险(Risk of Ruin)降到接近0%。`,
            quote: '"交易的第一原则不是赚钱，而是活下去。"',

            section6Title: '6. 总结 (Action Plan)',
            section6Content: '从明天开始交易前，请遵循这3个步骤：',
            actionSteps: [
                { step: '1', title: '检查你的记录', desc: '计算最近50笔交易的胜率和平均盈亏比。' },
                { step: '2', title: '计算f*', desc: '使用凯利公式计算理论最大下注比例。' },
                { step: '3', title: '减半', desc: '只用计算结果一半以下的仓位进场。这是你的安全带。' }
            ],

            ctaBtn: '用模拟器亲自实验 →',
            footer: 'TranTradingLab | Financial Logic Studio'
        },
        en: {
            title: 'Why Does a 60% Win Rate Still Lead to Zero?',
            subtitle: 'The Secret of Money Management',
            intro: `Many traders spend hours analyzing charts to find the perfect entry. But legendary mathematicians and quant fund managers look at **'this formula'** before any chart.\n\nToday, let's talk about the only survival rule in casinos and Wall Street — **The Kelly Criterion**.`,

            section1Title: '1. Is Trading Gambling or Investing?',
            section1Content: `Imagine someone offers you a coin flip game with 60% odds:\n\n• Heads: You win 2x your bet\n• Tails: You lose everything you bet\n\nHow much of your total wealth would you bet?\n\n**100%?** If the coin lands tails even once, you're bankrupt.\n**1%?** Too little — it would take a lifetime to get rich.\n\nThe mathematical answer to **"how much to bet" (Position Sizing)** is the Kelly Criterion.`,

            section2Title: '2. The Kelly Formula (The Math)',
            section2Content: `It looks complex, but the principle is simple: bet only your edge.`,
            formula: 'f* = (bp - q) / b',
            formulaDesc: [
                { label: 'f* (Optimal Bet Fraction)', desc: 'The % of capital you should risk on this trade' },
                { label: 'b (Odds / R:R Ratio)', desc: 'Win amount / Loss amount (e.g., 3x profit means b=3)' },
                { label: 'p (Win Rate)', desc: 'Probability of winning (e.g., 40% = 0.4)' },
                { label: 'q (Loss Rate)', desc: 'Probability of losing (1 - p)' }
            ],

            section3Title: '3. Case Study',
            section3Content: `Let's use TranTradingLab's trend-following strategy:\n\n• Win Rate (p): 40% (0.4)\n• Risk/Reward (b): 3:1 (3.0)\n\nPlugging into the formula:\n\nf* = (3 × 0.4 - 0.6) / 3 = (1.2 - 0.6) / 3 = 0.2\n\n**Result:** Mathematically, you should bet **20%** of your capital for fastest growth.`,

            section4Title: '4. The Greed Trap: Why Not Use Full Kelly?',
            section4Content: `Just because the math says 20% doesn't mean you should actually bet 20%. This is called the "Full Kelly" strategy.\n\n**High Volatility:** Full Kelly maximizes returns, but your account will frequently drop 50%+. Most traders crack mentally and abandon their strategy.\n\n**Estimation Error:** Your 40% win rate is based on past data. If market conditions change and win rate drops slightly, a 20% bet could lead to ruin.`,

            section5Title: '5. TranTradingLab Advice: "Half Kelly"',
            section5Content: `We recommend the Half Kelly strategy: bet only **half (50%)** of the calculated value.\n\nFrom our example: 20% × 0.5 = **10%**\n\n**Advantage:** Maintain 75% of Full Kelly's returns while reducing Risk of Ruin to near 0%.`,
            quote: '"The first rule of trading is not to make money, but to survive."',

            section6Title: '6. Summary (Action Plan)',
            section6Content: 'Before trading tomorrow, follow these 3 steps:',
            actionSteps: [
                { step: '1', title: 'Check Your Records', desc: 'Calculate your win rate and average R:R from the last 50 trades.' },
                { step: '2', title: 'Calculate f*', desc: 'Use the Kelly formula to find your theoretical max bet size.' },
                { step: '3', title: 'Cut It in Half', desc: 'Only enter with half or less of the calculated value. This is your safety belt.' }
            ],

            ctaBtn: 'Try the Simulator Yourself →',
            footer: 'TranTradingLab | Financial Logic Studio'
        }
    }

    const t = content[language] || content.en

    return (
        <div style={styles.container}>
            <article style={styles.article}>
                {/* Back Button */}
                <button onClick={onBack} style={styles.backBtn}>
                    <ArrowLeft size={18} />
                    <span>{language === 'ko' ? '뒤로' : language === 'zh' ? '返回' : 'Back'}</span>
                </button>

                {/* Header */}
                <header style={styles.header}>
                    <div style={styles.badge}>
                        <BookOpen size={14} />
                        <span>TranTradingLab</span>
                    </div>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </header>

                {/* Intro */}
                <section style={styles.section}>
                    <p style={styles.introText}>{t.intro}</p>
                </section>

                {/* Section 1 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <Target size={20} style={{ color: '#f59e0b' }} />
                        {t.section1Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section1Content}</p>
                </section>

                {/* Section 2 - Formula */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <Calculator size={20} style={{ color: '#8b5cf6' }} />
                        {t.section2Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section2Content}</p>

                    <div style={styles.formulaBox}>
                        <div style={styles.formula}>{t.formula}</div>
                    </div>

                    <div style={styles.formulaDescList}>
                        {t.formulaDesc.map((item, idx) => (
                            <div key={idx} style={styles.formulaDescItem}>
                                <span style={styles.formulaLabel}>{item.label}</span>
                                <span style={styles.formulaDescText}>{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3 - Case Study */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <TrendingUp size={20} style={{ color: '#10b981' }} />
                        {t.section3Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section3Content}</p>
                </section>

                {/* Section 4 - Warning */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <AlertTriangle size={20} style={{ color: '#ef4444' }} />
                        {t.section4Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section4Content}</p>
                </section>

                {/* Section 5 - Advice */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <Shield size={20} style={{ color: '#3b82f6' }} />
                        {t.section5Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section5Content}</p>

                    <blockquote style={styles.quote}>
                        {t.quote}
                    </blockquote>
                </section>

                {/* Section 6 - Action Plan */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <Lightbulb size={20} style={{ color: '#f59e0b' }} />
                        {t.section6Title}
                    </h2>
                    <p style={styles.sectionContent}>{t.section6Content}</p>

                    <div style={styles.actionSteps}>
                        {t.actionSteps.map((item, idx) => (
                            <div key={idx} style={styles.actionStep}>
                                <div style={styles.stepNumber}>{item.step}</div>
                                <div style={styles.stepContent}>
                                    <h4 style={styles.stepTitle}>{item.title}</h4>
                                    <p style={styles.stepDesc}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Button */}
                <div style={styles.ctaSection}>
                    <button style={styles.ctaBtn} onClick={onOpenSimulator}>
                        <TrendingUp size={20} />
                        {t.ctaBtn}
                    </button>
                </div>

                {/* Footer */}
                <footer style={styles.footer}>
                    <span>{t.footer}</span>
                </footer>
            </article>
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflow: 'auto',
        background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 100%)',
        padding: '40px 20px'
    },
    article: {
        maxWidth: 720,
        margin: '0 auto',
        color: '#e2e8f0'
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        marginBottom: 24,
        background: 'transparent',
        border: '1px solid #475569',
        borderRadius: 8,
        color: '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.9rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: 48
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 20,
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: 24
    },
    title: {
        margin: 0,
        fontSize: '2rem',
        fontWeight: 800,
        lineHeight: 1.3,
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: '12px 0 0',
        fontSize: '1.1rem',
        color: '#64748b'
    },
    section: {
        marginBottom: 40
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '0 0 16px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#fff'
    },
    sectionContent: {
        margin: 0,
        fontSize: '1rem',
        lineHeight: 1.8,
        color: '#cbd5e1',
        whiteSpace: 'pre-line'
    },
    introText: {
        fontSize: '1.1rem',
        lineHeight: 1.9,
        color: '#94a3b8',
        whiteSpace: 'pre-line'
    },
    formulaBox: {
        margin: '24px 0',
        padding: 24,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 12,
        border: '1px solid #4f46e5',
        textAlign: 'center'
    },
    formula: {
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#a5b4fc',
        letterSpacing: 2
    },
    formulaDescList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 20
    },
    formulaDescItem: {
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 8,
        border: '1px solid #334155'
    },
    formulaLabel: {
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#818cf8',
        minWidth: 160
    },
    formulaDescText: {
        fontSize: '0.9rem',
        color: '#94a3b8'
    },
    quote: {
        margin: '24px 0 0',
        padding: '16px 24px',
        borderLeft: '4px solid #3b82f6',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '0 8px 8px 0',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: '#60a5fa'
    },
    actionSteps: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 20
    },
    actionStep: {
        display: 'flex',
        gap: 16,
        padding: 16,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 12,
        border: '1px solid #334155'
    },
    stepNumber: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '1rem',
        color: '#fff',
        flexShrink: 0
    },
    stepContent: {
        flex: 1
    },
    stepTitle: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff'
    },
    stepDesc: {
        margin: '4px 0 0',
        fontSize: '0.9rem',
        color: '#94a3b8'
    },
    ctaSection: {
        margin: '48px 0',
        textAlign: 'center'
    },
    ctaBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 12,
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#000',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0, 210, 106, 0.4)',
        transition: 'all 0.3s ease'
    },
    footer: {
        textAlign: 'center',
        padding: '32px 0',
        borderTop: '1px solid #1e293b',
        fontSize: '0.85rem',
        color: '#475569'
    }
}

export default KellyArticle
