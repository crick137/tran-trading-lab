import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Clock, Calendar, Share2, ThumbsUp, MessageSquare, Bookmark, Check } from 'lucide-react'
import { interactions } from '../../lib/supabase'
import { useAppState, useAppActions } from '../../context/AppContext'
import CommentPanel from '../CommentPanel'

function ArticleDetailView({ articleId, onBack, initialData }) {
    const { user, isAuthenticated } = useAppState()
    const { openAuthModal, notify } = useAppActions()

    const [article, setArticle] = useState(initialData || null)
    const [loading, setLoading] = useState(!initialData)

    // 互动状态
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [bookmarked, setBookmarked] = useState(false)
    const [commentCount, setCommentCount] = useState(0)
    const [commentPanelOpen, setCommentPanelOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    // 加载文章数据
    useEffect(() => {
        if (initialData) {
            setArticle(initialData)
            return
        }

        // Simulate fetch if no initial data provided
        setTimeout(() => {
            setArticle({
                id: articleId,
                title: "비트코인 반감기 이후 시장 전망 분석",
                subtitle: "과거 데이터를 통한 패턴 분석과 2024년 시장 예측",
                author: {
                    name: "Kim Chartist",
                    avatar: "https://i.pravatar.cc/150?u=kim",
                    role: "Chief Analyst"
                },
                date: "2024. 04. 15",
                readTime: "5 min read",
                tags: ["Bitcoin", "Market Analysis", "Halving"],
                content: `
# 비트코인 반감기의 역사적 패턴

비트코인 반감기는 암호화폐 시장에서 가장 중요한 이벤트 중 하나입니다.

## 과거 사이클 분석

1. **2012년 반감기**: 반감기 후 12개월간 급격한 상승
2. **2016년 반감기**: 반감기 후 18개월간의 불장
3. **2020년 반감기**: 거시경제 변수와 맞물려 새로운 패턴 형성

## 2024년 전망

현재 기관 투자자들의 유입(ETF)과 맞물려 과거와는 다른 양상을 보일 가능성이 높습니다.
                `,
            })
            setLoading(false)
        }, 800)
    }, [articleId, initialData])

    // 加载互动状态
    useEffect(() => {
        if (!article?.id) return

        const loadInteractionState = async () => {
            try {
                // 加载点赞数
                const likes = await interactions.getLikeCount(article.id)
                setLikeCount(likes)

                // 加载评论数
                const comments = await interactions.getCommentCount(article.id)
                setCommentCount(comments)

                // 如果用户已登录，检查是否已点赞/收藏
                if (user?.id) {
                    const hasLiked = await interactions.hasLiked(article.id, user.id)
                    setLiked(hasLiked)

                    const hasBookmarked = await interactions.hasBookmarked(article.id, user.id)
                    setBookmarked(hasBookmarked)
                }
            } catch (err) {
                console.error('加载互动状态失败:', err)
            }
        }

        loadInteractionState()
    }, [article?.id, user?.id])

    // 点赞
    const handleLike = useCallback(async () => {
        if (!isAuthenticated) {
            openAuthModal()
            return
        }

        try {
            const result = await interactions.toggleLike(article.id, user.id)
            setLiked(result.liked)
            setLikeCount(prev => result.liked ? prev + 1 : prev - 1)
            notify(result.liked ? '已点赞' : '已取消点赞', 'success')
        } catch (err) {
            console.error('点赞失败:', err)
            notify('操作失败', 'error')
        }
    }, [article?.id, user?.id, isAuthenticated, openAuthModal, notify])

    // 收藏
    const handleBookmark = useCallback(async () => {
        if (!isAuthenticated) {
            openAuthModal()
            return
        }

        try {
            const result = await interactions.toggleBookmark(article.id, user.id)
            setBookmarked(result.bookmarked)
            notify(result.bookmarked ? '已收藏' : '已取消收藏', 'success')
        } catch (err) {
            console.error('收藏失败:', err)
            notify('操作失败', 'error')
        }
    }, [article?.id, user?.id, isAuthenticated, openAuthModal, notify])

    // 分享（复制链接）
    const handleShare = useCallback(async () => {
        try {
            const url = `${window.location.origin}/analysis/${article.id}`
            await navigator.clipboard.writeText(url)
            setCopied(true)
            notify('链接已复制到剪贴板', 'success')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('复制失败:', err)
            notify('复制失败', 'error')
        }
    }, [article?.id, notify])

    // 评论面板关闭时刷新评论数
    const handleCommentPanelClose = useCallback(async () => {
        setCommentPanelOpen(false)
        if (article?.id) {
            const count = await interactions.getCommentCount(article.id)
            setCommentCount(count)
        }
    }, [article?.id])

    if (loading) return (
        <div style={styles.loading}>
            <div style={styles.spinner} />
        </div>
    )

    return (
        <div style={styles.container}>
            <button style={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={18} />
                <span>Back to Analysis</span>
            </button>

            <article style={styles.article}>
                <header style={styles.header}>
                    <div style={styles.tags}>
                        {(article.tags || []).map(tag => (
                            <span key={tag} style={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                    <h1 style={styles.title}>{article.title}</h1>
                    <p style={styles.subtitle}>{article.subtitle}</p>

                    <div style={styles.meta}>
                        <div style={styles.author}>
                            <img src={article.author?.avatar || 'https://i.pravatar.cc/150'} alt={article.author?.name} style={styles.avatar} />
                            <div style={styles.authorInfo}>
                                <span style={styles.authorName}>{article.author?.name || 'Anonymous'}</span>
                                <span style={styles.authorRole}>{article.author?.role || 'Author'}</span>
                            </div>
                        </div>
                        <div style={styles.metaRight}>
                            <div style={styles.metaItem}>
                                <Calendar size={14} />
                                <span>{article.date}</span>
                            </div>
                            <div style={styles.metaItem}>
                                <Clock size={14} />
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={styles.content}>
                    {(article.content || '').split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} style={styles.h1}>{line.replace('# ', '')}</h1>
                        if (line.startsWith('## ')) return <h2 key={i} style={styles.h2}>{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} style={styles.h3}>{line.replace('### ', '')}</h3>
                        if (line.startsWith('- ')) return <li key={i} style={styles.li}>{line.replace('- ', '')}</li>
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} style={styles.p}>{line}</p>
                    })}
                </div>

                <footer style={styles.footer}>
                    <div style={styles.actions}>
                        {/* 点赞按钮 */}
                        <button
                            style={{
                                ...styles.actionBtn,
                                background: liked ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)',
                                borderColor: liked ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255,255,255,0.1)',
                                color: liked ? '#00ff88' : 'rgba(255,255,255,0.8)',
                            }}
                            onClick={handleLike}
                        >
                            <ThumbsUp size={18} fill={liked ? '#00ff88' : 'none'} />
                            <span>{likeCount}</span>
                        </button>

                        {/* 评论按钮 */}
                        <button
                            style={styles.actionBtn}
                            onClick={() => setCommentPanelOpen(true)}
                        >
                            <MessageSquare size={18} />
                            <span>{commentCount}</span>
                        </button>

                        {/* 收藏按钮 */}
                        <button
                            style={{
                                ...styles.actionBtn,
                                background: bookmarked ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                                borderColor: bookmarked ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)',
                                color: bookmarked ? '#fbbf24' : 'rgba(255,255,255,0.8)',
                            }}
                            onClick={handleBookmark}
                        >
                            <Bookmark size={18} fill={bookmarked ? '#fbbf24' : 'none'} />
                        </button>

                        {/* 分享按钮 */}
                        <button
                            style={{
                                ...styles.actionBtn,
                                background: copied ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)',
                                color: copied ? '#00ff88' : 'rgba(255,255,255,0.8)',
                            }}
                            onClick={handleShare}
                        >
                            {copied ? <Check size={18} /> : <Share2 size={18} />}
                        </button>
                    </div>
                </footer>
            </article>

            {/* 评论面板 */}
            <CommentPanel
                articleId={article?.id}
                isOpen={commentPanelOpen}
                onClose={handleCommentPanelClose}
            />
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflow: 'auto',
        background: '#020408',
        padding: '20px 40px',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
    },
    loading: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 30,
        height: 30,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
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
        transition: 'color 0.2s',
    },
    article: {
        maxWidth: 800,
        margin: '0 auto',
        paddingBottom: 60,
    },
    header: {
        marginBottom: 40,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: 30,
    },
    tags: {
        display: 'flex',
        gap: 10,
        marginBottom: 20,
    },
    tag: {
        fontSize: 12,
        color: '#00ff88',
        background: 'rgba(0, 255, 136, 0.1)',
        padding: '4px 10px',
        borderRadius: 20,
        fontWeight: 600,
    },
    title: {
        fontSize: 36,
        fontWeight: 800,
        marginBottom: 16,
        lineHeight: 1.3,
        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 30,
        lineHeight: 1.5,
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    author: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px solid rgba(0,255,136,0.3)',
    },
    authorInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
    },
    authorRole: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    metaRight: {
        display: 'flex',
        gap: 20,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
    },
    content: {
        fontSize: 16,
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.9)',
    },
    h1: { fontSize: 28, fontWeight: 700, marginTop: 40, marginBottom: 20, color: '#fff' },
    h2: { fontSize: 24, fontWeight: 700, marginTop: 30, marginBottom: 16, color: '#e2e8f0' },
    h3: { fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 12, color: '#cbd5e1' },
    p: { marginBottom: 16 },
    li: { marginLeft: 20, marginBottom: 8, listStyleType: 'disc' },
    footer: {
        marginTop: 60,
        paddingTop: 30,
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    actions: {
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: 14,
        fontWeight: 600,
    },
}

export default ArticleDetailView
