import React, { useState, useEffect, useCallback } from 'react'
import {
    TrendingUp, TrendingDown, Minus, ExternalLink,
    Clock, Newspaper, Filter, Bookmark, Share2, Zap, Inbox, RefreshCw, X
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

// API URL helpers
const getNewsApiUrl = () => {
    if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
        return '/api/news/korean'
    }
    return (import.meta.env.VITE_PROXY_URL || 'http://localhost:3001') + '/api/news/korean'
}

const getArticleApiUrl = (sourceUrl) => {
    const base = import.meta.env.PROD || window.location.hostname !== 'localhost'
        ? '/api/proxy/article'
        : (import.meta.env.VITE_PROXY_URL || 'http://localhost:3001') + '/api/proxy/article'
    return `${base}?url=${encodeURIComponent(sourceUrl)}`
}

function NewsView() {
    const { t, language } = useI18n()
    const [activeCategory, setActiveCategory] = useState('all')
    const [newsItems, setNewsItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Article Reader State
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [articleContent, setArticleContent] = useState(null)
    const [articleLoading, setArticleLoading] = useState(false)

    // 한국 뉴스 가져오기
    const fetchKoreanNews = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true)
        else setLoading(true)

        try {
            const response = await fetch(getNewsApiUrl())
            const result = await response.json()

            if (result.success && result.data) {
                setNewsItems(result.data)
                setLastUpdated(new Date())
                console.log(`📰 Loaded ${result.data.length} Korean news items`)
            } else {
                console.error('Failed to load Korean news:', result.error)
                setNewsItems([])
            }
        } catch (err) {
            console.error('Failed to fetch Korean news:', err)
            setNewsItems([])
        }

        setLoading(false)
        setIsRefreshing(false)
    }, [])

    // 초기 로드 및 자동 갱신 (5분)
    useEffect(() => {
        fetchKoreanNews()
        const interval = setInterval(() => fetchKoreanNews(), 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchKoreanNews])

    const categories = [
        { id: 'all', label: language === 'ko' ? '전체' : language === 'zh' ? '全部' : 'All', icon: <Newspaper size={14} /> },
        { id: 'finance', label: language === 'ko' ? '증권' : language === 'zh' ? '证券' : 'Stocks', icon: null },
        { id: 'economy', label: language === 'ko' ? '경제' : language === 'zh' ? '经济' : 'Economy', icon: null },
        { id: 'crypto', label: language === 'ko' ? '암호화폐' : language === 'zh' ? '加密货币' : 'Crypto', icon: null },
        { id: 'global', label: language === 'ko' ? '국제' : language === 'zh' ? '国际' : 'Global', icon: null },
        { id: 'realestate', label: language === 'ko' ? '부동산' : language === 'zh' ? '房产' : 'Property', icon: null },
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

    const formatTimeAgo = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)

        if (diffMins < 60) {
            return language === 'ko' ? `${diffMins}분 전` : language === 'zh' ? `${diffMins}分钟前` : `${diffMins}m ago`
        } else if (diffHours < 24) {
            return language === 'ko' ? `${diffHours}시간 전` : language === 'zh' ? `${diffHours}小时前` : `${diffHours}h ago`
        }
        return date.toLocaleDateString(getDateLocale())
    }

    // Open article in reader modal
    const openArticle = async (news) => {
        setSelectedArticle(news)
        setArticleLoading(true)
        setArticleContent(null)

        try {
            const response = await fetch(getArticleApiUrl(news.source_url))
            const result = await response.json()

            if (result.success && result.data) {
                setArticleContent(result.data)
            } else {
                // Fallback to original summary
                setArticleContent({
                    title: news.title,
                    content: `<p>${news.summary}</p><p style="color:#888;margin-top:20px;">完整内容无法加载，请查看原文。</p>`,
                    source_url: news.source_url
                })
            }
        } catch (err) {
            console.error('Failed to load article:', err)
            setArticleContent({
                title: news.title,
                content: `<p>${news.summary}</p><p style="color:#ff6b6b;margin-top:20px;">加载失败：${err.message}</p>`,
                source_url: news.source_url
            })
        }

        setArticleLoading(false)
    }

    const closeArticle = () => {
        setSelectedArticle(null)
        setArticleContent(null)
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
                    {lastUpdated && (
                        <span style={styles.lastUpdated}>
                            {language === 'ko' ? '마지막 업데이트: ' : language === 'zh' ? '最后更新: ' : 'Updated: '}
                            {lastUpdated.toLocaleTimeString(getDateLocale())}
                        </span>
                    )}
                    <button
                        style={{ ...styles.refreshBtn, animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
                        onClick={() => fetchKoreanNews(true)}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} />
                    </button>
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
                                <div
                                    key={news.id}
                                    onClick={() => openArticle(news)}
                                    style={{ ...styles.newsCard, animationDelay: `${index * 60}ms`, cursor: 'pointer' }}
                                >
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
                                            <span style={styles.newsTime}><Clock size={11} />{formatTimeAgo(news.created_at)}</span>
                                        </div>
                                        <h3 style={styles.newsTitle}>{news.title}</h3>
                                        <p style={styles.newsSummary}>{news.summary}</p>
                                    </div>
                                    <div style={styles.openIndicator}>
                                        <Newspaper size={16} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Article Reader Modal */}
            {selectedArticle && (
                <div style={styles.readerOverlay} onClick={closeArticle}>
                    <div style={styles.readerModal} onClick={e => e.stopPropagation()}>
                        <div style={styles.readerHeader}>
                            <div style={styles.readerSource}>{selectedArticle.source}</div>
                            <div style={styles.readerActions}>
                                <a
                                    href={selectedArticle.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.readerExternalBtn}
                                    title={language === 'ko' ? '원문 보기' : '查看原文'}
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button style={styles.readerCloseBtn} onClick={closeArticle}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div style={styles.readerBody}>
                            {articleLoading ? (
                                <div style={styles.readerLoading}>
                                    <div style={styles.spinner} />
                                    <span>{language === 'ko' ? '기사 로딩 중...' : '加载文章中...'}</span>
                                </div>
                            ) : articleContent ? (
                                <>
                                    <h1 style={styles.readerTitle}>{articleContent.title}</h1>
                                    <div
                                        style={styles.readerContent}
                                        dangerouslySetInnerHTML={{ __html: articleContent.content }}
                                    />
                                </>
                            ) : null}
                        </div>
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
    headerRight: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    lastUpdated: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
    refreshBtn: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 210, 106, 0.1)', border: '1px solid rgba(0, 210, 106, 0.3)', borderRadius: 'var(--radius-md)', color: '#00ff88', cursor: 'pointer', transition: 'all 0.2s ease' },
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
    openIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(0,210,106,0.1)', color: '#00ff88', flexShrink: 0 },
    // Article Reader Modal
    readerOverlay: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'fade-in 0.2s ease' },
    readerModal: { width: '100%', maxWidth: 800, maxHeight: '90vh', background: 'linear-gradient(145deg, rgba(12, 16, 24, 0.98) 0%, rgba(8, 12, 20, 0.98) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' },
    readerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' },
    readerSource: { fontSize: '0.75rem', fontWeight: 700, color: '#00d26a', textTransform: 'uppercase', letterSpacing: '0.08em' },
    readerActions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    readerExternalBtn: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.2s ease' },
    readerCloseBtn: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 8, color: '#ff4466', cursor: 'pointer', transition: 'all 0.2s ease' },
    readerBody: { flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' },
    readerLoading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem', color: 'rgba(255,255,255,0.5)' },
    readerTitle: { margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.4 },
    readerContent: { fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' },
}

export default NewsView
