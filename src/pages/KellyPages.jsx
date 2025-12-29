import React, { useState } from 'react'
import { useNavigate as useNav, Link } from 'react-router-dom'
import { ArrowLeft, Home, Calculator, TrendingUp, FileText, ChevronRight } from 'lucide-react'
import KellyArticle from '../components/experiments/KellyArticle'
import KellySimulator from '../components/experiments/KellySimulator'
import { useI18n } from '../hooks/useI18n'

// 凯利公式完整教程页面 - 可分享的bundle页面
export function KellyCompletePage() {
    const navigate = useNav()
    const { language } = useI18n()
    const [activeView, setActiveView] = useState(null) // null, 'article', 'simulator'

    const getText = (zh, ko, en) => language === 'zh' ? zh : language === 'ko' ? ko : en

    // 如果选择了具体视图，显示对应组件
    if (activeView === 'article') {
        return (
            <div style={styles.page}>
                <header style={styles.header}>
                    <nav style={styles.nav}>
                        <Link to="/" style={styles.homeLink}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <span style={styles.navDivider}>/</span>
                        <button onClick={() => setActiveView(null)} style={styles.navLink}>
                            {getText('凯利公式', '켈리 공식', 'Kelly')}
                        </button>
                        <span style={styles.navDivider}>/</span>
                        <span style={styles.navCurrent}>{getText('文章', '문서', 'Article')}</span>
                    </nav>
                    <button onClick={() => setActiveView('simulator')} style={styles.simulatorBtn}>
                        <Calculator size={16} />
                        <span>{getText('模拟器', '시뮬레이터', 'Simulator')}</span>
                    </button>
                </header>
                <KellyArticle
                    onBack={() => setActiveView(null)}
                    onOpenSimulator={() => setActiveView('simulator')}
                />
            </div>
        )
    }

    if (activeView === 'simulator') {
        return (
            <div style={styles.page}>
                <header style={styles.header}>
                    <nav style={styles.nav}>
                        <Link to="/" style={styles.homeLink}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <span style={styles.navDivider}>/</span>
                        <button onClick={() => setActiveView(null)} style={styles.navLink}>
                            {getText('凯利公式', '켈리 공식', 'Kelly')}
                        </button>
                        <span style={styles.navDivider}>/</span>
                        <span style={styles.navCurrent}>{getText('模拟器', '시뮬레이터', 'Simulator')}</span>
                    </nav>
                    <button onClick={() => setActiveView('article')} style={styles.articleBtn}>
                        <FileText size={16} />
                        <span>{getText('文章', '문서', 'Article')}</span>
                    </button>
                </header>
                <div style={styles.content}>
                    <KellySimulator onBack={() => setActiveView(null)} />
                </div>
            </div>
        )
    }

    // Bundle选择页面
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.homeLink}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    <span style={styles.navDivider}>/</span>
                    <span style={styles.navCurrent}>{getText('凯利公式完整教程', '켈리 공식 완전 가이드', 'Kelly Complete Guide')}</span>
                </nav>
            </header>
            <div style={styles.bundlePage}>
                <div style={styles.bundleContainer}>
                    <Calculator size={64} style={{ color: '#00ff88' }} />
                    <h1 style={styles.bundleTitle}>
                        {getText('凯利公式完整教程', '켈리 공식 완전 가이드', 'Kelly Criterion Complete Guide')}
                    </h1>
                    <p style={styles.bundleDesc}>
                        {getText(
                            '包含深度文章解析和蒙特卡洛模拟器，完整掌握凯利公式的数学原理与实战应用。',
                            '심층 분석 문서와 몬테카를로 시뮬레이터를 포함. 켈리 공식의 수학적 원리와 실전 적용을 완벽하게 마스터하세요.',
                            'Complete package with in-depth article and Monte Carlo simulator. Master Kelly Criterion math and practical application.'
                        )}
                    </p>
                    <div style={styles.bundleButtons}>
                        <button onClick={() => setActiveView('article')} style={styles.bundleBtn}>
                            <FileText size={24} />
                            <span>{getText('📖 理论文章', '📖 이론 문서', '📖 Theory Article')}</span>
                            <ChevronRight size={20} />
                        </button>
                        <button onClick={() => setActiveView('simulator')} style={styles.bundleBtnAlt}>
                            <Calculator size={24} />
                            <span>{getText('🧮 模拟器', '🧮 시뮬레이터', '🧮 Simulator')}</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 凯利公式文章独立页面
export function KellyArticlePage() {
    const navigate = useNav()
    const { language } = useI18n()

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.homeLink}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    <span style={styles.navDivider}>/</span>
                    <span style={styles.navCurrent}>
                        {language === 'ko' ? '켈리 공식' : language === 'zh' ? '凯利公式' : 'Kelly Criterion'}
                    </span>
                </nav>
                <Link to="/tools/kelly-simulator" style={styles.simulatorBtn}>
                    <Calculator size={16} />
                    <span>{language === 'ko' ? '시뮬레이터' : language === 'zh' ? '模拟器' : 'Simulator'}</span>
                </Link>
            </header>
            <KellyArticle
                onBack={() => navigate('/')}
                onOpenSimulator={() => navigate('/tools/kelly-simulator')}
            />
        </div>
    )
}

// 凯利模拟器独立页面
export function KellySimulatorPage() {
    const navigate = useNav()
    const { language } = useI18n()

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.homeLink}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    <span style={styles.navDivider}>/</span>
                    <Link to="/article/kelly-criterion" style={styles.navLink}>
                        {language === 'ko' ? '문서' : language === 'zh' ? '文章' : 'Article'}
                    </Link>
                    <span style={styles.navDivider}>/</span>
                    <span style={styles.navCurrent}>
                        {language === 'ko' ? '시뮬레이터' : language === 'zh' ? '模拟器' : 'Simulator'}
                    </span>
                </nav>
            </header>
            <div style={styles.content}>
                <KellySimulator onBack={() => navigate('/article/kelly-criterion')} />
            </div>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: 'rgba(2, 4, 8, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.9rem'
    },
    homeLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#00ff88',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'opacity 0.2s'
    },
    navDivider: {
        color: '#475569'
    },
    navLink: {
        color: '#94a3b8',
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'color 0.2s'
    },
    navCurrent: {
        color: '#64748b'
    },
    simulatorBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        borderRadius: 8,
        color: '#fff',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 0.2s'
    },
    articleBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
        borderRadius: 8,
        color: '#fff',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 0.2s'
    },
    content: {
        paddingTop: 56,
        height: '100vh',
        boxSizing: 'border-box'
    },
    bundlePage: {
        paddingTop: 80,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bundleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24,
        maxWidth: 600,
        textAlign: 'center'
    },
    bundleTitle: {
        margin: '24px 0 16px',
        fontSize: '2rem',
        fontWeight: 800,
        color: '#fff'
    },
    bundleDesc: {
        margin: '0 0 32px',
        fontSize: '1rem',
        color: '#94a3b8',
        lineHeight: 1.8
    },
    bundleButtons: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    bundleBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 28px',
        background: 'rgba(129, 140, 248, 0.15)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        borderRadius: 14,
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    bundleBtnAlt: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 28px',
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: 14,
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
}

