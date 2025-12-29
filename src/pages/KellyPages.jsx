import React from 'react'
import { useNavigate as useNav, Link } from 'react-router-dom'
import { ArrowLeft, Home, Calculator, TrendingUp } from 'lucide-react'
import KellyArticle from '../components/experiments/KellyArticle'
import KellySimulator from '../components/experiments/KellySimulator'
import { useI18n } from '../hooks/useI18n'

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
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 0.2s'
    },
    content: {
        paddingTop: 56,
        height: '100vh',
        boxSizing: 'border-box'
    }
}
