import React, { useState, useEffect } from 'react'
import {
    TrendingUp, TrendingDown, Minus, ExternalLink,
    Clock, Newspaper, Filter, Bookmark, Share2, Zap, Inbox
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

function NewsView() {
    const { t, language } = useI18n()
    const [activeCategory, setActiveCategory] = useState('all')
    const [newsItems, setNewsItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await db.getAll(TABLES.NEWS, {
                    orderBy: 'created_at',
                    filters: { is_published: true }
                })
                setNewsItems(data || [])
            } catch (err) {
                console.error('Failed to load news:', err)
                setNewsItems([])
            }
            setLoading(false)
        }
        loadNews()
    }, [])

    const categories = [
        { id: 'all', label: t('views.brief.all'), icon: <Newspaper size={14} /> },
        { id: 'bitcoin', label: 'BTC', icon: null },
        { id: 'ethereum', label: 'ETH', icon: null },
        { id: 'altcoin', label: language === 'ko' ? '알트코인' : language === 'zh' ? '山寨币' : 'Altcoin', icon: null },
        { id: 'macro', label: language === 'ko' ? '매크로' : language === 'zh' ? '宏观' : 'Macro', icon: null },
    ]

    const getSentimentConfig = (sentiment) => {
        switch (sentiment) {
            case 'bullish':
                return { color: 'var(--accent-bull)', bg: 'var(--accent-bull-dim)', icon: <TrendingUp size={12} />, label: t('views.news.bullish') }
            case 'bearish':
                return { color: 'var(--accent-bear)', bg: 'var(--accent-bear-dim)', icon: <TrendingDown size={12} />, label: t('views.news.bearish') }
            default:
                return { color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.05)', icon: <Minus size={12} />, label: t('views.news.neutral') }
        }
    }

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    const filteredNews = activeCategory === 'all' ? newsItems : newsItems.filter(n => n.category === activeCategory)

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.news.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.news.subtitle')}</span>
                </div>
                <div style={styles.headerRight}>
                    <button style={styles.filterBtn}><Filter size={14} /><span>{t('common.search')}</span></button>
                </div>
            </header>

            <div style={styles.categoryBar}>
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ ...styles.categoryPill, ...(activeCategory === cat.id ? styles.categoryPillActive : {}) }}>
                        {cat.icon}<span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : filteredNews.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.news.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.news.noDataDesc')}</p>
                </div>
            ) : (
                <div style={styles.newsGrid}>
                    <div style={styles.newsList}>
                        {filteredNews.map((news, index) => {
                            const sentiment = getSentimentConfig(news.sentiment)
                            return (
                                <article key={news.id} style={{ ...styles.newsCard, animationDelay: `${index * 60}ms` }}>
                                    <div style={{ ...styles.sentimentBar, background: sentiment.color }} />
                                    {news.image_url && (
                                        <div style={{
                                            width: 120,
                                            height: 80,
                                            borderRadius: 'var(--radius-md)',
                                            backgroundImage: `url(${news.image_url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            flexShrink: 0
                                        }} />
                                    )}
                                    <div style={styles.newsContent}>
                                        <div style={styles.newsMeta}>
                                            <span style={styles.newsSource}>{news.source || t('views.news.source')}</span>
                                            <span style={styles.newsTime}><Clock size={11} />{new Date(news.created_at).toLocaleDateString(getDateLocale())}</span>
                                            <div style={{ ...styles.newsSentiment, background: sentiment.bg, color: sentiment.color }}>
                                                {sentiment.icon}<span>{sentiment.label}</span>
                                            </div>
                                        </div>
                                        <h3 style={styles.newsTitle}>{news.title}</h3>
                                        <p style={styles.newsSummary}>{news.summary}</p>
                                    </div>
                                    <div style={styles.newsActions}>
                                        <button style={styles.newsActionBtn}><Bookmark size={14} /></button>
                                        {news.source_url && <a href={news.source_url} target="_blank" rel="noopener noreferrer" style={styles.newsActionBtn}><ExternalLink size={14} /></a>}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fade-in 0.4s ease', height: '100%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    title: { margin: 0, fontSize: '1.75rem', fontWeight: '700' },
    titleGradient: { background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    headerRight: {},
    filterBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-tertiary)', cursor: 'pointer' },
    categoryBar: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', flexShrink: 0 },
    categoryPill: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(4px)' },
    categoryPillActive: { background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.08) 100%)', borderColor: 'rgba(0, 210, 106, 0.4)', color: '#00ff88', boxShadow: '0 0 16px rgba(0, 210, 106, 0.2)' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)', flex: 1, minHeight: 0 },
    emptyTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' },
    emptyDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    newsGrid: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    newsList: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    newsCard: { position: 'relative', display: 'flex', gap: 'var(--space-4)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', paddingLeft: 'calc(var(--space-5) + 4px)', overflow: 'hidden', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' },
    sentimentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', boxShadow: '0 0 8px currentColor' },
    newsContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    newsMeta: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
    newsSource: { fontSize: '0.6875rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    newsTime: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-muted)' },
    newsSentiment: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.5625rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' },
    newsTitle: { margin: 0, fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 },
    newsSummary: { margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    newsActions: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    newsActionBtn: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)', cursor: 'pointer', textDecoration: 'none' },
}

export default NewsView
