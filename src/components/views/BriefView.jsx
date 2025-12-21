import React, { useState, useEffect } from 'react'
import {
    AlertCircle, Bell, TrendingUp, TrendingDown,
    Bookmark, Share2, Clock, ExternalLink, Sparkles, Inbox
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'

function BriefView() {
    const { t, language } = useI18n()
    const [filter, setFilter] = useState('all')
    const [briefItems, setBriefItems] = useState([])
    const [loading, setLoading] = useState(true)

    const { notify } = useAppActions()
    const addNotification = (notif) => notify(notif.message, notif.type)

    useEffect(() => {
        const loadBriefs = async () => {
            try {
                const data = await db.getAll(TABLES.BRIEFS, {
                    orderBy: 'created_at',
                    filters: { is_published: true }
                })
                setBriefItems(data || [])
            } catch (err) {
                console.error('Failed to load briefs:', err)
                setBriefItems([])
            }
            setLoading(false)
        }
        loadBriefs()
    }, [])

    const filters = [
        { id: 'all', label: t('views.brief.all') },
        { id: 'high', label: t('views.brief.urgent') },
        { id: 'medium', label: t('views.brief.important') },
        { id: 'low', label: t('views.brief.normal') },
    ]

    const getImportanceConfig = (importance) => {
        switch (importance) {
            case 'high':
                return { color: 'var(--accent-bear)', bg: 'var(--accent-bear-dim)', icon: <AlertCircle size={14} />, label: t('views.brief.urgent') }
            case 'medium':
                return { color: 'var(--accent-gold)', bg: 'var(--accent-gold-dim)', icon: <Sparkles size={14} />, label: t('views.brief.important') }
            default:
                return { color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.05)', icon: null, label: t('views.brief.normal') }
        }
    }

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    const filteredItems = filter === 'all' ? briefItems : briefItems.filter(item => item.importance === filter)

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.brief.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.brief.subtitle')}</span>
                </div>
                <div style={styles.headerStats}>
                    <div style={styles.stat}><Inbox size={14} /><span>{briefItems.length}</span></div>
                </div>
            </header>

            <div style={styles.filterBar}>
                {filters.map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)} style={{ ...styles.filterBtn, ...(filter === f.id ? styles.filterBtnActive : {}) }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : filteredItems.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.brief.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.brief.noDataDesc')}</p>
                </div>
            ) : (
                <div style={styles.timeline}>
                    {filteredItems.map((item, index) => {
                        const config = getImportanceConfig(item.importance)
                        return (
                            <article key={item.id} style={{ ...styles.briefCard, animationDelay: `${index * 80}ms` }}>
                                <div style={styles.timelineLeft}>
                                    <div style={{ ...styles.timelineDot, background: config.color }} />
                                    {index !== filteredItems.length - 1 && <div style={styles.timelineConnector} />}
                                </div>
                                <div style={styles.briefContent}>
                                    <div style={styles.briefMeta}>
                                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                                        <span style={styles.briefTime}>{new Date(item.created_at).toLocaleString(getDateLocale())}</span>
                                        <span style={{ ...styles.importanceBadge, background: config.bg, color: config.color }}>
                                            {config.icon}{config.label}
                                        </span>
                                    </div>
                                    <h3 style={styles.briefTitle}>{item.title}</h3>
                                    <p style={styles.briefText}>{item.content}</p>
                                    {item.tags?.length > 0 && (
                                        <div style={styles.tagList}>
                                            {item.tags.map((tag, idx) => <span key={idx} style={styles.tag}>#{tag}</span>)}
                                        </div>
                                    )}
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '900px', height: '100%', animation: 'fade-in 0.4s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    title: { margin: 0, fontSize: '1.75rem', fontWeight: '700' },
    titleGradient: { background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    headerStats: {},
    stat: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    filterBar: { display: 'flex', gap: 'var(--space-2)', flexShrink: 0 },
    filterBtn: { padding: 'var(--space-2) var(--space-5)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(4px)' },
    filterBtnActive: { background: 'linear-gradient(135deg, var(--accent-green-dim) 0%, rgba(0, 210, 106, 0.08) 100%)', borderColor: 'rgba(0, 210, 106, 0.4)', color: '#00ff88', boxShadow: '0 0 20px rgba(0, 210, 106, 0.2)' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)', flex: 1, minHeight: 0 },
    emptyTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' },
    emptyDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    timeline: { display: 'flex', flexDirection: 'column' },
    briefCard: { display: 'flex', gap: 'var(--space-5)', animation: 'slide-up 0.4s ease forwards', opacity: 0 },
    timelineLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'var(--space-3)', width: '32px', flexShrink: 0 },
    timelineDot: { width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 10px currentColor', animation: 'pulse 2.5s ease-in-out infinite' },
    timelineConnector: { width: '2px', flex: 1, background: 'linear-gradient(180deg, rgba(0, 210, 106, 0.3) 0%, var(--border-light) 50%, transparent 100%)', marginTop: 'var(--space-2)', minHeight: '40px' },
    briefContent: { flex: 1, background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', marginBottom: 'var(--space-5)', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' },
    briefMeta: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' },
    briefTime: { fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' },
    importanceBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.625rem', fontWeight: '700', borderRadius: 'var(--radius-full)' },
    briefTitle: { margin: '0 0 var(--space-2) 0', fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 },
    briefText: { margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 },
    tagList: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' },
    tag: { padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' },
}

export default BriefView
