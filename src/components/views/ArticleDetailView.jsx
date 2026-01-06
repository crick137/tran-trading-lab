import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, Clock, Calendar, Share2, ThumbsUp, MessageSquare, Bookmark, Check, Play, Pause } from 'lucide-react'
import { interactions } from '../../lib/supabase'
import { useAppState, useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'
import CommentPanel from '../CommentPanel'
import ShareButtons from '../ShareButtons'
import RelatedArticles from '../RelatedArticles'
import SEO from '../SEO'
import { howardMarksBubbleArticle } from '../../data/articles/howardMarksBubble'

function ArticleDetailView({ articleId, onBack, initialData }) {
    const { user, isAuthenticated } = useAppState()
    const { openAuthModal, notify } = useAppActions()
    const { t, language } = useI18n()

    const [article, setArticle] = useState(initialData || null)
    const [loading, setLoading] = useState(!initialData)

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef(null)

    const toggleAudio = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            setDuration(audioRef.current.duration || 0)
        }
    }

    const formatTime = (time) => {
        if (!time) return '0:00'
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const audioProgress = duration ? (currentTime / duration) * 100 : 0


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
            if (articleId === 'howard-marks-bubble') {
                const currentLang = language || 'ko'
                const localizedData = howardMarksBubbleArticle[currentLang] || howardMarksBubbleArticle.ko

                // Get localized UI strings
                const uiStrings = {
                    ko: { role: '번역 | 리서치팀', originalLabel: '📄 원문:', readTime: '25분 읽기' },
                    zh: { role: '翻译 | 研究团队', originalLabel: '📄 原文:', readTime: '25分钟阅读' },
                    en: { role: 'Translation | Research Team', originalLabel: '📄 Original:', readTime: '25 min read' }
                }
                const ui = uiStrings[currentLang] || uiStrings.ko

                setArticle({
                    id: articleId,
                    title: localizedData.title,
                    subtitle: localizedData.description,
                    author: {
                        name: "TranTradingLab",
                        avatar: "/tran-logo.png",
                        role: ui.role
                    },
                    originalAuthor: "Howard Marks, Oaktree Capital",
                    originalLabel: ui.originalLabel,
                    date: "2025. 12. 30",
                    readTime: ui.readTime,
                    tags: ["Market Cycle", "AI Bubble", "Investing", "Oaktree Capital"],
                    image_url: "/ai_bubble.png",
                    content: localizedData.content
                })
            } else {
                setArticle({
                    id: articleId,
                    title: "비트코인 반감기 이후 시장 전망 분석",
                    subtitle: "과거 데이터를 통한 패턴 분석과 2024년 시장 예측",
                    author: {
                        name: "TranTradingLab",
                        avatar: "/tran-logo.png",
                        role: "리서치팀"
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
            }
            setLoading(false)
        }, 800)
    }, [articleId, initialData, language])

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
            if (liked) {
                await interactions.removeLike(article.id, user.id)
                setLiked(false)
                setLikeCount(prev => prev - 1)
                notify(t('views.interaction.unliked'), 'success')
            } else {
                await interactions.addLike(article.id, user.id)
                setLiked(true)
                setLikeCount(prev => prev + 1)
                notify(t('views.interaction.liked'), 'success')
            }
        } catch (err) {
            console.error('点赞操作失败:', err)
            notify(t('views.interaction.operationFailed'), 'error')
        }
    }, [isAuthenticated, liked, article?.id, user?.id, openAuthModal, notify, t])

    // 收藏
    const handleBookmark = useCallback(async () => {
        if (!isAuthenticated) {
            openAuthModal()
            return
        }

        try {
            if (bookmarked) {
                await interactions.removeBookmark(article.id, user.id)
                setBookmarked(false)
                notify(t('views.interaction.unbookmarked'), 'success')
            } else {
                await interactions.addBookmark(article.id, user.id)
                setBookmarked(true)
                notify(t('views.interaction.bookmarked'), 'success')
            }
        } catch (err) {
            console.error('收藏操作失败:', err)
            notify(t('views.interaction.operationFailed'), 'error')
        }
    }, [isAuthenticated, bookmarked, article?.id, user?.id, openAuthModal, notify, t])

    // 分享（复制链接）
    const handleShare = useCallback(async () => {
        try {
            const url = `${window.location.origin}/analysis/${article.id}`
            await navigator.clipboard.writeText(url)
            setCopied(true)
            notify(t('views.interaction.linkCopied'), 'success')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('复制失败:', err)
            notify(t('views.interaction.copyFailed'), 'error')
        }
    }, [article?.id, notify, t])

    // 评论面板关闭时刷新评论数
    const handleCommentPanelClose = useCallback(async () => {
        setCommentPanelOpen(false)
        if (article?.id) {
            const count = await interactions.getCommentCount(article.id)
            setCommentCount(count)
        }
    }, [article?.id])

    // 处理评论数更新
    const handleCommentCountChange = useCallback((count) => {
        setCommentCount(count)
    }, [])

    // Improved markdown renderer
    const renderMarkdown = (content) => {
        if (!content) return null

        const lines = content.split('\n')
        const elements = []
        let inList = false
        let listItems = []

        const processInlineStyles = (text) => {
            // Handle bold text
            text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Handle italic
            text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
            return text
        }

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(
                    <ul key={`list-${elements.length}`} style={styles.ul}>
                        {listItems.map((item, i) => (
                            <li key={i} style={styles.li} dangerouslySetInnerHTML={{ __html: processInlineStyles(item) }} />
                        ))}
                    </ul>
                )
                listItems = []
                inList = false
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const trimmedLine = line.trim()

            // Horizontal rule
            if (trimmedLine === '---') {
                flushList()
                elements.push(<hr key={i} style={styles.hr} />)
                continue
            }

            // Headers
            if (trimmedLine.startsWith('### ')) {
                flushList()
                elements.push(<h3 key={i} style={styles.h3}>{trimmedLine.replace('### ', '')}</h3>)
                continue
            }
            if (trimmedLine.startsWith('## ')) {
                flushList()
                elements.push(<h2 key={i} style={styles.h2}>{trimmedLine.replace('## ', '')}</h2>)
                continue
            }
            if (trimmedLine.startsWith('# ')) {
                flushList()
                elements.push(<h1 key={i} style={styles.h1}>{trimmedLine.replace('# ', '')}</h1>)
                continue
            }

            // Blockquote
            if (trimmedLine.startsWith('> ')) {
                flushList()
                const quoteText = trimmedLine.replace('> ', '')
                elements.push(
                    <blockquote key={i} style={styles.blockquote}>
                        <span dangerouslySetInnerHTML={{ __html: processInlineStyles(quoteText) }} />
                    </blockquote>
                )
                continue
            }

            // List items
            if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\.\s/)) {
                inList = true
                const itemText = trimmedLine.replace(/^-\s|^\d+\.\s/, '')
                listItems.push(itemText)
                continue
            }

            // Empty line
            if (trimmedLine === '') {
                flushList()
                continue
            }

            // Regular paragraph
            flushList()
            elements.push(
                <p key={i} style={styles.p} dangerouslySetInnerHTML={{ __html: processInlineStyles(trimmedLine) }} />
            )
        }

        flushList()
        return elements
    }

    if (loading) return (
        <div style={styles.loading}>
            <div style={styles.spinner} />
        </div>
    )

    return (
        <div style={styles.container}>
            {/* Article-specific SEO */}
            {article && <SEO article={article} />}

            <button style={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={18} />
                <span>{t('views.analysis.backTo')}</span>
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
                            <img src={article.author?.avatar || '/tran-logo.png'} alt={article.author?.name} style={styles.avatar} />
                            <div style={styles.authorInfo}>
                                <span style={styles.authorName}>{article.author?.name || 'TranTradingLab'}</span>
                                <span style={styles.authorRole}>{article.author?.role || 'Research Team'}</span>
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

                    {/* Original author credit */}
                    {article.originalAuthor && (
                        <div style={styles.originalAuthor}>
                            {article.originalLabel || '📄 원문:'} {article.originalAuthor}
                        </div>
                    )}
                </header>

                {/* 文章封面图 */}
                {article.image_url && (
                    <div style={styles.coverImage}>
                        <img src={article.image_url} alt={article.title} style={styles.coverImg} />
                    </div>
                )}

                {/* Custom Podcast Player */}
                {article.audio_url && (
                    <div style={styles.audioPlayer}>
                        <div style={styles.audioHeader}>
                            <div style={styles.audioBadge}>
                                <div style={styles.audioWave}>
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} style={{
                                            ...styles.waveBar,
                                            animationDuration: isPlaying ? '0.8s' : '0s',
                                            height: isPlaying ? '100%' : '20%'
                                        }} />
                                    ))}
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.05em' }}>AI PODCAST</span>
                            </div>
                            <span style={styles.audioTitle}>Morning Briefing Radio</span>
                        </div>

                        <div style={styles.customPlayerControls}>
                            <button onClick={toggleAudio} style={styles.playButton}>
                                {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" style={{ marginLeft: 4 }} />}
                            </button>
                            <div style={styles.playerInfo}>
                                <span style={styles.playerStatus}>{isPlaying ? 'Now Playing...' : 'Click to Listen'}</span>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progressFill, width: `${audioProgress}%` }} />
                                </div>
                            </div>
                            <span style={styles.audioDuration}>{formatTime(currentTime)}</span>
                        </div>

                        <audio
                            ref={audioRef}
                            src={article.audio_url}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                            style={{ display: 'none' }}
                        />
                    </div>
                )}

                <div style={styles.content}>
                    {renderMarkdown(article.content)}
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

            {/* Related Articles */}
            <RelatedArticles
                currentId={article?.id}
                category={article?.category || 'analysis'}
                type="analysis"
                onArticleClick={(a) => console.log('Navigate to:', a.id)}
            />

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
    coverImage: {
        marginBottom: 32,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    coverImg: {
        width: '100%',
        height: 'auto',
        maxHeight: 400,
        objectFit: 'cover',
        display: 'block',
    },
    content: {
        fontSize: 17,
        lineHeight: 1.9,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '0.01em',
    },
    h1: {
        fontSize: 28,
        fontWeight: 700,
        marginTop: 48,
        marginBottom: 24,
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: 12,
    },
    h2: {
        fontSize: 24,
        fontWeight: 700,
        marginTop: 40,
        marginBottom: 20,
        color: '#e2e8f0',
        borderLeft: '3px solid #00ff88',
        paddingLeft: 16,
    },
    h3: {
        fontSize: 20,
        fontWeight: 600,
        marginTop: 32,
        marginBottom: 16,
        color: '#cbd5e1'
    },
    p: {
        marginBottom: 20,
        textAlign: 'justify',
    },
    ul: {
        marginBottom: 24,
        paddingLeft: 24,
    },
    li: {
        marginBottom: 12,
        listStyleType: 'disc',
        paddingLeft: 8,
    },
    blockquote: {
        margin: '28px 0',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08), rgba(99, 102, 241, 0.08))',
        borderLeft: '4px solid #00ff88',
        borderRadius: '0 12px 12px 0',
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 16,
        lineHeight: 1.7,
    },
    hr: {
        border: 'none',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        margin: '40px 0',
    },
    originalAuthor: {
        marginTop: 20,
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
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
    audioPlayer: {
        background: 'linear-gradient(135deg, rgba(8, 12, 20, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        backdropFilter: 'blur(10px)',
    },
    audioHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    audioBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(0, 255, 136, 0.15)',
        padding: '4px 10px',
        borderRadius: 100,
        color: '#00ff88',
    },
    audioTitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: 500,
    },
    audioWave: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: 12,
    },
    waveBar: {
        width: 2,
        height: '100%',
        background: '#00ff88',
        borderRadius: 2,
        animation: 'equalizer 0.8s ease-in-out infinite',
    },
    audioElement: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        marginTop: 8,
        background: '#f1f5f9',
    },
    customPlayerControls: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 8,
        background: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)',
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#00ff88',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
        transition: 'transform 0.2s',
    },
    playerInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    playerStatus: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 600,
    },
    progressBar: {
        width: '100%',
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: '#00ff88',
        borderRadius: 2,
        transition: 'width 0.1s linear',
    },
    audioDuration: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontVariantNumeric: 'tabular-nums',
    },
}

export default ArticleDetailView
