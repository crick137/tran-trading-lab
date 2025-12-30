import React from 'react'
import { Link } from 'react-router-dom'
import {
    BookOpen, Calculator, TrendingUp, BarChart3,
    Target, Shield, Lightbulb, ArrowRight, Home,
    FileText, Wrench, GraduationCap
} from 'lucide-react'
import { useI18n } from '../hooks/useI18n'
import { useAppActions } from '../context/AppContext'

// 专栏 - 展示深度文章
function ContentLibrary() {
    const { language } = useI18n()
    const { setLanguage } = useAppActions()

    // 文章列表
    const articles = [
        {
            id: 'kelly-criterion',
            slug: '/article/kelly-criterion',
            titleZh: '凯利公式：资金管理的秘密',
            titleEn: 'Kelly Criterion: Secret of Money Management',
            titleKo: '켈리 공식: 자금 관리의 비밀',
            descZh: '为什么胜率60%账户还是会归零？深入理解凯利公式的数学原理。',
            descEn: 'Why does a 60% win rate still lead to zero? Deep dive into Kelly math.',
            descKo: '왜 승률 60%인데 계좌는 0원이 될까? 켈리 공식의 수학적 원리.',
            icon: Target,
            color: '#818cf8',
            tag: { zh: '资金管理', en: 'Money Management', ko: '자금 관리' }
        },
        {
            id: 'howard-marks-bubble',
            slug: '/article/howard-marks-bubble',
            titleZh: '霍华德·马克斯：这是泡沫吗？',
            titleEn: 'Howard Marks: Is This a Bubble?',
            titleKo: '하워드 막스: 이것은 버블인가?',
            descZh: '橡树资本创始人深入深度解析 AI 浪潮与历史资产泡沫的异同。',
            descEn: 'Oaktree founder deep dives into the AI wave vs historical market bubbles.',
            descKo: '오크트리 창업자가 분석하는 AI 열풍과 역사적 자산 버블의 공통점과 차이점.',
            icon: TrendingUp,
            color: '#fbbf24',
            tag: { zh: '市场洞察', en: 'Market Insights', ko: '시장 인사이트' }
        }
    ]

    const getTitle = (item) => language === 'zh' ? item.titleZh : language === 'ko' ? item.titleKo : item.titleEn
    const getDesc = (item) => language === 'zh' ? item.descZh : language === 'ko' ? item.descKo : item.descEn
    const getTag = (item) => item.tag ? (language === 'zh' ? item.tag.zh : language === 'ko' ? item.tag.ko : item.tag.en) : null

    const texts = {
        zh: {
            title: '深度专栏',
            subtitle: '顶级投资人的思考与洞见',
            articlesTitle: '精选文章',
            toolsTitle: '互动工具',
            comingSoon: '更多深度内容即将上线...',
            readArticle: '阅读全文',
            openTool: '打开工具',
            home: '首页'
        },
        en: {
            title: 'Deep Column',
            subtitle: 'Insights from Top Investors',
            articlesTitle: 'Featured Articles',
            toolsTitle: 'Interactive Tools',
            comingSoon: 'More deep content coming soon...',
            readArticle: 'Read Full Article',
            openTool: 'Open Tool',
            home: 'Home'
        },
        ko: {
            title: '심층 칼럼',
            subtitle: '최고 투자자들의 통찰과 인사이트',
            articlesTitle: '추천 기사',
            toolsTitle: '인터랙티브 도구',
            comingSoon: '더 많은 심층 콘텐츠가 곧 출시됩니다...',
            readArticle: '전체 읽기',
            openTool: '도구 열기',
            home: '홈'
        }
    }

    const t = texts[language] || texts.en

    return (
        <div style={styles.page}>
            {/* Header */}
            <header style={styles.header}>
                <Link to="/" style={styles.homeLink}>
                    <Home size={20} />
                    <span>{t.home}</span>
                </Link>

                {/* Language Switcher */}
                <div style={styles.langSwitcher}>
                    <button
                        style={{ ...styles.langBtn, color: language === 'ko' ? '#00ff88' : '#64748b' }}
                        onClick={() => setLanguage('ko')}
                    >KR</button>
                    <span style={styles.divider}>|</span>
                    <button
                        style={{ ...styles.langBtn, color: language === 'zh' ? '#00ff88' : '#64748b' }}
                        onClick={() => setLanguage('zh')}
                    >CN</button>
                    <span style={styles.divider}>|</span>
                    <button
                        style={{ ...styles.langBtn, color: language === 'en' ? '#00ff88' : '#64748b' }}
                        onClick={() => setLanguage('en')}
                    >EN</button>
                </div>
            </header>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.badge}>
                        <BookOpen size={16} />
                        <span>TranTradingLab Column</span>
                    </div>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </div>
            </section>

            {/* Articles Section */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <FileText size={22} style={{ color: '#818cf8' }} />
                    {t.articlesTitle}
                </h2>
                <div style={styles.grid}>
                    {articles.map((article) => {
                        const IconComponent = article.icon
                        return (
                            <Link to={article.slug} key={article.id} style={styles.card}>
                                <div style={{ ...styles.cardIcon, background: `${article.color}15`, color: article.color }}>
                                    <IconComponent size={28} />
                                </div>
                                <div style={styles.cardContent}>
                                    {getTag(article) && (
                                        <span style={styles.tag}>{getTag(article)}</span>
                                    )}
                                    <h3 style={styles.cardTitle}>{getTitle(article)}</h3>
                                    <p style={styles.cardDesc}>{getDesc(article)}</p>
                                </div>
                                <div style={styles.cardAction}>
                                    <span>{t.readArticle}</span>
                                    <ArrowRight size={16} />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>




            {/* Coming Soon */}
            <section style={styles.comingSoon}>
                <Lightbulb size={24} style={{ color: '#f59e0b' }} />
                <span>{t.comingSoon}</span>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <span>© 2024 TranTradingLab | Financial Logic Studio</span>
            </footer>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #020408 0%, #0a0f1a 100%)',
        color: '#e2e8f0'
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 32px',
        background: 'rgba(2, 4, 8, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100
    },
    homeLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#00ff88',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.95rem'
    },
    hero: {
        paddingTop: 120,
        paddingBottom: 60,
        textAlign: 'center'
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 24px'
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
        marginBottom: 24
    },
    title: {
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: '16px 0 0',
        fontSize: '1.1rem',
        color: '#64748b'
    },
    section: {
        maxWidth: 900,
        margin: '0 auto',
        padding: '40px 24px'
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '0 0 24px',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#fff'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 16,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.3s ease'
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    cardContent: {
        flex: 1
    },
    tag: {
        display: 'inline-block',
        padding: '4px 10px',
        background: 'rgba(129, 140, 248, 0.15)',
        borderRadius: 6,
        fontSize: '0.75rem',
        color: '#818cf8',
        fontWeight: 600,
        marginBottom: 8
    },
    cardTitle: {
        margin: 0,
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#fff'
    },
    cardDesc: {
        margin: '8px 0 0',
        fontSize: '0.9rem',
        color: '#94a3b8',
        lineHeight: 1.5
    },
    cardAction: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid #334155',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#818cf8'
    },
    comingSoon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '40px 24px',
        fontSize: '1rem',
        color: '#64748b'
    },
    footer: {
        textAlign: 'center',
        padding: '40px 24px',
        borderTop: '1px solid #1e293b',
        fontSize: '0.85rem',
        color: '#475569'
    },
    langSwitcher: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    langBtn: {
        background: 'none',
        border: 'none',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        padding: 4,
        transition: 'color 0.2s',
    },
    divider: {
        color: '#334155',
        fontSize: 12,
    }
}

export default ContentLibrary
