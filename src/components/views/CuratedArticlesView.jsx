import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, User, ExternalLink, BookOpen, Globe } from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import { spaceEconomyArticle } from '../../data/articles/spaceEconomy'
import SpaceEconomyArticle from '../experiments/SpaceEconomyArticle'

function CuratedArticlesView({ directArticleId, onBack }) {
    const navigate = useNavigate()
    const { t, language } = useI18n()
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)

    // 硬编码的精选文章
    const getStaticArticles = () => {
        const currentLang = language || 'ko'
        const spaceData = spaceEconomyArticle[currentLang] || spaceEconomyArticle.ko
        return [{
            id: 'space-economy-2026',
            title: spaceData.title,
            summary: spaceData.subtitle,
            category: '精选文章',
            author: spaceData.author,
            read_time: spaceData.readTime,
            image_url: spaceEconomyArticle.heroImage,
            is_featured: true,
            created_at: new Date().toISOString(),
            is_published: true
        }]
    }

    useEffect(() => {
        const loadArticles = async () => {
            try {
                // 获取 category='精选翻译' 的文章
                const data = await db.getAll(TABLES.ANALYSIS, {
                    orderBy: 'created_at',
                    filter: { category: '精选翻译', is_published: true }
                })
                // 合并硬编码文章和数据库文章
                const staticArticles = getStaticArticles()
                setArticles([...staticArticles, ...(data || [])])
            } catch (err) {
                console.error('Failed to load curated articles:', err)
                // 即使数据库失败，也显示硬编码文章
                setArticles(getStaticArticles())
            }
            setLoading(false)
        }
        loadArticles()
    }, [language])

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }

    // 处理返回按钮
    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            navigate('/curated')
        }
    }

    // 处理文章点击 - 导航到独立 URL
    const handleArticleClick = (article) => {
        navigate(`/curated/${article.id}`)
    }

    if (loading) return (
        <div style={styles.loading}>
            <div style={styles.spinner} />
        </div>
    )

    // 直接通过 URL 打开特定文章
    if (directArticleId) {
        // Space Economy 文章使用专门的组件
        if (directArticleId === 'space-economy-2026') {
            return <SpaceEconomyArticle onBack={handleBack} />
        }
        // 其他文章...查找并显示
        const article = articles.find(a => a.id === directArticleId)
        if (article) {
            return (
                <div style={styles.container}>
                    <button style={styles.backBtn} onClick={handleBack}>
                        <ArrowLeft size={18} />
                        <span>목록으로</span>
                    </button>
                    <article style={styles.article}>
                        {article.image_url && (
                            <img src={article.image_url} alt="" style={styles.heroImage} />
                        )}
                        <header style={styles.articleHeader}>
                            <div style={styles.badge}>📚 精选文章</div>
                            <h1 style={styles.articleTitle}>{article.title}</h1>
                            <div style={styles.meta}>
                                <span><User size={14} /> {article.author}</span>
                                <span><Clock size={14} /> {article.read_time}</span>
                                <span>{formatDate(article.created_at)}</span>
                            </div>
                        </header>
                        <div
                            style={styles.content}
                            dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br/>') }}
                        />
                    </article>
                </div>
            )
        }
    }

    // 文章列表视图
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerIcon}>📚</div>
                <div>
                    <h1 style={styles.title}>정선 아티클</h1>
                    <p style={styles.subtitle}>매일 엄선된 글로벌 금융 인사이트를 한국어로</p>
                </div>
            </header>

            {articles.length === 0 ? (
                <div style={styles.empty}>
                    <Globe size={48} style={{ opacity: 0.3 }} />
                    <p>아직 번역된 기사가 없습니다</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {articles.map(article => (
                        <div
                            key={article.id}
                            style={styles.card}
                            onClick={() => handleArticleClick(article)}
                        >
                            {article.image_url && (
                                <img src={article.image_url} alt="" style={styles.cardImage} />
                            )}
                            <div style={styles.cardContent}>
                                <div style={styles.cardBadge}>✨ 精选</div>
                                <h3 style={styles.cardTitle}>{article.title}</h3>
                                <p style={styles.cardSummary}>{article.summary}</p>
                                <div style={styles.cardMeta}>
                                    <span>{formatDate(article.created_at)}</span>
                                    <span>{article.read_time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflow: 'auto',
        background: '#020408',
        padding: '30px 40px',
        color: '#fff',
    },
    loading: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        marginBottom: 40,
        paddingBottom: 30,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    headerIcon: {
        fontSize: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 800,
        margin: 0,
        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    empty: {
        textAlign: 'center',
        padding: 80,
        color: 'rgba(255,255,255,0.4)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 24,
    },
    card: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    cardImage: {
        width: '100%',
        height: 180,
        objectFit: 'cover',
    },
    cardContent: {
        padding: 20,
    },
    cardBadge: {
        display: 'inline-block',
        fontSize: 11,
        padding: '4px 10px',
        background: 'rgba(0, 255, 136, 0.1)',
        color: '#00ff88',
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 10,
        lineHeight: 1.4,
    },
    cardSummary: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5,
        marginBottom: 16,
    },
    cardMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        fontSize: 14,
        marginBottom: 30,
    },
    article: {
        maxWidth: 800,
        margin: '0 auto',
    },
    heroImage: {
        width: '100%',
        height: 300,
        objectFit: 'cover',
        borderRadius: 16,
        marginBottom: 30,
    },
    articleHeader: {
        marginBottom: 40,
        paddingBottom: 30,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    badge: {
        display: 'inline-block',
        fontSize: 12,
        padding: '6px 14px',
        background: 'rgba(0, 255, 136, 0.1)',
        color: '#00ff88',
        borderRadius: 20,
        marginBottom: 16,
    },
    articleTitle: {
        fontSize: 32,
        fontWeight: 800,
        marginBottom: 20,
        lineHeight: 1.3,
    },
    meta: {
        display: 'flex',
        gap: 24,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    content: {
        fontSize: 16,
        lineHeight: 1.9,
        color: 'rgba(255,255,255,0.85)',
    },
}

export default CuratedArticlesView
