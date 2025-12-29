import React, { useState } from 'react'
import {
    Cpu, TrendingUp, Shield, Target, ArrowRight, ArrowLeft,
    Clock, BarChart3, Zap, BookOpen, ChevronRight, CheckCircle, ExternalLink
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

/**
 * SystemsView - 交易系统专栏
 * 展示各种交易系统的研究和分析
 */
function SystemsView() {
    const { language } = useI18n()
    const [hoveredSystem, setHoveredSystem] = useState(null)
    const [selectedSystem, setSelectedSystem] = useState(null)

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

    // 交易系统列表
    const tradingSystems = [
        {
            id: 'orb-strategy',
            nameZh: 'ORB 开盘区间突破战法',
            nameEn: 'ORB - Opening Range Breakout',
            nameKo: 'ORB 시가 범위 돌파 전략',
            descZh: '基于开盘后5/15/30/60分钟建立的价格区间，捕捉突破行情。包含多时间框架ORB、成交量过滤、趋势确认、FVG检测、动态止损止盈系统。适用于美股、期货、加密货币等各类市场。',
            descEn: 'Captures breakout moves from the opening range established in the first 5/15/30/60 minutes. Features multi-timeframe ORB, volume filter, trend confirmation, FVG detection, and dynamic TP/SL. Works on stocks, futures, crypto, and forex.',
            descKo: '시장 개장 후 5/15/30/60분 동안 형성된 가격 범위의 돌파를 포착합니다. 다중 시간프레임 ORB, 거래량 필터, 추세 확인, FVG 감지, 동적 TP/SL 시스템을 포함합니다. 주식, 선물, 암호화폐, 외환 등 다양한 시장에 적용 가능합니다.',
            icon: TrendingUp,
            color: '#00ff88',
            stats: { winRate: '45-55%', rr: '2:1 ~ 3:1', timeframe: '5m/15m' },
            features: [
                { zh: '多时间框架ORB (5/15/30/60分钟)', en: 'Multi-timeframe ORB (5/15/30/60min)', ko: '다중 시간프레임 ORB (5/15/30/60분)' },
                { zh: '成交量确认过滤器', en: 'Volume confirmation filter', ko: '거래량 확인 필터' },
                { zh: '趋势方向过滤 (VWAP/EMA/SuperTrend)', en: 'Trend filter (VWAP/EMA/SuperTrend)', ko: '추세 필터 (VWAP/EMA/슈퍼트렌드)' },
                { zh: 'FVG (公允价值缺口) 检测', en: 'FVG (Fair Value Gap) detection', ko: 'FVG (공정 가치 갭) 감지' },
                { zh: '智能自适应止损', en: 'Smart adaptive stop-loss', ko: '스마트 적응형 손절' },
                { zh: '多目标止盈 (TP1/TP1.5/TP2/TP3)', en: 'Multi-target take profit (TP1/TP1.5/TP2/TP3)', ko: '다중 목표 익절 (TP1/TP1.5/TP2/TP3)' },
                { zh: '仓位管理计算器', en: 'Position sizing calculator', ko: '포지션 사이징 계산기' },
                { zh: '回测与再突破检测', en: 'Retest & re-breakout detection', ko: '재시도 및 재돌파 감지' }
            ],
            platform: 'TradingView',
            hasIndicator: true
        }
    ]

    const getName = (system) => language === 'zh' ? system.nameZh : language === 'ko' ? system.nameKo : system.nameEn
    const getDesc = (system) => language === 'zh' ? system.descZh : language === 'ko' ? system.descKo : system.descEn
    const getFeature = (feature) => language === 'zh' ? feature.zh : language === 'ko' ? feature.ko : feature.en

    // 如果选中了某个系统，显示详情视图
    if (selectedSystem) {
        const system = tradingSystems.find(s => s.id === selectedSystem)
        if (!system) return null

        const IconComponent = system.icon

        return (
            <div style={styles.container}>
                {/* Back Button */}
                <button
                    onClick={() => setSelectedSystem(null)}
                    style={styles.backBtn}
                >
                    <ArrowLeft size={20} />
                    <span>{language === 'zh' ? '返回列表' : language === 'ko' ? '목록으로 돌아가기' : 'Back to List'}</span>
                </button>

                {/* Detail Header */}
                <div style={styles.detailHeader}>
                    <div style={{
                        ...styles.detailIcon,
                        background: `linear-gradient(135deg, ${system.color}20 0%, ${system.color}08 100%)`,
                        border: `1px solid ${system.color}30`
                    }}>
                        <IconComponent size={48} style={{ color: system.color }} />
                    </div>
                    <div style={styles.detailInfo}>
                        {system.platform && (
                            <div style={styles.platformBadge}>
                                <Cpu size={12} />
                                <span>{system.platform}</span>
                            </div>
                        )}
                        <h1 style={styles.detailTitle}>{getName(system)}</h1>
                        <p style={styles.detailDesc}>{getDesc(system)}</p>

                        {/* Stats Row */}
                        <div style={styles.detailStats}>
                            <div style={styles.detailStatItem}>
                                <Target size={18} style={{ color: '#00ff88' }} />
                                <div>
                                    <div style={styles.statLabel}>{t.winRate}</div>
                                    <div style={styles.statValue}>{system.stats.winRate}</div>
                                </div>
                            </div>
                            <div style={styles.detailStatItem}>
                                <Shield size={18} style={{ color: '#00d4ff' }} />
                                <div>
                                    <div style={styles.statLabel}>{t.riskReward}</div>
                                    <div style={styles.statValue}>{system.stats.rr}</div>
                                </div>
                            </div>
                            <div style={styles.detailStatItem}>
                                <Clock size={18} style={{ color: '#fbbf24' }} />
                                <div>
                                    <div style={styles.statLabel}>{language === 'zh' ? '时间周期' : language === 'ko' ? '시간프레임' : 'Timeframe'}</div>
                                    <div style={styles.statValue}>{system.stats.timeframe}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Features */}
                <section style={styles.detailSection}>
                    <h2 style={styles.sectionTitle}>
                        <CheckCircle size={20} style={{ color: '#00ff88' }} />
                        <span>{language === 'zh' ? '核心功能' : language === 'ko' ? '핵심 기능' : 'Core Features'}</span>
                    </h2>
                    <div style={styles.allFeatures}>
                        {system.features.map((feature, idx) => (
                            <div key={idx} style={styles.detailFeatureItem}>
                                <div style={styles.featureNumber}>{idx + 1}</div>
                                <span>{getFeature(feature)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to Use */}
                <section style={styles.detailSection}>
                    <h2 style={styles.sectionTitle}>
                        <BookOpen size={20} style={{ color: '#00d4ff' }} />
                        <span>{language === 'zh' ? '使用方法' : language === 'ko' ? '사용 방법' : 'How to Use'}</span>
                    </h2>
                    <div style={styles.howToUse}>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>1</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '打开TradingView' : language === 'ko' ? 'TradingView 열기' : 'Open TradingView'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '登录TradingView.com，打开任意股票/期货/加密货币图表'
                                        : language === 'ko'
                                            ? 'TradingView.com에 로그인하고 주식/선물/암호화폐 차트 열기'
                                            : 'Login to TradingView.com and open any stock/futures/crypto chart'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>2</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '添加指标' : language === 'ko' ? '지표 추가' : 'Add Indicator'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '点击"指标"按钮，搜索"TranTradingLab ORB"添加到图表'
                                        : language === 'ko'
                                            ? '"지표" 버튼 클릭, "TranTradingLab ORB" 검색 후 차트에 추가'
                                            : 'Click "Indicators", search "TranTradingLab ORB" and add to chart'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>3</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '配置参数' : language === 'ko' ? '파라미터 설정' : 'Configure Settings'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '根据需要调整ORB时间段(5/15/30/60分钟)、过滤器、止损止盈参数'
                                        : language === 'ko'
                                            ? '필요에 따라 ORB 기간(5/15/30/60분), 필터, TP/SL 파라미터 조정'
                                            : 'Adjust ORB periods (5/15/30/60min), filters, and TP/SL parameters as needed'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>4</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '等待信号' : language === 'ko' ? '신호 대기' : 'Wait for Signals'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '开盘后等待ORB区间形成，出现突破信号后根据系统提示进行交易'
                                        : language === 'ko'
                                            ? '시장 개장 후 ORB 범위 형성 대기, 돌파 신호 발생 시 시스템 표시에 따라 거래'
                                            : 'Wait for ORB range to form after market open, trade when breakout signals appear'}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* External Link */}
                <a
                    href="https://www.tradingview.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.externalLink}
                >
                    <ExternalLink size={18} />
                    <span>{language === 'zh' ? '在TradingView中打开' : language === 'ko' ? 'TradingView에서 열기' : 'Open in TradingView'}</span>
                </a>
            </div>
        )
    }

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
                                {/* Platform Badge */}
                                {system.platform && (
                                    <div style={styles.platformBadge}>
                                        <Cpu size={12} />
                                        <span>{system.platform}</span>
                                    </div>
                                )}

                                <h3 style={styles.systemName}>{getName(system)}</h3>
                                <p style={styles.systemDesc}>{getDesc(system)}</p>

                                {/* Features */}
                                {system.features && system.features.length > 0 && (
                                    <div style={styles.featuresSection}>
                                        <div style={styles.featuresTitle}>✨ {t.features}</div>
                                        <div style={styles.featuresList}>
                                            {system.features.slice(0, 4).map((feature, idx) => (
                                                <div key={idx} style={styles.featureItem}>
                                                    <span style={styles.featureDot}>•</span>
                                                    <span>{language === 'zh' ? feature.zh : language === 'ko' ? feature.ko : feature.en}</span>
                                                </div>
                                            ))}
                                            {system.features.length > 4 && (
                                                <div style={styles.featureMore}>
                                                    +{system.features.length - 4} more...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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
                            <button
                                onClick={() => setSelectedSystem(system.id)}
                                style={{
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
    platformBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        marginBottom: 12,
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#818cf8'
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
    featuresSection: {
        marginBottom: 20,
        padding: 16,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)'
    },
    featuresTitle: {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#cbd5e1',
        marginBottom: 10
    },
    featuresList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
    },
    featureItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        fontSize: '0.8rem',
        color: '#94a3b8'
    },
    featureDot: {
        color: '#00ff88',
        fontWeight: 700
    },
    featureMore: {
        fontSize: '0.75rem',
        color: '#64748b',
        fontStyle: 'italic',
        marginTop: 4
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
    },
    // Detail view styles
    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        marginBottom: 24,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        color: '#94a3b8',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    detailHeader: {
        display: 'flex',
        gap: 24,
        marginBottom: 32,
        padding: 24,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20
    },
    detailIcon: {
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        flexShrink: 0
    },
    detailInfo: {
        flex: 1
    },
    detailTitle: {
        margin: '12px 0',
        fontSize: '1.8rem',
        fontWeight: 800,
        color: '#fff'
    },
    detailDesc: {
        margin: '0 0 20px',
        fontSize: '1rem',
        color: '#94a3b8',
        lineHeight: 1.8
    },
    detailStats: {
        display: 'flex',
        gap: 32,
        marginTop: 16
    },
    detailStatItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: 2
    },
    statValue: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#fff'
    },
    detailSection: {
        marginBottom: 32,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '0 0 20px',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#fff'
    },
    allFeatures: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12
    },
    detailFeatureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.1)',
        borderRadius: 10,
        fontSize: '0.9rem',
        color: '#cbd5e1'
    },
    featureNumber: {
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#00ff88',
        color: '#000',
        borderRadius: 6,
        fontSize: '0.75rem',
        fontWeight: 700,
        flexShrink: 0
    },
    howToUse: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    stepItem: {
        display: 'flex',
        gap: 16,
        padding: 16,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12
    },
    stepNumber: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        color: '#fff',
        borderRadius: 8,
        fontSize: '0.9rem',
        fontWeight: 700,
        flexShrink: 0
    },
    stepContent: {
        flex: 1
    },
    stepTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: 4
    },
    stepDesc: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: 1.6
    },
    externalLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        border: 'none',
        borderRadius: 12,
        color: '#000',
        fontSize: '1rem',
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
}

export default SystemsView
