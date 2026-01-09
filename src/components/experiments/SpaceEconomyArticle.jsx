import React from 'react'
import {
    Rocket,
    Satellite,
    Globe,
    TrendingUp,
    Shield,
    Factory,
    ArrowLeft,
    Star,
    Zap,
    Target,
    MessageCircle,
    ExternalLink,
    ChevronRight
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

// 우주 경제 2단계 투자 전략 문서
const SpaceEconomyArticle = ({ onBack }) => {
    const { language } = useI18n()

    // 5대 섹터 데이터
    const sectors = [
        {
            id: 1,
            icon: Rocket,
            titleKo: '발사 및 인프라',
            titleZh: '发射及基础设施',
            titleEn: 'Launch & Infrastructure',
            subtitleKo: '우주로 가는 문을 여는 기업들',
            subtitleZh: '开启通往太空之门的企业',
            subtitleEn: 'Companies opening the door to space',
            color: '#f97316',
            gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            stocks: [
                { ticker: 'RKLB', name: 'Rocket Lab', hot: true },
                { ticker: 'FLY', name: 'ASAL' },
                { ticker: 'SPCE', name: 'Virgin Galactic' }
            ],
            notesKo: 'SpaceX(비상장), ULA(보잉+록히드 합작)의 행보가 기준점입니다.',
            notesZh: 'SpaceX(非上市)、ULA(波音+洛克希德合资)是参考基准。',
            notesEn: 'SpaceX (private), ULA (Boeing+Lockheed JV) set the benchmark.'
        },
        {
            id: 2,
            icon: Satellite,
            titleKo: '위성 통신 및 데이터',
            titleZh: '卫星通信及数据',
            titleEn: 'Satellite Communications & Data',
            subtitleKo: '우주 공간을 이용해 전 세계를 하나로 연결',
            subtitleZh: '利用太空将全球连为一体',
            subtitleEn: 'Connecting the world through space',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            stocks: [
                { ticker: 'ASTS', name: 'AST SpaceMobile', hot: true },
                { ticker: 'IRDM', name: 'Iridium' },
                { ticker: 'GSAT', name: 'Globalstar' },
                { ticker: 'AMZN', name: 'Amazon Kuiper' }
            ],
            notesKo: '저궤도 위성 네트워크를 통한 초고속 통신 서비스 상용화가 핵심입니다.',
            notesZh: '低轨道卫星网络实现超高速通信商业化是关键。',
            notesEn: 'LEO satellite networks commercializing ultra-fast connectivity.'
        },
        {
            id: 3,
            icon: Globe,
            titleKo: '궤도 서비스 및 우주 인프라',
            titleZh: '轨道服务及太空基础设施',
            titleEn: 'On-orbit Systems & Services',
            subtitleKo: '우주 공간 내에서의 서비스와 탐사 인프라',
            subtitleZh: '太空中的服务与探索基础设施',
            subtitleEn: 'In-space services and exploration infrastructure',
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
            stocks: [
                { ticker: 'LUNR', name: 'Intuitive Machines', hot: true },
                { ticker: 'VOYG', name: 'Voyager Space' }
            ],
            notesKo: '달 탐사 프로젝트(아르테미스)와의 연계성 및 민간 우주 정거장 건설.',
            notesZh: '与阿尔忒弥斯登月计划的联动及民间空间站建设。',
            notesEn: 'Artemis lunar program ties and private space station development.'
        },
        {
            id: 4,
            icon: Zap,
            titleKo: '지상 시스템 및 연결성',
            titleZh: '地面系统及连接性',
            titleEn: 'Connectivity & Ground Systems',
            subtitleKo: '우주 데이터가 지구에서 가치로 변환되는 지점',
            subtitleZh: '太空数据在地球上转化为价值的节点',
            subtitleEn: 'Where space data translates to earthly value',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            stocks: [
                { ticker: 'TSAT', name: 'Telesat' },
                { ticker: 'TRMB', name: 'Trimble' },
                { ticker: 'VRT', name: 'Vertiv Holdings' }
            ],
            notesKo: '위성 데이터 수신 및 처리 인프라의 핵심 플레이어들.',
            notesZh: '卫星数据接收及处理基础设施的核心玩家。',
            notesEn: 'Core players in satellite data reception and processing infrastructure.'
        },
        {
            id: 5,
            icon: Factory,
            titleKo: '제조 및 방산 공급망',
            titleZh: '制造及国防供应链',
            titleEn: 'Manufacturing & Supply',
            subtitleKo: '우주 산업의 척추 역할을 하는 거대 제조사들',
            subtitleZh: '作为太空产业脊梁的大型制造商',
            subtitleEn: 'Giants forming the backbone of the space industry',
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            stocks: [
                { ticker: 'LMT', name: 'Lockheed Martin' },
                { ticker: 'NOC', name: 'Northrop Grumman' },
                { ticker: 'RTX', name: 'Raytheon' },
                { ticker: 'PLTR', name: 'Palantir' }
            ],
            notesKo: '안정적인 국방 예산 수주와 우주 항공 부품의 공급망 장악력.',
            notesZh: '稳定的国防预算订单及航天零部件供应链控制力。',
            notesEn: 'Stable defense budget contracts and supply chain dominance.'
        }
    ]

    const getTitle = (sector) => {
        if (language === 'ko') return sector.titleKo
        if (language === 'zh') return sector.titleZh
        return sector.titleEn
    }

    const getSubtitle = (sector) => {
        if (language === 'ko') return sector.subtitleKo
        if (language === 'zh') return sector.subtitleZh
        return sector.subtitleEn
    }

    const getNotes = (sector) => {
        if (language === 'ko') return sector.notesKo
        if (language === 'zh') return sector.notesZh
        return sector.notesEn
    }

    const content = {
        ko: {
            badge: '2026 투자 전략',
            title: '$RKLB와 $ASTS를 놓쳤다면?',
            subtitle: "'우주 경제: 2단계' 풀 스택 생태계에 주목하라",
            intro: `최근 시장에서 가장 뜨거웠던 종목을 꼽으라면 단연 **$ASTS(AST 스페이스모바일)**와 **$RKLB(로켓 랩)**일 것입니다. 하지만 이들의 급등을 보며 "이미 늦은 것 아닐까?"라고 생각하신다면, 아직 우주 산업의 거대한 흐름을 절반만 보고 계신 것일지도 모릅니다.`,
            phase2Title: 'Phase 2: 풀 스택 생태계',
            phase2Content: '2026년, 우주 산업은 단순한 기대감을 넘어 **풀 스택 생태계(Full Stack Ecosystem)**로 진입합니다. 이제는 개별 종목의 랠리를 넘어 산업 전체의 공급망과 인프라가 수익을 만들어내는 구조에 주목해야 할 때입니다.',
            sectorsTitle: '우주 산업의 지형도: 5가지 핵심 섹터',
            sectorsSubtitle: '우주 경제는 단순히 로켓을 쏘아 올리는 것에 그치지 않습니다. 발사부터 지상 데이터 수집까지, 전체 생태계를 주목하세요.',
            insightTitle: '투자 인사이트: 왜 지금인가?',
            insightContent: `많은 투자자가 주가가 폭등할 때 탐욕에 빠져 비싸게 사고, 조정이 올 때 두려움에 손절합니다. 하지만 진정한 수익은 언제나 대중의 관심이 덜한 '길목'을 지키는 것에서 나옵니다.

현재 우주 산업의 핵심 자산 중 일부는 RSI(상대강도지수)가 중립 구간에 머물며 거품이 빠진 정직한 가격대를 형성하고 있습니다. 본질적인 펀더멘털(장기 구조)이 훼손되지 않았다면, 대중이 외면하는 지금이 장기 투자자에게는 가장 안전한 진입 구간이 될 수 있습니다.`,
            quote: '"환호 속에서는 경계하고, 침묵 속에서는 준비하라."',
            ctaTitle: '여러분의 생각은?',
            ctaContent: '현재 가장 저평가되었다고 생각하는 우주 종목이 있다면 의견을 나눠주세요!',
            backBtn: '뒤로',
            footer: 'TranTradingLab | 2026 우주 경제 투자 가이드'
        },
        zh: {
            badge: '2026投资策略',
            title: '错过了$RKLB和$ASTS？',
            subtitle: "关注'太空经济:第二阶段'全栈生态系统",
            intro: `如果要说最近市场上最火的股票，那一定是**$ASTS(AST SpaceMobile)**和**$RKLB(Rocket Lab)**。但如果您看到它们的暴涨就觉得"是不是已经晚了？"，那您可能只看到了太空产业这股浪潮的一半。`,
            phase2Title: '第二阶段：全栈生态系统',
            phase2Content: '2026年，太空产业将超越单纯的期待感，进入**全栈生态系统(Full Stack Ecosystem)**阶段。现在是时候关注整个产业供应链和基础设施创造收益的结构，而不仅仅是个股的涨势。',
            sectorsTitle: '太空产业版图：五大核心板块',
            sectorsSubtitle: '太空经济不仅仅是发射火箭。从发射到地面数据收集，请关注整个生态系统。',
            insightTitle: '投资洞察：为什么是现在？',
            insightContent: `许多投资者在股价暴涨时贪婪地高价买入，在调整来临时恐慌地止损。但真正的收益总是来自于守住那些大众关注较少的"关卡"。

目前太空产业部分核心资产的RSI（相对强弱指标）处于中性区间，形成了泡沫消退后的诚实价位。如果基本面（长期结构）没有受到破坏，那么当大众视而不见的现在，对于长期投资者来说可能是最安全的入场时机。`,
            quote: '"欢呼声中保持警惕，沉寂中做好准备。"',
            ctaTitle: '您怎么看？',
            ctaContent: '如果您认为有被低估的太空股票，欢迎分享您的观点！',
            backBtn: '返回',
            footer: 'TranTradingLab | 2026太空经济投资指南'
        },
        en: {
            badge: '2026 Investment Strategy',
            title: 'Missed $RKLB and $ASTS?',
            subtitle: "Focus on 'Space Economy: Phase 2' Full Stack Ecosystem",
            intro: `If you had to name the hottest stocks in the market recently, it would undoubtedly be **$ASTS (AST SpaceMobile)** and **$RKLB (Rocket Lab)**. But if you're watching their surge thinking "Is it too late?", you might only be seeing half of the massive wave in the space industry.`,
            phase2Title: 'Phase 2: Full Stack Ecosystem',
            phase2Content: 'In 2026, the space industry moves beyond mere expectations into the **Full Stack Ecosystem** phase. It\'s time to focus on the structure where the entire industry\'s supply chain and infrastructure generate returns, not just individual stock rallies.',
            sectorsTitle: 'Space Industry Landscape: 5 Key Sectors',
            sectorsSubtitle: 'The space economy isn\'t just about launching rockets. From launch to ground data collection, pay attention to the entire ecosystem.',
            insightTitle: 'Investment Insight: Why Now?',
            insightContent: `Many investors greedily buy high when stocks surge, then fearfully cut losses during corrections. But true returns always come from guarding the "chokepoints" where the crowd pays less attention.

Currently, some core assets in the space industry have RSI (Relative Strength Index) in the neutral zone, forming honest price levels after the froth has cleared. If the fundamental long-term structure remains intact, now—when the crowd looks away—could be the safest entry zone for long-term investors.`,
            quote: '"Be cautious amid cheers, prepare in silence."',
            ctaTitle: 'What do you think?',
            ctaContent: 'If you think there\'s an undervalued space stock, share your thoughts!',
            backBtn: 'Back',
            footer: 'TranTradingLab | 2026 Space Economy Investment Guide'
        }
    }

    const t = content[language] || content.en

    return (
        <div style={styles.container}>
            <article style={styles.article}>
                {/* Back Button */}
                <button onClick={onBack} style={styles.backBtn}>
                    <ArrowLeft size={18} />
                    <span>{t.backBtn}</span>
                </button>

                {/* Hero Section */}
                <header style={styles.hero}>
                    <div style={styles.heroOverlay}>
                        <div style={styles.badge}>
                            <Rocket size={14} />
                            <span>{t.badge}</span>
                        </div>
                        <h1 style={styles.title}>{t.title}</h1>
                        <p style={styles.subtitle}>{t.subtitle}</p>
                    </div>
                </header>

                {/* Hero Image */}
                <div style={styles.heroImage}>
                    <img
                        src="/space-economy-hero.png"
                        alt="Space Economy"
                        style={styles.heroImg}
                    />
                </div>

                {/* Intro Section */}
                <section style={styles.section}>
                    <p style={styles.introText}>{t.intro}</p>
                </section>

                {/* Phase 2 Section */}
                <section style={styles.phaseSection}>
                    <div style={styles.phaseBadge}>
                        <Target size={16} />
                        <span>{t.phase2Title}</span>
                    </div>
                    <p style={styles.phaseContent}>{t.phase2Content}</p>
                </section>

                {/* Sectors Title */}
                <section style={styles.section}>
                    <h2 style={styles.sectorsTitle}>
                        🚀 {t.sectorsTitle}
                    </h2>
                    <p style={styles.sectorsSubtitle}>{t.sectorsSubtitle}</p>
                </section>

                {/* Infographic Image */}
                <div style={styles.infographicWrapper}>
                    <img
                        src="/space-sectors-infographic.png"
                        alt="Space Sectors Infographic"
                        style={styles.infographicImg}
                    />
                </div>

                {/* Sectors Grid */}
                <div style={styles.sectorsGrid}>
                    {sectors.map((sector) => {
                        const IconComponent = sector.icon
                        return (
                            <div key={sector.id} style={styles.sectorCard}>
                                <div style={styles.sectorHeader}>
                                    <div style={{
                                        ...styles.sectorIcon,
                                        background: sector.gradient
                                    }}>
                                        <IconComponent size={24} color="#fff" />
                                    </div>
                                    <div style={styles.sectorTitleWrapper}>
                                        <h3 style={styles.sectorTitle}>{getTitle(sector)}</h3>
                                        <p style={styles.sectorSubtitle}>{getSubtitle(sector)}</p>
                                    </div>
                                </div>

                                <div style={styles.stocksGrid}>
                                    {sector.stocks.map((stock, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                ...styles.stockChip,
                                                borderColor: stock.hot ? sector.color : '#334155'
                                            }}
                                        >
                                            <span style={{
                                                ...styles.stockTicker,
                                                color: stock.hot ? sector.color : '#60a5fa'
                                            }}>
                                                ${stock.ticker}
                                            </span>
                                            {stock.hot && (
                                                <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <p style={styles.sectorNotes}>
                                    <ChevronRight size={14} style={{ color: sector.color }} />
                                    {getNotes(sector)}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Satellite Network Image */}
                <div style={styles.imageSection}>
                    <img
                        src="/satellite-network.png"
                        alt="Satellite Network"
                        style={styles.sectionImg}
                    />
                </div>

                {/* Investment Insight */}
                <section style={styles.insightSection}>
                    <h2 style={styles.insightTitle}>
                        🔭 {t.insightTitle}
                    </h2>
                    <p style={styles.insightContent}>{t.insightContent}</p>

                    {/* Investment Chart Image */}
                    <div style={styles.chartWrapper}>
                        <img
                            src="/space-investment-chart.png"
                            alt="Space Investment Chart"
                            style={styles.chartImg}
                        />
                    </div>

                    <blockquote style={styles.quote}>
                        {t.quote}
                    </blockquote>
                </section>

                {/* CTA Section */}
                <section style={styles.ctaSection}>
                    <div style={styles.ctaCard}>
                        <MessageCircle size={32} style={{ color: '#60a5fa' }} />
                        <h3 style={styles.ctaTitle}>💡 {t.ctaTitle}</h3>
                        <p style={styles.ctaContent}>{t.ctaContent}</p>
                    </div>
                </section>

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
        maxWidth: 900,
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
    hero: {
        textAlign: 'center',
        marginBottom: 24
    },
    heroOverlay: {
        padding: '40px 20px'
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        borderRadius: 24,
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: 28,
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
    },
    title: {
        margin: 0,
        fontSize: '2.2rem',
        fontWeight: 800,
        lineHeight: 1.3,
        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: '16px 0 0',
        fontSize: '1.15rem',
        color: '#94a3b8',
        fontWeight: 500
    },
    heroImage: {
        marginBottom: 40,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #1e293b'
    },
    heroImg: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    section: {
        marginBottom: 40
    },
    introText: {
        fontSize: '1.1rem',
        lineHeight: 1.9,
        color: '#cbd5e1',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: 24,
        borderRadius: 12,
        border: '1px solid #334155'
    },
    phaseSection: {
        marginBottom: 48,
        padding: 32,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: 16,
        border: '1px solid rgba(99, 102, 241, 0.3)'
    },
    phaseBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: 8,
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: 16
    },
    phaseContent: {
        margin: 0,
        fontSize: '1.05rem',
        lineHeight: 1.8,
        color: '#c7d2fe'
    },
    sectorsTitle: {
        fontSize: '1.6rem',
        fontWeight: 700,
        color: '#fff',
        marginBottom: 12
    },
    sectorsSubtitle: {
        fontSize: '1rem',
        color: '#94a3b8',
        marginTop: 0
    },
    infographicWrapper: {
        marginBottom: 40,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #334155',
        background: '#f8fafc'
    },
    infographicImg: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    sectorsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        marginBottom: 48
    },
    sectorCard: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 16,
        padding: 24,
        border: '1px solid #334155',
        transition: 'all 0.3s ease'
    },
    sectorHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 16
    },
    sectorIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    sectorTitleWrapper: {
        flex: 1
    },
    sectorTitle: {
        margin: 0,
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#fff'
    },
    sectorSubtitle: {
        margin: '4px 0 0',
        fontSize: '0.9rem',
        color: '#94a3b8'
    },
    stocksGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12
    },
    stockChip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 8,
        border: '1px solid #334155',
        fontSize: '0.85rem'
    },
    stockTicker: {
        fontFamily: 'monospace',
        fontWeight: 600
    },
    sectorNotes: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        margin: 0,
        fontSize: '0.85rem',
        color: '#64748b',
        fontStyle: 'italic'
    },
    imageSection: {
        marginBottom: 48,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #334155'
    },
    sectionImg: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    insightSection: {
        marginBottom: 48
    },
    insightTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#fff',
        marginBottom: 20
    },
    insightContent: {
        fontSize: '1.05rem',
        lineHeight: 1.9,
        color: '#cbd5e1',
        whiteSpace: 'pre-line',
        marginBottom: 24
    },
    chartWrapper: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #334155'
    },
    chartImg: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    quote: {
        margin: '24px 0 0',
        padding: '20px 28px',
        borderLeft: '4px solid #f59e0b',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
        borderRadius: '0 12px 12px 0',
        fontStyle: 'italic',
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#fbbf24'
    },
    ctaSection: {
        marginBottom: 48
    },
    ctaCard: {
        textAlign: 'center',
        padding: 40,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
        borderRadius: 20,
        border: '1px solid rgba(59, 130, 246, 0.3)'
    },
    ctaTitle: {
        margin: '16px 0 8px',
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#fff'
    },
    ctaContent: {
        margin: 0,
        fontSize: '1rem',
        color: '#94a3b8'
    },
    footer: {
        textAlign: 'center',
        padding: '32px 0',
        borderTop: '1px solid #1e293b',
        fontSize: '0.9rem',
        color: '#475569'
    }
}

export default SpaceEconomyArticle
