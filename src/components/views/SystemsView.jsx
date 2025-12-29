import React, { useState } from 'react'
import {
    Cpu, TrendingUp, Shield, Target, ArrowRight,
    Clock, BarChart3, Zap, BookOpen, ChevronRight
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

/**
 * SystemsView - 交易系统专栏
 * 展示各种交易系统的研究和分析
 */
function SystemsView() {
    const { language } = useI18n()
    const [hoveredSystem, setHoveredSystem] = useState(null)

    // 多语言文本
    const texts = {
        zh: {
            title: '交易系统',
            subtitle: '系统化交易策略研究与实战分析',
            comingSoon: '即将推出更多交易系统...',
            learnMore: '了解详情',
            features: '特点',
            performance: '绩效',
            winRate: '胜率',
            riskReward: '盈亏比'
        },
        en: {
            title: 'Trading Systems',
            subtitle: 'Systematic trading strategy research and analysis',
            comingSoon: 'More trading systems coming soon...',
            learnMore: 'Learn More',
            features: 'Features',
            performance: 'Performance',
            winRate: 'Win Rate',
            riskReward: 'Risk/Reward'
        },
        ko: {
            title: '트레이딩 시스템',
            subtitle: '체계적인 트레이딩 전략 연구 및 분석',
            comingSoon: '더 많은 트레이딩 시스템이 곧 출시됩니다...',
            learnMore: '자세히 보기',
            features: '특징',
            performance: '성과',
            winRate: '승률',
            riskReward: '손익비'
        }
    }

    const t = texts[language] || texts.en

    // 交易系统列表 - 您可以在这里添加更多系统
    const tradingSystems = [
        {
            id: 'trend-following',
            nameZh: '趋势跟踪系统',
            nameEn: 'Trend Following System',
            nameKo: '추세 추종 시스템',
            descZh: '基于移动平均线和价格动量的经典趋势跟踪策略，适合中长期交易。',
            descEn: 'Classic trend following strategy based on moving averages and price momentum, suitable for medium to long-term trading.',
            descKo: '이동 평균과 가격 모멘텀을 기반으로 한 클래식 추세 추종 전략으로, 중장기 트레이딩에 적합합니다.',
            icon: TrendingUp,
            color: '#00ff88',
            stats: { winRate: '40%', rr: '3:1', timeframe: 'D1/W1' },
            tags: ['趋势', '中长期', '动量']
        },
        {
            id: 'breakout',
            nameZh: '突破交易系统',
            nameEn: 'Breakout Trading System',
            nameKo: '돌파 트레이딩 시스템',
            descZh: '捕捉价格突破关键支撑阻力位的高动量行情，强调风险管理。',
            descEn: 'Captures high momentum moves when price breaks key support/resistance levels, emphasizing risk management.',
            descKo: '가격이 주요 지지/저항 수준을 돌파할 때 높은 모멘텀 움직임을 포착하며, 위험 관리를 강조합니다.',
            icon: Zap,
            color: '#00d4ff',
            stats: { winRate: '35%', rr: '4:1', timeframe: 'H4/D1' },
            tags: ['突破', '动量', '波动性']
        },
        {
            id: 'mean-reversion',
            nameZh: '均值回归系统',
            nameEn: 'Mean Reversion System',
            nameKo: '평균 회귀 시스템',
            descZh: '利用价格偏离均值后的回归特性，在超买超卖区域寻找交易机会。',
            descEn: 'Utilizes price reversion to mean after deviation, finding trading opportunities in overbought/oversold areas.',
            descKo: '편차 후 평균으로의 가격 회귀를 활용하여 과매수/과매도 영역에서 거래 기회를 찾습니다.',
            icon: BarChart3,
            color: '#a855f7',
            stats: { winRate: '55%', rr: '1.5:1', timeframe: 'H1/H4' },
            tags: ['均值回归', '震荡', 'RSI']
        }
    ]

    const getName = (system) => language === 'zh' ? system.nameZh : language === 'ko' ? system.nameKo : system.nameEn
    const getDesc = (system) => language === 'zh' ? system.descZh : language === 'ko' ? system.descKo : system.descEn

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.badge}>
                        <Cpu size={16} />
                        <span>TranTradingLab</span>
                    </div>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </div>
            </header>

            {/* Systems Grid */}
            <section style={styles.systemsGrid}>
                {tradingSystems.map((system, index) => {
                    const IconComponent = system.icon
                    const isHovered = hoveredSystem === system.id

                    return (
                        <article
                            key={system.id}
                            style={{
                                ...styles.systemCard,
                                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                boxShadow: isHovered
                                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${system.color}40`
                                    : '0 4px 20px rgba(0,0,0,0.3)',
                                borderColor: isHovered ? `${system.color}50` : 'rgba(255,255,255,0.06)'
                            }}
                            onMouseEnter={() => setHoveredSystem(system.id)}
                            onMouseLeave={() => setHoveredSystem(null)}
                        >
                            {/* Glow Effect */}
                            <div style={{
                                ...styles.cardGlow,
                                background: `radial-gradient(circle at 50% 0%, ${system.color}15 0%, transparent 70%)`,
                                opacity: isHovered ? 1 : 0
                            }} />

                            {/* Icon */}
                            <div style={{
                                ...styles.iconBox,
                                background: `linear-gradient(135deg, ${system.color}20 0%, ${system.color}08 100%)`,
                                border: `1px solid ${system.color}30`
                            }}>
                                <IconComponent size={32} style={{ color: system.color }} />
                            </div>

                            {/* Content */}
                            <div style={styles.cardContent}>
                                <h3 style={styles.systemName}>{getName(system)}</h3>
                                <p style={styles.systemDesc}>{getDesc(system)}</p>

                                {/* Stats */}
                                <div style={styles.statsRow}>
                                    <div style={styles.statItem}>
                                        <Target size={14} style={{ color: '#00ff88' }} />
                                        <span>{t.winRate}: {system.stats.winRate}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <Shield size={14} style={{ color: '#00d4ff' }} />
                                        <span>{t.riskReward}: {system.stats.rr}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <Clock size={14} style={{ color: '#fbbf24' }} />
                                        <span>{system.stats.timeframe}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <button style={{
                                ...styles.learnMoreBtn,
                                background: isHovered
                                    ? `linear-gradient(135deg, ${system.color} 0%, ${system.color}cc 100%)`
                                    : 'rgba(255,255,255,0.05)',
                                color: isHovered ? '#000' : system.color
                            }}>
                                <BookOpen size={16} />
                                <span>{t.learnMore}</span>
                                <ChevronRight size={16} />
                            </button>
                        </article>
                    )
                })}
            </section>

            {/* Coming Soon */}
            <div style={styles.comingSoon}>
                <Cpu size={20} style={{ color: '#64748b' }} />
                <span>{t.comingSoon}</span>
            </div>
        </div>
    )
}

const styles = {
    container: {
        padding: '32px',
        height: '100%',
        overflow: 'auto'
    },
    header: {
        marginBottom: 40
    },
    headerContent: {
        maxWidth: 600
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 20,
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginBottom: 20
    },
    title: {
        margin: 0,
        fontSize: '2.2rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: '12px 0 0',
        fontSize: '1rem',
        color: '#64748b',
        lineHeight: 1.6
    },
    systemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 24
    },
    systemCard: {
        position: 'relative',
        padding: 28,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
    },
    cardGlow: {
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
    },
    iconBox: {
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 20
    },
    cardContent: {
        position: 'relative',
        zIndex: 1
    },
    systemName: {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#fff'
    },
    systemDesc: {
        margin: '0 0 20px',
        fontSize: '0.9rem',
        color: '#94a3b8',
        lineHeight: 1.7
    },
    statsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.8rem',
        color: '#cbd5e1'
    },
    learnMoreBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '12px 20px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    comingSoon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 48,
        padding: 24,
        fontSize: '0.95rem',
        color: '#64748b'
    }
}

export default SystemsView
