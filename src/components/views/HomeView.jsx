import React, { useState, useEffect } from 'react'
import {
    Newspaper, BarChart3, Globe, GraduationCap, BookOpen, Wrench,
    ArrowRight, Sparkles, TrendingUp, Zap, Star, ChevronRight,
    Activity, Users, Clock, Award
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

/**
 * 홈 뷰 컴포넌트 - 모든 모듈 입구 표시
 * Home View - Shows all module entries with i18n support
 */
function HomeView({ onNavigate }) {
    const { t, language } = useI18n()
    const [stats, setStats] = useState({})
    const [recentBriefs, setRecentBriefs] = useState([])
    const [loading, setLoading] = useState(true)

    // 모듈 설정 (icons and colors only, text from i18n)
    const moduleConfig = [
        { id: 'brief', icon: Newspaper, color: '#00ff88', gradient: 'linear-gradient(135deg, #00ff88 0%, #00d26a 100%)' },
        { id: 'analysis', icon: BarChart3, color: '#00d4ff', gradient: 'linear-gradient(135deg, #00d4ff 0%, #0090ff 100%)' },
        { id: 'news', icon: Globe, color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
        { id: 'lab', icon: GraduationCap, color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)' },
        { id: 'note', icon: BookOpen, color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
        { id: 'tools', icon: Wrench, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
    ]

    // 데이터 로드
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
        if (onNavigate) {
            onNavigate(moduleId)
        }
    }

    // Get localized date format
    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    // Get importance label
    const getImportanceLabel = (importance) => {
        switch (importance) {
            case 'high': return `🔴 ${t('home.urgent')}`
            case 'medium': return `🟡 ${t('home.important')}`
            default: return `🟢 ${t('home.normal')}`
        }
    }

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.badge}>
                        <Sparkles size={14} />
                        <span>{t('home.badge')}</span>
                    </div>
                    <h1 style={styles.heroTitle}>
                        TRAN <span style={styles.heroHighlight}>Trading</span> Lab
                    </h1>
                    <p style={styles.heroDesc}>
                        {t('home.heroDesc')}
                    </p>
                    <div style={styles.heroStats}>
                        <div style={styles.heroStat}>
                            <Activity size={18} style={{ color: '#00ff88' }} />
                            <span>{stats.brief || 0}{t('home.statBriefs')}</span>
                        </div>
                        <div style={styles.heroStat}>
                            <TrendingUp size={18} style={{ color: '#00d4ff' }} />
                            <span>{stats.analysis || 0}{t('home.statAnalysis')}</span>
                        </div>
                        <div style={styles.heroStat}>
                            <Award size={18} style={{ color: '#a855f7' }} />
                            <span>{stats.lab || 0}{t('home.statCourses')}</span>
                        </div>
                    </div>
                </div>
                <div style={styles.heroGlow} />
            </section>

            {/* Modules Grid */}
            <section style={styles.modulesSection}>
                <h2 style={styles.sectionTitle}>
                    <Zap size={20} style={{ color: '#00ff88' }} />
                    {t('home.exploreModules')}
                </h2>
                <div style={styles.modulesGrid}>
                    {moduleConfig.map((mod, index) => {
                        const moduleText = t(`home.modules.${mod.id}`)
                        return (
                            <article
                                key={mod.id}
                                style={{
                                    ...styles.moduleCard,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                onClick={() => handleModuleClick(mod.id)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                                    e.currentTarget.style.boxShadow = `0 20px 40px ${mod.color}20`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                            >
                                <div style={{
                                    ...styles.moduleIcon,
                                    background: `${mod.color}15`,
                                    color: mod.color,
                                }}>
                                    <mod.icon size={28} />
                                </div>
                                <div style={styles.moduleContent}>
                                    <h3 style={styles.moduleTitle}>{moduleText?.title}</h3>
                                    <p style={styles.moduleDesc}>{moduleText?.desc}</p>
                                </div>
                                <div style={{
                                    ...styles.moduleArrow,
                                    background: mod.gradient,
                                }}>
                                    <ArrowRight size={16} />
                                </div>
                                {stats[mod.id] > 0 && (
                                    <div style={{
                                        ...styles.moduleBadge,
                                        background: `${mod.color}20`,
                                        color: mod.color,
                                    }}>
                                        {stats[mod.id]}
                                    </div>
                                )}
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
                            <Newspaper size={20} style={{ color: '#00ff88' }} />
                            {t('home.recentBriefs')}
                        </h2>
                        <button
                            style={styles.viewAllBtn}
                            onClick={() => handleModuleClick('brief')}
                        >
                            {t('home.viewAll')}
                            <ChevronRight size={16} />
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
                                    background: brief.importance === 'high' ? '#ff386020'
                                        : brief.importance === 'medium' ? '#fbbf2420'
                                            : '#6b728020',
                                    color: brief.importance === 'high' ? '#ff3860'
                                        : brief.importance === 'medium' ? '#fbbf24'
                                            : '#6b7280',
                                }}>
                                    {getImportanceLabel(brief.importance)}
                                </div>
                                <h4 style={styles.briefTitle}>{brief.title}</h4>
                                <p style={styles.briefContent}>
                                    {brief.content?.substring(0, 100)}...
                                </p>
                                <div style={styles.briefMeta}>
                                    <Clock size={12} />
                                    <span>{new Date(brief.created_at).toLocaleDateString(getDateLocale())}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <Star size={20} style={{ color: '#00ff88' }} />
                        <span>TRAN Trading Lab</span>
                    </div>
                    <p style={styles.footerText}>
                        {t('home.footerText')}
                    </p>
                </div>
            </footer>
        </div>
    )
}

const styles = {
    container: {
        padding: '24px 32px',
        height: '100%',
        overflow: 'auto',
    },
    hero: {
        position: 'relative',
        padding: '48px 40px',
        background: 'rgba(0, 210, 106, 0.03)',
        border: '1px solid rgba(0, 210, 106, 0.1)',
        borderRadius: 24,
        marginBottom: 32,
        overflow: 'hidden',
    },
    heroContent: {
        position: 'relative',
        zIndex: 1,
    },
    heroGlow: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(0, 210, 106, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.2)',
        borderRadius: 20,
        color: '#00ff88',
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 20,
    },
    heroTitle: {
        margin: 0,
        fontSize: 48,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-1px',
        lineHeight: 1.1,
    },
    heroHighlight: {
        background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroDesc: {
        margin: '16px 0 24px',
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.6,
    },
    heroStats: {
        display: 'flex',
        gap: 24,
    },
    heroStat: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    modulesSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '0 0 20px',
        fontSize: 18,
        fontWeight: 600,
        color: '#fff',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modulesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20,
    },
    moduleCard: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '24px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 0.5s ease forwards',
        opacity: 0,
    },
    moduleIcon: {
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        flexShrink: 0,
    },
    moduleContent: {
        flex: 1,
        minWidth: 0,
    },
    moduleTitle: {
        margin: '0 0 6px',
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
    },
    moduleDesc: {
        margin: 0,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.5,
    },
    moduleArrow: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        color: '#000',
        flexShrink: 0,
    },
    moduleBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: '4px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
    },
    recentSection: {
        marginBottom: 32,
    },
    viewAllBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 16px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.2)',
        borderRadius: 20,
        color: '#00ff88',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    briefsList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
    },
    briefCard: {
        padding: 20,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        cursor: 'pointer',
        transition: 'all 0.2s',
        animation: 'fadeInUp 0.5s ease forwards',
        opacity: 0,
    },
    briefImportance: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 12,
    },
    briefTitle: {
        margin: '0 0 8px',
        fontSize: 15,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.4,
    },
    briefContent: {
        margin: '0 0 12px',
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.5,
    },
    briefMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
    },
    footer: {
        padding: '32px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
    },
    footerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    footerBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
    },
    footerText: {
        margin: 0,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
    },
}

// 添加动画
const styleSheet = document.createElement('style')
styleSheet.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`
if (!document.head.querySelector('#home-view-styles')) {
    styleSheet.id = 'home-view-styles'
    document.head.appendChild(styleSheet)
}

export default HomeView
