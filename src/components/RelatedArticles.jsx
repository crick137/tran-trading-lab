import React, { useState, useEffect } from 'react'
import { BookOpen, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { db, TABLES } from '../lib/supabase'

/**
 * RelatedArticles - 相关文章推荐组件
 * 基于分类匹配相关内容
 */
function RelatedArticles({ currentId, category, type = 'analysis', onArticleClick, maxItems = 3 }) {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadRelated = async () => {
            try {
                setLoading(true)
                const table = type === 'analysis' ? TABLES.ANALYSIS : TABLES.LAB_COURSES

                // 获取同分类的文章
                const allItems = await db.getAll(table, {
                    filters: { is_published: true }
                })

                if (!allItems) {
                    setArticles([])
                    return
                }

                // 过滤掉当前文章，优先同分类
                const filtered = allItems.filter(item => item.id !== currentId)

                // 排序：同分类优先，然后按更新时间
                const sorted = filtered.sort((a, b) => {
                    const aMatch = a.category === category ? 1 : 0
                    const bMatch = b.category === category ? 1 : 0
                    if (aMatch !== bMatch) return bMatch - aMatch
                    return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
                })

                setArticles(sorted.slice(0, maxItems))
            } catch (err) {
                console.error('Failed to load related articles:', err)
                setArticles([])
            } finally {
                setLoading(false)
            }
        }

        if (currentId) loadRelated()
    }, [currentId, category, type, maxItems])

    if (loading) {
        return (
            <div style={styles.container}>
                <h3 style={styles.title}>
                    <BookOpen size={18} />
                    관련 콘텐츠
                </h3>
                <div style={styles.loading}>로딩 중...</div>
            </div>
        )
    }

    if (articles.length === 0) return null

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>
                <BookOpen size={18} />
                관련 콘텐츠
            </h3>
            <div style={styles.list}>
                {articles.map((article) => (
                    <div
                        key={article.id}
                        style={styles.card}
                        onClick={() => onArticleClick?.(article)}
                    >
                        <div style={styles.cardContent}>
                            <span style={styles.category}>{article.category || '분석'}</span>
                            <h4 style={styles.cardTitle}>{article.title}</h4>
                            <div style={styles.meta}>
                                <Clock size={12} />
                                <span>{article.read_time || '5 min'}</span>
                            </div>
                        </div>
                        <ChevronRight size={16} style={styles.arrow} />
                    </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    container: {
        marginTop: 40,
        padding: 24,
        background: 'rgba(30, 30, 45, 0.5)',
        borderRadius: 16,
        border: '1px solid rgba(148, 163, 184, 0.1)',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 18,
        fontWeight: 600,
        color: '#ffffff',
        margin: '0 0 20px',
    },
    loading: {
        textAlign: 'center',
        color: '#64748b',
        padding: 20,
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        background: 'rgba(15, 15, 25, 0.6)',
        borderRadius: 12,
        border: '1px solid rgba(148, 163, 184, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    cardContent: {
        flex: 1,
    },
    category: {
        fontSize: 11,
        fontWeight: 600,
        color: '#3b82f6',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 500,
        color: '#e2e8f0',
        margin: '6px 0',
        lineHeight: 1.4,
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        color: '#64748b',
    },
    arrow: {
        color: '#64748b',
        flexShrink: 0,
    },
}

export default RelatedArticles
