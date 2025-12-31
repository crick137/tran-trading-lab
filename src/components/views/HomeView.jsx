import React, { useState, useEffect } from 'react'
import {
    BarChart3, Globe, GraduationCap,
    ArrowRight, Sparkles, TrendingUp, Star,
    Activity, Award, Rocket, Zap
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import { useAppState } from '../../context/AppContext'
import NewsletterSubscribe from '../NewsletterSubscribe'
import HeroChart from '../visuals/HeroChart'

/**
 * HomeView - Luminous Dark Version (Now with Light Mode!)
 */
function HomeView({ onNavigate }) {
    const { t, language } = useI18n()
    const { theme } = useAppState()
    const isDark = theme === 'dark'

    const [stats, setStats] = useState({})
    const [recentBriefs, setRecentBriefs] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredModule, setHoveredModule] = useState(null)

    // System Selector Config
    const tradingSystems = [
        { id: 'orb', name: 'ORB System', color: '#00ffa3' }, // Intense Green (User's screenshot)
        { id: 'alpha', name: 'Alpha Trend', color: '#00f2ff' }, // Electric Cyan
        { id: 'gamma', name: 'Gamma Scalp', color: '#bd00ff' }, // Deep Violet
    ]
    const [activeSystemId, setActiveSystemId] = useState('orb')
    const activeSystem = tradingSystems.find(s => s.id === activeSystemId) || tradingSystems[0]

    // Palette: Electric Cyan(#00f2ff), Deep Violet(#bd00ff)
    const moduleConfig = [
        { id: 'dashboard', icon: BarChart3, color: '#00f2ff', bg: 'rgba(0,242,255,0.08)' }, // Cyan
        { id: 'analysis', icon: TrendingUp, color: '#bd00ff', bg: 'rgba(189,0,255,0.08)' }, // Violet
        { id: 'news', icon: Globe, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' }, // Gold/Amber (Keep as accent)
        { id: 'lab', icon: GraduationCap, color: isDark ? '#ffffff' : '#333333', bg: 'rgba(255,255,255,0.08)' }, // White/Platinum
    ]

    useEffect(() => {
        const loadData = async () => {
            try {
                const [briefs, analysis, news, courses] = await Promise.all([
                    db.getAll(TABLES.BRIEFS, { filters: { is_published: true } }),
                    db.getAll(TABLES.ANALYSIS, { filters: { is_published: true } }),
                    db.getAll(TABLES.NEWS, { filters: { is_published: true } }),
                    db.getAll(TABLES.LAB_COURSES, { filters: { is_published: true } }),
                ])
                setStats({
                    brief: briefs?.length || 0,
                    analysis: analysis?.length || 0,
                    news: news?.length || 0,
                    lab: courses?.length || 0,
                })
                setRecentBriefs(briefs?.slice(0, 3) || [])
            } catch (err) {
                console.error('Failed to load home data:', err)
            }
            setLoading(false)
        }
        loadData()
    }, [])

    const handleModuleClick = (moduleId) => {
        if (onNavigate) onNavigate(moduleId)
    }

    // Dynamic Styles based on theme
    const currentStyles = {
        ...styles,
        hero: {
            ...styles.hero,
            background: isDark ? '#050505' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: isDark ? 'none' : '0 20px 40px -10px rgba(0,0,0,0.05)',
        },
        heroTitleMain: {
            ...styles.heroTitleMain,
            color: isDark ? '#fff' : '#1a1a1a',
        },
        heroDesc: {
            ...styles.heroDesc,
            color: isDark ? '#888' : '#666',
        },
        sectionTitle: {
            ...styles.sectionTitle,
            color: isDark ? '#fff' : '#1a1a1a',
        },
        moduleCard: {
            ...styles.moduleCard,
            background: isDark ? '#0a0a0a' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
        },
        chartContainer: {
            ...styles.chartContainer,
            // Temporarily remove mask to ensure visibility
            // maskImage: isDark
            //    ? 'linear-gradient(to bottom, black 80%, transparent 100%)'
            //    : 'linear-gradient(to bottom, black 90%, transparent 100%)',
            height: 400, // Explicit height
        },
        chartOverlay: {
            ...styles.chartOverlay,
            // Simplify overlay to ensure it's not blocking
            background: 'transparent',
        }
    }

    return (
        <div style={styles.container}>
            {/* Hero Section - 2 Column Layout */}
            <section style={currentStyles.hero}>
                <div style={styles.heroBg}>
                    <div style={styles.heroGlow1} />
                    <div style={styles.heroGlow2} />
                </div>

                <div style={styles.heroGrid}>
                    {/* Left Column: Text & Stats */}
                    <div style={styles.heroLeft}>
                        <div style={styles.badgeRow}>
                            <div style={styles.liveBadge}>
                                <div style={styles.liveIndicator} />
                                <span>SYSTEM ONLINE</span>
                            </div>
                            <div style={styles.badge}>
                                <Zap size={14} fill="currentColor" />
                                <span>{t('home.badge')}</span>
                            </div>
                        </div>

                        <h1 style={styles.heroTitle}>
                            <span style={currentStyles.heroTitleMain}>TRAN</span>
                            <span style={styles.heroTitleGradient}>Trading Lab</span>
                        </h1>

                        <p style={currentStyles.heroDesc}>{t('home.heroDesc')}</p>

                        <div style={styles.statsRow}>
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{stats?.brief || 0}</span>
                                <span style={styles.statLabel}>BRIEFS</span>
                            </div>
                            <div style={styles.statDivider} />
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{stats?.analysis || 0}</span>
                                <span style={styles.statLabel}>REPORTS</span>
                            </div>
                            <div style={styles.statDivider} />
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{stats?.lab || 0}</span>
                                <span style={styles.statLabel}>COURSES</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic K-Line Chart */}
                    <div style={styles.heroRight}>
                        <div style={currentStyles.chartContainer}>
                            <div style={styles.chartHeader}>
                                <div style={styles.chartTag}>BTC/USD</div>
                                <div style={{ color: activeSystem.color, fontSize: 13, fontWeight: 700 }}>+2.45%</div>
                            </div>

                            {/* System Selector - Floating Glass UI */}
                            <div style={styles.systemSelector}>
                                {tradingSystems.map(sys => (
                                    <div
                                        key={sys.id}
                                        onClick={() => setActiveSystemId(sys.id)}
                                        style={{
                                            ...styles.systemTab,
                                            background: activeSystemId === sys.id ? `${sys.color}20` : 'transparent',
                                            color: activeSystemId === sys.id ? sys.color : 'rgba(255,255,255,0.4)',
                                            border: activeSystemId === sys.id ? `1px solid ${sys.color}40` : '1px solid transparent',
                                        }}
                                    >
                                        <div style={{
                                            ...styles.systemDot,
                                            background: sys.color,
                                            boxShadow: activeSystemId === sys.id ? `0 0 8px ${sys.color}` : 'none',
                                            opacity: activeSystemId === sys.id ? 1 : 0.3
                                        }} />
                                        {sys.name}
                                    </div>
                                ))}
                            </div>

                            {/* Insert HeroChart with dynamic system color */}
                            <HeroChart theme={theme} accentColor={activeSystem.color} />

                            {/* Decorative Overlay - Tinted by system color */}
                            <div style={{
                                ...currentStyles.chartOverlay,
                                background: `linear-gradient(180deg, transparent 0%, transparent 80%, ${activeSystem.color}05 100%)`
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Modules Grid */}
            <section style={styles.modulesSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={currentStyles.sectionTitle}>
                        <Rocket size={22} style={{ color: '#00f2ff' }} />
                        {t('home.exploreModules')}
                    </h2>
                </div>

                <div style={styles.modulesGrid}>
                    {moduleConfig.map((mod, index) => {
                        const moduleText = t(`home.modules.${mod.id}`)
                        const isHovered = hoveredModule === mod.id

                        return (
                            <article
                                key={mod.id}
                                style={{
                                    ...currentStyles.moduleCard,
                                    animationDelay: `${index * 0.08}s`,
                                    transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
                                    boxShadow: isHovered
                                        ? `0 20px 40px -10px ${mod.color}20, 0 0 0 1px ${mod.color}40`
                                        : (isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)'),
                                    borderColor: isHovered ? `${mod.color}50` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                                }}
                                onClick={() => handleModuleClick(mod.id)}
                                onMouseEnter={() => setHoveredModule(mod.id)}
                                onMouseLeave={() => setHoveredModule(null)}
                            >
                                <div style={{
                                    ...styles.cardGlow,
                                    background: `radial-gradient(circle at top right, ${mod.color}15 0%, transparent 60%)`,
                                    opacity: isHovered ? 1 : 0.5,
                                }} />

                                <div style={{
                                    ...styles.moduleIcon,
                                    color: mod.color,
                                    background: `linear-gradient(135deg, ${mod.color}10 0%, transparent 100%)`,
                                    borderColor: `${mod.color}20`
                                }}>
                                    <mod.icon size={28} strokeWidth={1.5} />
                                </div>

                                <div style={styles.moduleContent}>
                                    <h3 style={{ ...styles.moduleTitle, color: isDark ? '#fff' : '#1a1a1a' }}>
                                        {(moduleText && typeof moduleText === 'object' && moduleText.title) ? moduleText.title : mod.id.toUpperCase()}
                                    </h3>
                                    <p style={{ ...styles.moduleDesc, color: isDark ? '#888' : '#666' }}>
                                        {(moduleText && typeof moduleText === 'object' && moduleText.desc) ? moduleText.desc : 'Explore market data and tools'}
                                    </p>
                                </div>

                                <div style={{
                                    ...styles.moduleArrow,
                                    color: isHovered ? '#fff' : 'rgba(255,255,255,0.3)',
                                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                }}>
                                    <ArrowRight size={18} />
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* Newsletter Subscription */}
            <section style={{ marginBottom: 40 }}>
                <NewsletterSubscribe />
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <Star size={18} style={{ color: '#00f2ff' }} />
                        <span>TRAN Trading Lab</span>
                    </div>
                    <p style={styles.footerText}>{t('home.footerText')}</p>
                </div>
            </footer>
        </div>
    )
}

const styles = {
    container: {
        padding: '32px 40px',
        height: '100%',
        overflow: 'auto',
        maxWidth: 1600,
        margin: '0 auto',
    },
    // Hero
    hero: {
        position: 'relative',
        marginBottom: 56,
        borderRadius: 32,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        // Deep glass effect
        background: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(40px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset', // Inner rim
    },
    heroBg: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
    },
    heroGlow1: {
        position: 'absolute',
        top: -150,
        left: '10%',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(0,242,255,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        opacity: 0.8,
    },
    heroGlow2: {
        position: 'absolute',
        bottom: -150,
        right: '5%',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(189,0,255,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        opacity: 0.8,
    },
    heroGrid: {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 60, // More breathing room
        padding: '56px',
        zIndex: 1,
    },
    heroLeft: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    heroRight: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 420,
    },
    // Right Chart Styles
    chartContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    chartTag: {
        fontSize: 12,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.8)',
        background: 'rgba(255,255,255,0.08)',
        padding: '4px 10px',
        borderRadius: 8,
        backdropFilter: 'blur(4px)',
        letterSpacing: '0.05em',
    },
    systemSelector: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 20,
        display: 'flex',
        gap: 6,
        background: 'rgba(0,0,0,0.3)',
        padding: 4,
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    systemTab: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    systemDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        transition: 'all 0.3s ease',
    },
    chartOverlay: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        // Smoother fade out at bottom
        background: 'linear-gradient(180deg, transparent 0%, transparent 85%, rgba(0,0,0,0.6) 100%)',
    },
    // Left Content Styles
    badgeRow: {
        display: 'flex',
        gap: 12,
        marginBottom: 28,
    },
    liveBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'rgba(0,242,255,0.08)',
        border: '1px solid rgba(0,242,255,0.2)',
        borderRadius: 100,
        color: '#00f2ff',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        boxShadow: '0 0 20px rgba(0,242,255,0.1)',
        backdropFilter: 'blur(4px)',
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#00f2ff',
        boxShadow: '0 0 8px #00f2ff',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 100,
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        backdropFilter: 'blur(4px)',
    },
    heroTitle: {
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    heroTitleMain: {
        fontSize: 72, // Larger
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-3px', // Tighter
        lineHeight: 0.95,
    },
    heroTitleGradient: {
        fontSize: 60,
        fontWeight: 800,
        // Premium Tricolor Gradient
        background: 'linear-gradient(135deg, #fff 10%, #00f2ff 50%, #bd00ff 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-1.5px',
        paddingBottom: 10, // Prevent clip
    },
    heroDesc: {
        margin: '28px 0 40px',
        fontSize: 19,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.6,
        maxWidth: 540,
        letterSpacing: '-0.01em',
    },
    statsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        padding: '24px 32px',
        background: 'rgba(255,255,255,0.02)', // lighter glass
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        width: 'fit-content',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace", // Technical font
        letterSpacing: '-0.03em',
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600,
    },
    statDivider: {
        width: 1,
        height: 36,
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
    },
    // Modules
    modulesSection: {
        marginBottom: 60,
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.02em',
    },
    modulesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
    },
    moduleCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '28px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        opacity: 0,
        backdropFilter: 'blur(10px)',
    },
    cardGlow: {
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        borderRadius: 24,
    },
    moduleIcon: {
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        border: '1px solid',
        flexShrink: 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    moduleContent: {
        flex: 1,
        minWidth: 0,
    },
    moduleTitle: {
        margin: '0 0 6px',
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.01em',
    },
    moduleDesc: {
        margin: 0,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.5,
    },
    moduleArrow: {
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    // Footer
    footer: {
        padding: '48px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: 80,
    },
    footerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
    },
    footerBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 16,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.8)',
    },
    footerText: {
        margin: 0,
        fontSize: 13,
        color: 'rgba(255,255,255,0.3)',
    },
}

// Global Anims
const styleSheet = document.createElement('style')
styleSheet.textContent = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.95); }
}
@media (max-width: 900px) {
    .hero-grid-responsive {
        grid-template-columns: 1fr !important;
    }
}
`
if (!document.head.querySelector('#home-view-styles-v3')) {
    styleSheet.id = 'home-view-styles-v3'
    document.head.appendChild(styleSheet)
}

// Inject responsive class manually since we are using inline styles
styles.heroGrid = {
    ...styles.heroGrid,
    '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
    }
}

export default HomeView

