import React, { useState, useEffect } from 'react'
import {
    Newspaper, BarChart3, Globe, GraduationCap, BookOpen, Wrench,
    ArrowRight, Sparkles, TrendingUp, Zap, Star, ChevronRight,
    Activity, Users, Clock, Award, Shield, Rocket
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import NewsletterSubscribe from '../NewsletterSubscribe'

/**
 * HomeView - 震撼视觉效果版本
 */
function HomeView({ onNavigate }) {
    const { t, language } = useI18n()
    const [stats, setStats] = useState({})
    const [recentBriefs, setRecentBriefs] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredModule, setHoveredModule] = useState(null)

    const moduleConfig = [
        { id: 'brief', icon: Newspaper, color: '#00ff88', bg: 'rgba(0,255,136,0.08)' },
        { id: 'analysis', icon: BarChart3, color: '#00d4ff', bg: 'rgba(0,212,255,0.08)' },
        { id: 'news', icon: Globe, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
        { id: 'lab', icon: GraduationCap, color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
        { id: 'note', icon: BookOpen, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
        { id: 'tools', icon: Wrench, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
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

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    const getImportanceLabel = (importance) => {
        switch (importance) {
            case 'high': return `🔴 ${t('home.urgent')}`
            case 'medium': return `🟡 ${t('home.important')}`
            default: return `🟢 ${t('home.normal')}`
        }
    }

    return (
        <div style={styles.container}>
            {/* Hero Section - 震撼开场 */}
            <section style={styles.hero}>
                {/* 动态背景效果 */}
                <div style={styles.heroOrbs}>
                    <div style={styles.orb1} />
                    <div style={styles.orb2} />
                    <div style={styles.orb3} />
                </div>

                <div style={styles.heroContent}>
                    <div style={styles.badgeRow}>
                        <div style={styles.liveBadge}>
                            <div style={styles.liveIndicator} />
                            <span>LIVE</span>
                        </div>
                        <div style={styles.badge}>
                            <Sparkles size={14} />
                            <span>{t('home.badge')}</span>
                        </div>
                    </div>

                    <h1 style={styles.heroTitle}>
                        <span style={styles.heroTitleMain}>TRAN</span>
                        <span style={styles.heroTitleGradient}>Trading Lab</span>
                    </h1>

                    <p style={styles.heroDesc}>{t('home.heroDesc')}</p>

                    {/* 实时统计 */}
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}><Activity size={24} /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statValue}>{stats.brief || 0}</span>
                                <span style={styles.statLabel}>{t('home.statBriefs')}</span>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={{ ...styles.statIcon, background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}><TrendingUp size={24} /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statValue}>{stats.analysis || 0}</span>
                                <span style={styles.statLabel}>{t('home.statAnalysis')}</span>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={{ ...styles.statIcon, background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}><Award size={24} /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statValue}>{stats.lab || 0}</span>
                                <span style={styles.statLabel}>{t('home.statCourses')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modules Grid - 精美卡片 */}
            <section style={styles.modulesSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>
                        <Rocket size={22} style={{ color: '#00ff88' }} />
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
                                    ...styles.moduleCard,
                                    animationDelay: `${index * 0.08}s`,
                                    transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                                    boxShadow: isHovered
                                        ? `0 25px 50px -12px ${mod.color}30, 0 0 0 1px ${mod.color}40`
                                        : '0 4px 24px rgba(0,0,0,0.4)',
                                    borderColor: isHovered ? `${mod.color}60` : 'rgba(255,255,255,0.06)',
                                }}
                                onClick={() => handleModuleClick(mod.id)}
                                onMouseEnter={() => setHoveredModule(mod.id)}
                                onMouseLeave={() => setHoveredModule(null)}
                            >
                                {/* 卡片发光效果 */}
                                <div style={{
                                    ...styles.cardGlow,
                                    background: `radial-gradient(circle at 50% 0%, ${mod.color}20 0%, transparent 70%)`,
                                    opacity: isHovered ? 1 : 0,
                                }} />

                                {/* 计数徽章 */}
                                {stats[mod.id] > 0 && (
                                    <div style={{
                                        ...styles.countBadge,
                                        background: mod.bg,
                                        color: mod.color,
                                        border: `1px solid ${mod.color}30`,
                                    }}>
                                        {stats[mod.id]}
                                    </div>
                                )}

                                <div style={{
                                    ...styles.moduleIcon,
                                    background: `linear-gradient(135deg, ${mod.color}15 0%, ${mod.color}05 100%)`,
                                    border: `1px solid ${mod.color}25`,
                                    color: mod.color,
                                    boxShadow: isHovered ? `0 0 30px ${mod.color}30` : 'none',
                                }}>
                                    <mod.icon size={32} strokeWidth={1.5} />
                                </div>

                                <div style={styles.moduleContent}>
                                    <h3 style={styles.moduleTitle}>{moduleText?.title}</h3>
                                    <p style={styles.moduleDesc}>{moduleText?.desc}</p>
                                </div>

                                <div style={{
                                    ...styles.moduleArrow,
                                    background: `linear-gradient(135deg, ${mod.color} 0%, ${mod.color}aa 100%)`,
                                    opacity: isHovered ? 1 : 0.7,
                                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                }}>
                                    <ArrowRight size={18} strokeWidth={2.5} />
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* Recent Briefs */}
            {recentBriefs.length > 0 && (
                <section style={styles.recentSection}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            <Newspaper size={22} style={{ color: '#00ff88' }} />
                            {t('home.recentBriefs')}
                        </h2>
                        <button style={styles.viewAllBtn} onClick={() => handleModuleClick('brief')}>
                            {t('home.viewAll')}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div style={styles.briefsList}>
                        {recentBriefs.map((brief, index) => (
                            <article
                                key={brief.id}
                                style={{
                                    ...styles.briefCard,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                onClick={() => handleModuleClick('brief')}
                            >
                                <div style={{
                                    ...styles.briefImportance,
                                    background: brief.importance === 'high' ? 'rgba(255,56,96,0.12)'
                                        : brief.importance === 'medium' ? 'rgba(251,191,36,0.12)'
                                            : 'rgba(107,114,128,0.12)',
                                    color: brief.importance === 'high' ? '#ff5274'
                                        : brief.importance === 'medium' ? '#fbbf24'
                                            : '#9ca3af',
                                }}>
                                    {getImportanceLabel(brief.importance)}
                                </div>
                                <h4 style={styles.briefTitle}>{brief.title}</h4>
                                <p style={styles.briefContent}>
                                    {brief.content?.substring(0, 100)}...
                                </p>
                                <div style={styles.briefMeta}>
                                    <Clock size={13} />
                                    <span>{new Date(brief.created_at).toLocaleDateString(getDateLocale())}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* Newsletter Subscription */}
            <section style={{ marginBottom: 40 }}>
                <NewsletterSubscribe />
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerGlow} />
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <Star size={22} style={{ color: '#00ff88' }} />
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
        padding: '28px 36px',
        height: '100%',
        overflow: 'auto',
    },
    // Hero
    hero: {
        position: 'relative',
        padding: '60px 50px',
        background: 'linear-gradient(135deg, rgba(0,210,106,0.04) 0%, rgba(0,144,255,0.02) 50%, rgba(168,85,247,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 28,
        marginBottom: 40,
        overflow: 'hidden',
    },
    heroOrbs: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    orb1: {
        position: 'absolute',
        top: -150,
        right: -100,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
    },
    orb2: {
        position: 'absolute',
        bottom: -100,
        left: -50,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(0,144,255,0.1) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
    },
    orb3: {
        position: 'absolute',
        top: '50%',
        right: '20%',
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
    },
    heroContent: {
        position: 'relative',
        zIndex: 1,
    },
    badgeRow: {
        display: 'flex',
        gap: 12,
        marginBottom: 24,
    },
    liveBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'rgba(0,210,106,0.12)',
        border: '1px solid rgba(0,210,106,0.25)',
        borderRadius: 20,
        color: '#00ff88',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
    },
    liveIndicator: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#00ff88',
        boxShadow: '0 0 10px rgba(0,255,136,0.6)',
        animation: 'pulse 2s ease-in-out infinite',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'rgba(168,85,247,0.1)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20,
        color: '#a855f7',
        fontSize: 12,
        fontWeight: 600,
    },
    heroTitle: {
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    heroTitleMain: {
        fontSize: 56,
        fontWeight: 900,
        color: '#fff',
        letterSpacing: '-2px',
        textShadow: '0 0 40px rgba(255,255,255,0.1)',
    },
    heroTitleGradient: {
        fontSize: 52,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-1px',
    },
    heroDesc: {
        margin: '20px 0 32px',
        fontSize: 17,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.7,
        maxWidth: 600,
    },
    statsGrid: {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        backdropFilter: 'blur(10px)',
    },
    statIcon: {
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        background: 'rgba(0,255,136,0.12)',
        color: '#00ff88',
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    // Modules
    modulesSection: {
        marginBottom: 40,
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: '#fff',
    },
    modulesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 24,
    },
    moduleCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'fadeInUp 0.6s ease forwards',
        opacity: 0,
        overflow: 'hidden',
    },
    cardGlow: {
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
    },
    countBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: '5px 12px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700,
    },
    moduleIcon: {
        width: 68,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        flexShrink: 0,
        transition: 'all 0.4s ease',
    },
    moduleContent: {
        flex: 1,
        minWidth: 0,
    },
    moduleTitle: {
        margin: '0 0 8px',
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
    },
    moduleDesc: {
        margin: 0,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.6,
    },
    moduleArrow: {
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        color: '#000',
        flexShrink: 0,
        transition: 'all 0.3s ease',
    },
    // Recent
    recentSection: {
        marginBottom: 40,
    },
    viewAllBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 20px',
        background: 'linear-gradient(135deg, rgba(0,210,106,0.12) 0%, rgba(0,210,106,0.08) 100%)',
        border: '1px solid rgba(0,210,106,0.25)',
        borderRadius: 24,
        color: '#00ff88',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    briefsList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20,
    },
    briefCard: {
        padding: '24px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease forwards',
        opacity: 0,
    },
    briefImportance: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 14,
    },
    briefTitle: {
        margin: '0 0 10px',
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.5,
    },
    briefContent: {
        margin: '0 0 14px',
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.6,
    },
    briefMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
    },
    // Footer
    footer: {
        position: 'relative',
        padding: '40px 0',
        textAlign: 'center',
        overflow: 'hidden',
    },
    footerGlow: {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 400,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.4), transparent)',
    },
    footerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
    },
    footerBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
    },
    footerText: {
        margin: 0,
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
    },
}

// 添加动画
const styleSheet = document.createElement('style')
styleSheet.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
}
@keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(0,255,136,0.6); }
    50% { opacity: 0.6; box-shadow: 0 0 20px rgba(0,255,136,0.8); }
}
`
if (!document.head.querySelector('#home-view-styles-v2')) {
    styleSheet.id = 'home-view-styles-v2'
    document.head.appendChild(styleSheet)
}

export default HomeView
