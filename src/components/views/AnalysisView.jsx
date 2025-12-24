import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, User, ArrowRight, X, ChevronRight, Eye, BookOpen, TrendingUp, Calendar, Inbox } from 'lucide-react'
import ArticleDetailView from './ArticleDetailView'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

function AnalysisView({ directArticleId, onClearDirectArticle }) {
    const { t, language } = useI18n()
    const navigate = useNavigate()
    const [selectedAnalysis, setSelectedAnalysis] = useState(null)
    const [activeCategory, setActiveCategory] = useState('all')
    const [analysisItems, setAnalysisItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadAnalysis = async () => {
            try {
                const data = await db.getAll(TABLES.ANALYSIS, { orderBy: 'created_at', filters: { is_published: true } })
                setAnalysisItems(data || [])
            } catch (err) {
                console.error('Failed to load analysis:', err)
            }
            setLoading(false)
        }
        loadAnalysis()
    }, [])

    // 处理直接通过 URL 打开文章
    useEffect(() => {
        if (directArticleId && !selectedAnalysis) {
            const loadDirectArticle = async () => {
                try {
                    const article = await db.getById(TABLES.ANALYSIS, directArticleId)
                    if (article) {
                        setSelectedAnalysis(article)
                    }
                } catch (err) {
                    console.error('Failed to load article:', err)
                }
            }
            loadDirectArticle()
        }
    }, [directArticleId, selectedAnalysis])

    const categories = [
        { id: 'all', label: t('views.brief.all') },
        { id: '技术分析', label: language === 'ko' ? '기술적 분석' : language === 'zh' ? '技术分析' : 'Technical' },
        { id: '链上分析', label: language === 'ko' ? '온체인 분석' : language === 'zh' ? '链上分析' : 'On-chain' },
        { id: '市场分析', label: language === 'ko' ? '시장 분석' : language === 'zh' ? '市场分析' : 'Market' },
    ]

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    const filteredItems = activeCategory === 'all' ? analysisItems : analysisItems.filter(item => item.category === activeCategory)
    const featuredItem = analysisItems.find(item => item.is_featured)

    // 返回处理 - 清除 URL 和状态
    const handleBack = () => {
        setSelectedAnalysis(null)
        if (onClearDirectArticle) onClearDirectArticle()
        navigate('/', { replace: true })
    }

    if (selectedAnalysis) {
        return (
            <ArticleDetailView
                articleId={selectedAnalysis.id}
                initialData={selectedAnalysis}
                onBack={handleBack}
            />
        )
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.analysis.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.analysis.subtitle')}</span>
                </div>
                <div style={styles.headerStats}>
                    <div style={styles.stat}><BookOpen size={14} /><span>{analysisItems.length}</span></div>
                </div>
            </header>

            <div style={styles.categoryBar}>
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ ...styles.categoryBtn, ...(activeCategory === cat.id ? styles.categoryBtnActive : {}) }}>
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : filteredItems.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.analysis.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.analysis.noDataDesc')}</p>
                </div>
            ) : (
                <>
                    {featuredItem && (
                        <div style={styles.featuredCard}>
                            <div style={styles.featuredContent}>
                                <div style={styles.featuredBadge}><TrendingUp size={12} /><span>{t('views.analysis.featured')}</span></div>
                                <h2 style={styles.featuredTitle}>{featuredItem.title}</h2>
                                <p style={styles.featuredExcerpt}>{featuredItem.summary}</p>
                                <div style={styles.featuredMeta}>
                                    <span style={styles.metaItem}><User size={12} /> {featuredItem.author || 'TRAN Research'}</span>
                                    <span style={styles.metaItem}><Clock size={12} /> {featuredItem.read_time || '15min'}</span>
                                    <span style={styles.metaItem}><Calendar size={12} /> {new Date(featuredItem.created_at).toLocaleDateString(getDateLocale())}</span>
                                </div>
                                <button style={styles.readBtn} onClick={() => setSelectedAnalysis(featuredItem)}><span>{t('views.analysis.readMore')}</span><ArrowRight size={16} /></button>
                            </div>
                            <div style={{
                                ...styles.featuredVisual,
                                backgroundImage: featuredItem.image_url ? `url(${featuredItem.image_url})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                {!featuredItem.image_url && (
                                    <div style={styles.visualLines}>{[...Array(5)].map((_, i) => <div key={i} style={{ ...styles.visualLine, animationDelay: `${i * 0.2}s` }} />)}</div>
                                )}
                            </div>
                        </div>
                    )}
                    <div style={styles.grid}>
                        {filteredItems.filter(item => !item.is_featured).map((item, index) => (
                            <article key={item.id} style={{ ...styles.articleCard, animationDelay: `${index * 80}ms` }} onClick={() => setSelectedAnalysis(item)}>
                                <div style={{
                                    ...styles.thumbnail,
                                    backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}>
                                    {!item.image_url && <div style={styles.thumbnailGradient} />}
                                    <div style={styles.thumbnailOverlay}><div style={styles.readTime}><Clock size={10} /><span>{item.read_time || '10min'}</span></div></div>
                                </div>
                                <div style={styles.articleContent}>
                                    <span style={styles.articleCategory}>{item.category}</span>
                                    <h3 style={styles.articleTitle}>{item.title}</h3>
                                    <p style={styles.articleSummary}>{item.summary}</p>
                                    <div style={styles.articleFooter}>
                                        <div style={styles.authorInfo}><div style={styles.authorAvatar}><span>T</span></div><span style={styles.authorName}>{item.author || 'TRAN'}</span></div>
                                        <span style={styles.articleDate}>{new Date(item.created_at).toLocaleDateString(getDateLocale())}</span>
                                    </div>
                                </div>
                                <div style={styles.hoverIndicator}><ChevronRight size={18} /></div>
                            </article>
                        ))}
                    </div>
                </>
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
    headerStats: {},
    stat: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    categoryBar: { display: 'flex', gap: 'var(--space-2)', flexShrink: 0 },
    categoryBtn: { padding: 'var(--space-2) var(--space-5)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(4px)' },
    categoryBtnActive: { background: 'linear-gradient(135deg, var(--accent-green-dim) 0%, rgba(0, 210, 106, 0.08) 100%)', borderColor: 'rgba(0, 210, 106, 0.4)', color: '#00ff88', boxShadow: '0 0 20px rgba(0, 210, 106, 0.2)' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)', flex: 1, minHeight: 0 },
    emptyTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' },
    emptyDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    featuredCard: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-8)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99,102,241,0.08) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', overflow: 'hidden' },
    featuredContent: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    featuredBadge: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', width: 'fit-content', padding: 'var(--space-1) var(--space-3)', background: 'var(--accent-primary-dim)', borderRadius: 'var(--radius-full)', fontSize: '0.625rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' },
    featuredTitle: { margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 },
    featuredExcerpt: { margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 },
    featuredMeta: { display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-2)' },
    metaItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: '0.75rem', color: 'var(--text-muted)' },
    readBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: 'fit-content', padding: 'var(--space-3) var(--space-6)', background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', fontWeight: '600', color: 'white', cursor: 'pointer', marginTop: 'auto' },
    featuredVisual: { position: 'relative', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8b5cf6 100%)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: '250px' },
    visualLines: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 'var(--space-6)' },
    visualLine: { height: '3px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', borderRadius: '2px', animation: 'shimmer 2s ease infinite' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    articleCard: { position: 'relative', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
    thumbnail: { position: 'relative', height: '180px', background: 'var(--bg-tertiary)', overflow: 'hidden' },
    thumbnailGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(0,212,255,0.2) 100%)' },
    thumbnailOverlay: { position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' },
    readTime: { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-full)', fontSize: '0.625rem', fontWeight: '600', color: 'white' },
    articleContent: { padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    articleCategory: { fontSize: '0.625rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    articleTitle: { margin: 0, fontSize: '1.0625rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 },
    articleSummary: { margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    articleFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' },
    authorInfo: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    authorAvatar: { width: '24px', height: '24px', background: 'var(--gradient-bull)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#000' },
    authorName: { fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)' },
    articleDate: { fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
    hoverIndicator: { position: 'absolute', right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%) translateX(10px)', opacity: 0, color: 'var(--accent-primary)' },
}

export default AnalysisView
