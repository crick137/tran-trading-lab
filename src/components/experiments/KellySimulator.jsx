import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { RotateCcw, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, ArrowLeft } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

const KellySimulator = ({ onBack }) => {
    const { language } = useI18n()

    // 核心参数 State
    const [winRate, setWinRate] = useState(45) // 胜率 %
    const [odds, setOdds] = useState(3.0)      // 赔率 (盈亏比)
    const [capital, setCapital] = useState(10000) // 初始本金

    // 模拟数据 State
    const [simulationData, setSimulationData] = useState([])
    const [optimalKelly, setOptimalKelly] = useState(0)

    // 计算凯利公式
    useEffect(() => {
        // f* = (bp - q) / b
        // b = odds, p = winRate/100, q = 1 - p
        const p = winRate / 100
        const q = 1 - p
        const b = odds

        let k = (b * p - q) / b
        if (k < 0) k = 0 // 如果期望值为负，不应下注
        setOptimalKelly(k)
    }, [winRate, odds])

    // 生成模拟交易数据
    const runSimulation = () => {
        const rounds = 50 // 模拟50局
        const data = []

        let safeCapital = capital // 半凯利 (Half Kelly)
        let optimalCapital = capital // 满凯利 (Full Kelly)
        let greedyCapital = capital // 过度下注 (2x Kelly) - 模拟贪婪

        const safeFraction = optimalKelly * 0.5
        const greedyFraction = optimalKelly * 2.5 > 0.9 ? 0.9 : optimalKelly * 2.5

        data.push({
            round: 0,
            Safe: capital,
            Optimal: capital,
            Greedy: capital
        })

        for (let i = 1; i <= rounds; i++) {
            const isWin = Math.random() < (winRate / 100)

            // 更新 半凯利
            const safeBet = safeCapital * safeFraction
            if (isWin) safeCapital += safeBet * odds
            else safeCapital -= safeBet

            // 更新 满凯利
            const optimalBet = optimalCapital * optimalKelly
            if (isWin) optimalCapital += optimalBet * odds
            else optimalCapital -= optimalBet

            // 更新 贪婪 (过度下注)
            const greedyBet = greedyCapital * greedyFraction
            if (isWin) greedyCapital += greedyBet * odds
            else greedyCapital -= greedyBet

            // 防止负资产显示过丑
            safeCapital = Math.max(0, safeCapital)
            optimalCapital = Math.max(0, optimalCapital)
            greedyCapital = Math.max(0, greedyCapital)

            data.push({
                round: i,
                Safe: Math.round(safeCapital),
                Optimal: Math.round(optimalCapital),
                Greedy: Math.round(greedyCapital)
            })
        }
        setSimulationData(data)
    }

    // 初始运行一次
    useEffect(() => {
        if (optimalKelly > 0) {
            runSimulation()
        }
    }, [optimalKelly])

    // 多语言文案
    const texts = {
        zh: {
            title: 'TranTradingLab',
            subtitle: '金融逻辑工作室',
            mode: '模式',
            eduDemo: '教育演示',
            status: '状态',
            live: 'LIVE',
            inputTitle: '策略参数 (Input)',
            winRate: '胜率 (Win Rate)',
            winRateHint: '在这个胜率下你有优势吗？',
            odds: '盈亏比 (Odds)',
            oddsHint: '盈利 {odds}, 亏损 1',
            outputTitle: '凯利计算 (Output)',
            optimalPosition: '理论最优仓位:',
            warning: '警告: 期望值为负。最佳策略是不进行交易。',
            safe: '稳健型 (半凯利):',
            aggressive: '激进型 (满凯利):',
            highRisk: '高风险 (2.5倍):',
            runSimBtn: '运行50次模拟',
            chartTitle: '资产增长模拟 (蒙特卡洛)',
            chartDesc: '观察50次随机交易后不同仓位管理策略的表现。',
            chartQuote: '"只有生存下来的人才能享受复利。"',
            initialCapital: '初始资金',
            tradeCount: '交易次数',
            trade: '交易',
            safeLine: '稳健型 (半凯利)',
            optimalLine: '激进型 (满凯利)',
            greedyLine: '贪婪 (过度下注)',
            ruinAlert: '贪婪账户破产',
            ruinDesc: '过度下注导致破产风险。',
            adviceTitle: 'TranTradingLab 的建议',
            adviceText: '新手只看收益率，而高手关注最大回撤(MDD)。在实战中，我们建议使用半凯利(Half-Kelly)，即计算结果的一半。',
            edgeTitle: '期望值 (Edge)',
            edgeText: '如果f*是负数或零，这个游戏不值得玩。此时最佳策略是不持仓(No Position)。',
            ruinTitle: '破产风险 (Risk of Ruin)',
            ruinText: '如果下注比例超过满凯利的2倍，长期来看破产概率接近100%。这就是为什么需要资金管理。',
            back: '返回'
        },
        en: {
            title: 'TranTradingLab',
            subtitle: 'Financial Logic Studio',
            mode: 'Mode',
            eduDemo: 'Edu Demo',
            status: 'Status',
            live: 'LIVE',
            inputTitle: 'Strategy Parameters (Input)',
            winRate: 'Win Rate',
            winRateHint: 'Do you have an edge at this win rate?',
            odds: 'Odds (Risk/Reward)',
            oddsHint: 'Profit {odds}, Loss 1',
            outputTitle: 'Kelly Calculation (Output)',
            optimalPosition: 'Theoretical Optimal Position:',
            warning: 'Warning: Expected value is negative. Best strategy is not to trade.',
            safe: 'Safe (Half Kelly):',
            aggressive: 'Aggressive (Full Kelly):',
            highRisk: 'High Risk (2.5x):',
            runSimBtn: 'Run 50 Simulations',
            chartTitle: 'Asset Growth Simulation (Monte Carlo)',
            chartDesc: 'Observe the performance of different position sizing strategies after 50 random trades.',
            chartQuote: '"Only survivors get to enjoy compound interest."',
            initialCapital: 'Initial Capital',
            tradeCount: 'Trade Count',
            trade: 'Trade',
            safeLine: 'Safe (Half Kelly)',
            optimalLine: 'Aggressive (Full Kelly)',
            greedyLine: 'Greedy (Over-betting)',
            ruinAlert: 'Greedy Account Ruined',
            ruinDesc: 'Excessive betting leads to ruin risk.',
            adviceTitle: 'TranTradingLab Advice',
            adviceText: 'Beginners only look at returns, while experts watch drawdowns (MDD). In practice, we recommend using Half-Kelly, which is half of the calculated result.',
            edgeTitle: 'Expected Value (Edge)',
            edgeText: 'If f* is negative or zero, this game is not worth playing. The best strategy then is No Position.',
            ruinTitle: 'Risk of Ruin',
            ruinText: 'If betting ratio exceeds 2x Full Kelly, the long-term probability of ruin approaches 100%. This is why money management is essential.',
            back: 'Back'
        },
        ko: {
            title: 'TranTradingLab',
            subtitle: 'Financial Logic Studio',
            mode: '모드',
            eduDemo: '교육 데모',
            status: '상태',
            live: 'LIVE',
            inputTitle: '전략 매개변수 (Input)',
            winRate: '승률 (Win Rate)',
            winRateHint: '이 승률에서 우위가 있습니까?',
            odds: '손익비 (Odds)',
            oddsHint: '수익 {odds}, 손실 1',
            outputTitle: '켈리 계산 (Output)',
            optimalPosition: '이론적 최적 포지션:',
            warning: '경고: 기대값이 음수입니다. 거래를 하지 않는 것이 최선입니다.',
            safe: '안정형 (하프 켈리):',
            aggressive: '공격형 (풀 켈리):',
            highRisk: '고위험 (2.5배):',
            runSimBtn: '50회 시뮬레이션 실행',
            chartTitle: '자산 성장 시뮬레이션 (Monte Carlo)',
            chartDesc: '50회 무작위 거래 후 다양한 포지션 관리 전략의 성과를 관찰하세요.',
            chartQuote: '"살아남는 자만이 복리를 누릴 수 있습니다."',
            initialCapital: '초기 자본',
            tradeCount: '거래 횟수',
            trade: '거래',
            safeLine: '안정형 (하프 켈리)',
            optimalLine: '공격형 (풀 켈리)',
            greedyLine: '탐욕 (과잉 베팅)',
            ruinAlert: '탐욕 계좌 파산 (Ruin)',
            ruinDesc: '과도한 베팅은 파산 위험을 초래합니다.',
            adviceTitle: 'TranTradingLab의 조언',
            adviceText: '초보자는 수익률만 보지만, 고수는 손실폭(MDD)을 봅니다. 실전에서는 하프 켈리(Half-Kelly), 즉 계산 결과의 절반을 사용하는 것을 권장합니다.',
            edgeTitle: '기대값 (Edge)',
            edgeText: '만약 f*가 음수나 0이라면, 이 게임은 할 가치가 없습니다. 이때 최선의 전략은 무포지션(No Position)입니다.',
            ruinTitle: '파산 위험 (Risk of Ruin)',
            ruinText: '베팅 비율이 풀 켈리의 2배를 넘으면, 장기적으로 파산 확률은 100%에 가깝습니다. 이것이 자금 관리가 필요한 이유입니다.',
            back: '뒤로'
        }
    }

    const t = texts[language] || texts.en

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <button onClick={onBack} style={styles.backBtn}>
                        <ArrowLeft size={18} />
                        <span>{t.back}</span>
                    </button>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>
                            <TrendingUp size={20} style={{ color: '#818cf8' }} />
                        </div>
                        <div>
                            <h1 style={styles.logoTitle}>{t.title}</h1>
                            <p style={styles.logoSubtitle}>{t.subtitle}</p>
                        </div>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <span style={styles.headerMeta}>{t.mode}: <span style={{ color: '#fff' }}>{t.eduDemo}</span></span>
                    <span style={styles.headerMeta}>{t.status}: <span style={styles.liveIndicator}>● {t.live}</span></span>
                </div>
            </header>

            <main style={styles.main}>
                {/* Left Control Panel */}
                <aside style={styles.sidebar}>
                    <div style={styles.inputSection}>
                        <h2 style={styles.sectionTitle}>{t.inputTitle}</h2>

                        {/* Win Rate Slider */}
                        <div style={styles.sliderGroup}>
                            <div style={styles.sliderHeader}>
                                <label style={styles.sliderLabel}>{t.winRate}</label>
                                <span style={styles.sliderValue}>{winRate}%</span>
                            </div>
                            <input
                                type="range" min="10" max="90" step="1"
                                value={winRate}
                                onChange={(e) => setWinRate(parseInt(e.target.value))}
                                style={styles.slider}
                            />
                            <p style={styles.sliderHint}>{t.winRateHint}</p>
                        </div>

                        {/* Odds Slider */}
                        <div style={{ ...styles.sliderGroup, marginTop: 24 }}>
                            <div style={styles.sliderHeader}>
                                <label style={styles.sliderLabel}>{t.odds}</label>
                                <span style={styles.sliderValue}>1 : {odds}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="10" step="0.5"
                                value={odds}
                                onChange={(e) => setOdds(parseFloat(e.target.value))}
                                style={styles.slider}
                            />
                            <p style={styles.sliderHint}>{t.oddsHint.replace('{odds}', odds)}</p>
                        </div>
                    </div>

                    <div style={styles.outputSection}>
                        <h2 style={styles.sectionTitle}>{t.outputTitle}</h2>

                        <div style={styles.outputRow}>
                            <span style={styles.outputLabel}>{t.optimalPosition}</span>
                            <span style={{
                                ...styles.outputValue,
                                color: optimalKelly > 0 ? '#4ade80' : '#ef4444'
                            }}>
                                {(optimalKelly * 100).toFixed(1)}%
                            </span>
                        </div>

                        {optimalKelly <= 0 ? (
                            <div style={styles.warningBox}>
                                <AlertTriangle size={14} />
                                <span>{t.warning}</span>
                            </div>
                        ) : (
                            <div style={styles.kellyBreakdown}>
                                <div style={styles.kellyRow}>
                                    <span>{t.safe}</span>
                                    <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{(optimalKelly * 50).toFixed(1)}% / trade</span>
                                </div>
                                <div style={styles.kellyRow}>
                                    <span>{t.aggressive}</span>
                                    <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>{(optimalKelly * 100).toFixed(1)}% / trade</span>
                                </div>
                                <div style={{ ...styles.kellyRow, opacity: 0.6 }}>
                                    <span>{t.highRisk}</span>
                                    <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>{(optimalKelly * 250).toFixed(1)}% / trade</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={optimalKelly <= 0}
                        style={{
                            ...styles.simButton,
                            opacity: optimalKelly <= 0 ? 0.5 : 1,
                            cursor: optimalKelly <= 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <RotateCcw size={18} />
                        {t.runSimBtn}
                    </button>
                </aside>

                {/* Main Visualization Area */}
                <section style={styles.chartSection}>
                    {/* Chart Header */}
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>
                                <TrendingUp size={24} style={{ color: '#818cf8' }} />
                                {t.chartTitle}
                            </h3>
                            <p style={styles.chartDesc}>
                                {t.chartDesc}
                                <span style={styles.chartQuote}>{t.chartQuote}</span>
                            </p>
                        </div>
                        <div style={styles.capitalDisplay}>
                            <div style={styles.capitalValue}>${capital.toLocaleString()}</div>
                            <div style={styles.capitalLabel}>{t.initialCapital}</div>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={simulationData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                <XAxis
                                    dataKey="round"
                                    stroke="#94a3b8"
                                    label={{ value: t.tradeCount, position: 'insideBottomRight', offset: -10, fill: '#64748b' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                                    labelFormatter={(value) => `${t.trade} ${value}`}
                                />
                                <Legend verticalAlign="top" height={36} />

                                <Line
                                    type="monotone"
                                    dataKey="Safe"
                                    name={t.safeLine}
                                    stroke="#60a5fa"
                                    strokeWidth={3}
                                    dot={false}
                                    animationDuration={1500}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="Optimal"
                                    name={t.optimalLine}
                                    stroke="#4ade80"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    animationDuration={1500}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="Greedy"
                                    name={t.greedyLine}
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={false}
                                    animationDuration={1500}
                                />

                                <ReferenceLine y={capital} stroke="#475569" strokeDasharray="3 3" />
                            </LineChart>
                        </ResponsiveContainer>

                        {/* Ruin Alert */}
                        {simulationData.length > 0 && simulationData[simulationData.length - 1].Greedy < 100 && (
                            <div style={styles.ruinAlert}>
                                <div style={styles.ruinAlertTitle}>
                                    <AlertTriangle size={18} />
                                    {t.ruinAlert}
                                </div>
                                <div style={styles.ruinAlertDesc}>{t.ruinDesc}</div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Lesson Cards */}
                    <div style={styles.lessonGrid}>
                        <div style={{ ...styles.lessonCard, borderLeftColor: '#60a5fa' }}>
                            <div style={{ ...styles.lessonTitle, color: '#60a5fa' }}>
                                <ShieldCheck size={18} />
                                {t.adviceTitle}
                            </div>
                            <p style={styles.lessonText}>{t.adviceText}</p>
                        </div>

                        <div style={{ ...styles.lessonCard, borderLeftColor: '#4ade80' }}>
                            <div style={{ ...styles.lessonTitle, color: '#4ade80' }}>
                                <DollarSign size={18} />
                                {t.edgeTitle}
                            </div>
                            <p style={styles.lessonText}>{t.edgeText}</p>
                        </div>

                        <div style={{ ...styles.lessonCard, borderLeftColor: '#ef4444' }}>
                            <div style={{ ...styles.lessonTitle, color: '#ef4444' }}>
                                <AlertTriangle size={18} />
                                {t.ruinTitle}
                            </div>
                            <p style={styles.lessonText}>{t.ruinText}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0f172a',
        color: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #475569',
        borderRadius: 8,
        color: '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)',
        border: '2px solid #818cf8'
    },
    logoTitle: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: '#fff'
    },
    logoSubtitle: {
        margin: 0,
        fontSize: '0.7rem',
        color: '#818cf8',
        textTransform: 'uppercase',
        letterSpacing: '0.15em'
    },
    headerRight: {
        display: 'flex',
        gap: 24,
        fontSize: '0.875rem',
        color: '#94a3b8'
    },
    headerMeta: {},
    liveIndicator: {
        color: '#4ade80',
        animation: 'pulse 2s infinite'
    },
    main: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
    },
    sidebar: {
        width: 320,
        background: '#0f172a',
        borderRight: '1px solid #334155',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflowY: 'auto',
        boxShadow: '4px 0 6px -1px rgba(0,0,0,0.3)'
    },
    inputSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
    },
    sectionTitle: {
        margin: 0,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #334155',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#64748b',
        fontWeight: 700
    },
    sliderGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
    },
    sliderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderLabel: {
        fontSize: '0.875rem',
        color: '#cbd5e1'
    },
    sliderValue: {
        color: '#818cf8',
        fontFamily: 'monospace',
        fontWeight: 700
    },
    slider: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        background: '#334155',
        appearance: 'none',
        cursor: 'pointer',
        accentColor: '#6366f1'
    },
    sliderHint: {
        margin: 0,
        fontSize: '0.75rem',
        color: '#64748b'
    },
    outputSection: {
        padding: 16,
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 12,
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    outputRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    outputLabel: {
        fontSize: '0.875rem',
        color: '#94a3b8'
    },
    outputValue: {
        fontFamily: 'monospace',
        fontSize: '1.5rem',
        fontWeight: 700
    },
    warningBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: 8,
        background: 'rgba(127, 29, 29, 0.2)',
        borderRadius: 6,
        color: '#ef4444',
        fontSize: '0.75rem'
    },
    kellyBreakdown: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        fontSize: '0.75rem'
    },
    kellyRow: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#94a3b8'
    },
    simButton: {
        marginTop: 'auto',
        width: '100%',
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        border: 'none',
        borderRadius: 8,
        color: '#fff',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
        transition: 'all 0.2s'
    },
    chartSection: {
        flex: 1,
        background: '#020617',
        display: 'flex',
        flexDirection: 'column',
        padding: 32
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24
    },
    chartTitle: {
        margin: 0,
        marginBottom: 8,
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    chartDesc: {
        margin: 0,
        fontSize: '0.875rem',
        color: '#94a3b8'
    },
    chartQuote: {
        marginLeft: 8,
        color: '#818cf8',
        fontStyle: 'italic'
    },
    capitalDisplay: {
        textAlign: 'right'
    },
    capitalValue: {
        fontSize: '1.875rem',
        fontFamily: 'monospace',
        fontWeight: 700,
        color: '#e2e8f0'
    },
    capitalLabel: {
        fontSize: '0.75rem',
        color: '#64748b'
    },
    chartContainer: {
        flex: 1,
        minHeight: 300,
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 12,
        border: '1px solid #1e293b',
        padding: 16,
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
    },
    ruinAlert: {
        position: 'absolute',
        bottom: 80,
        right: 80,
        background: 'rgba(127, 29, 29, 0.8)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        border: '1px solid #ef4444',
        backdropFilter: 'blur(8px)',
        animation: 'bounce 1s infinite'
    },
    ruinAlertTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontWeight: 700
    },
    ruinAlertDesc: {
        marginTop: 4,
        fontSize: '0.75rem',
        opacity: 0.8
    },
    lessonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginTop: 24
    },
    lessonCard: {
        padding: 16,
        background: '#1e293b',
        borderRadius: 8,
        borderLeft: '4px solid'
    },
    lessonTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontWeight: 700,
        marginBottom: 8
    },
    lessonText: {
        margin: 0,
        fontSize: '0.875rem',
        color: '#cbd5e1',
        lineHeight: 1.6
    }
}

export default KellySimulator
