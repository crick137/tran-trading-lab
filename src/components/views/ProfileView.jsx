import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Heart, Bookmark, ArrowLeft, Calendar, Clock,
    ThumbsUp, MessageSquare, ChevronRight, Mail, LogOut
} from 'lucide-react'
import { db, TABLES, interactions } from '../../lib/supabase'
import { useAppState, useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'
import ArticleDetailView from './ArticleDetailView'

function ProfileView({ onNavigate }) {
    const { user, isAuthenticated } = useAppState()
    const { logout, openAuthModal } = useAppActions()
    const { t, language } = useI18n()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('likes') // 'likes' | 'bookmarks'
    const [likedArticles, setLikedArticles] = useState([])
    const [bookmarkedArticles, setBookmarkedArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedArticle, setSelectedArticle] = useState(null)

    // 加载用户点赞和收藏的文章
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadUserInteractions()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated, user?.id])

    const loadUserInteractions = async () => {
        setLoading(true)
        try {
            // 获取用户点赞的文章
            const likes = await interactions.getUserLikes(user.id)
            setLikedArticles(likes || [])

            // 获取用户收藏的文章
            const bookmarks = await interactions.getUserBookmarks(user.id)
            setBookmarkedArticles(bookmarks || [])
        } catch (err) {
            console.error('加载用户互动数据失败:', err)
        }
        setLoading(false)
    }

    // 格式化日期
    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const locales = { ko: 'ko-KR', zh: 'zh-CN', en: 'en-US' }
        return date.toLocaleDateString(locales[language] || 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // 未登录状态
    if (!isAuthenticated || !user) {
        return (
            <div style={styles.container}>
                <div style={styles.notLoggedIn}>
                    <User size={64} style={{ opacity: 0.3 }} />
                    <h2 style={styles.notLoggedInTitle}>
                        {language === 'ko' ? '로그인이 필요합니다' :
                            language === 'zh' ? '请先登录' : 'Please Log In'}
                    </h2>
                    <p style={styles.notLoggedInDesc}>
                        {language === 'ko' ? '프로필을 보려면 로그인하세요' :
                            language === 'zh' ? '登录后查看您的个人资料' : 'Log in to view your profile'}
                    </p>
                    <button style={styles.loginButton} onClick={openAuthModal}>
                        {t('nav.login')}
                    </button>
                </div>
            </div>
        )
    }

    // 查看文章详情
    if (selectedArticle) {
        return (
            <ArticleDetailView
                articleId={selectedArticle.id}
                initialData={selectedArticle}
                onBack={() => setSelectedArticle(null)}
            />
        )
    }

    const currentArticles = activeTab === 'likes' ? likedArticles : bookmarkedArticles

    return (
        <div style={styles.container}>
            {/* 返回按钮 */}
            <button style={styles.backBtn} onClick={() => onNavigate && onNavigate('home')}>
                <ArrowLeft size={18} />
                <span>{language === 'ko' ? '홈으로' : language === 'zh' ? '返回首页' : 'Back Home'}</span>
            </button>

            {/* 用户信息卡片 */}
            <div style={styles.profileCard}>
                <div style={styles.avatarLarge}>
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={styles.avatarImg} />
                    ) : (
                        <span style={styles.avatarText}>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                </div>
                <div style={styles.userInfo}>
                    <h1 style={styles.userName}>{user.name || 'User'}</h1>
                    <div style={styles.userEmail}>
                        <Mail size={14} />
                        <span>{user.email}</span>
                    </div>
                    <div style={styles.userStats}>
                        <div style={styles.statItem}>
                            <ThumbsUp size={16} />
                            <span>{likedArticles.length}</span>
                            <span style={styles.statLabel}>
                                {language === 'ko' ? '좋아요' : language === 'zh' ? '点赞' : 'Likes'}
                            </span>
                        </div>
                        <div style={styles.statItem}>
                            <Bookmark size={16} />
                            <span>{bookmarkedArticles.length}</span>
                            <span style={styles.statLabel}>
                                {language === 'ko' ? '저장됨' : language === 'zh' ? '收藏' : 'Saved'}
                            </span>
                        </div>
                    </div>
                </div>
                <button style={styles.logoutBtn} onClick={logout}>
                    <LogOut size={16} />
                    <span>{t('nav.logout')}</span>
                </button>
            </div>

            {/* Tab 切换 */}
            <div style={styles.tabs}>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'likes' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('likes')}
                >
                    <ThumbsUp size={18} />
                    <span>{language === 'ko' ? '좋아요한 글' : language === 'zh' ? '点赞的文章' : 'Liked Articles'}</span>
                    <span style={styles.tabCount}>{likedArticles.length}</span>
                </button>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'bookmarks' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('bookmarks')}
                >
                    <Bookmark size={18} />
                    <span>{language === 'ko' ? '저장한 글' : language === 'zh' ? '收藏的文章' : 'Saved Articles'}</span>
                    <span style={styles.tabCount}>{bookmarkedArticles.length}</span>
                </button>
            </div>

            {/* 文章列表 */}
            <div style={styles.articleList}>
                {loading ? (
                    <div style={styles.loadingState}>
                        <div style={styles.spinner} />
                        <span>{t('common.loading')}</span>
                    </div>
                ) : currentArticles.length === 0 ? (
                    <div style={styles.emptyState}>
                        {activeTab === 'likes' ? <ThumbsUp size={48} style={{ opacity: 0.3 }} /> : <Bookmark size={48} style={{ opacity: 0.3 }} />}
                        <h3 style={styles.emptyTitle}>
                            {activeTab === 'likes'
                                ? (language === 'ko' ? '좋아요한 글이 없습니다' : language === 'zh' ? '暂无点赞的文章' : 'No liked articles')
                                : (language === 'ko' ? '저장한 글이 없습니다' : language === 'zh' ? '暂无收藏的文章' : 'No saved articles')}
                        </h3>
                        <p style={styles.emptyDesc}>
                            {activeTab === 'likes'
                                ? (language === 'ko' ? '마음에 드는 글에 좋아요를 눌러보세요' : language === 'zh' ? '浏览文章并点赞你喜欢的内容' : 'Like articles you enjoy reading')
                                : (language === 'ko' ? '나중에 읽고 싶은 글을 저장해보세요' : language === 'zh' ? '收藏文章以便稍后阅读' : 'Save articles to read later')}
                        </p>
                    </div>
                ) : (
                    currentArticles.map(article => (
                        <div
                            key={article.id}
                            style={styles.articleCard}
                            onClick={() => setSelectedArticle(article)}
                        >
                            {article.image_url && (
                                <div style={styles.articleImage}>
                                    <img src={article.image_url} alt={article.title} style={styles.articleImg} />
                                </div>
                            )}
                            <div style={styles.articleContent}>
                                <div style={styles.articleTags}>
                                    {(article.tags || []).slice(0, 2).map(tag => (
                                        <span key={tag} style={styles.articleTag}>#{tag}</span>
                                    ))}
                                </div>
                                <h3 style={styles.articleTitle}>{article.title}</h3>
                                <p style={styles.articleSubtitle}>{article.subtitle}</p>
                                <div style={styles.articleMeta}>
                                    <div style={styles.articleMetaItem}>
                                        <Calendar size={12} />
                                        <span>{formatDate(article.created_at)}</span>
                                    </div>
                                    <div style={styles.articleMetaItem}>
                                        <Clock size={12} />
                                        <span>{article.read_time || '5 min'}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={20} style={styles.articleArrow} />
                        </div>
                    ))
                )}
            </div>
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
    notLoggedIn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 16,
        color: 'rgba(255,255,255,0.5)',
    },
    notLoggedInTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
        margin: 0,
    },
    notLoggedInDesc: {
        fontSize: 14,
        margin: 0,
    },
    loginButton: {
        marginTop: 16,
        padding: '12px 32px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 12,
        color: '#000',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    profileCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: 32,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 20,
        marginBottom: 32,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
        flexShrink: 0,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 800,
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 28,
        fontWeight: 800,
        margin: '0 0 8px 0',
        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    userEmail: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 16,
    },
    userStats: {
        display: 'flex',
        gap: 24,
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 14,
        color: '#00ff88',
        fontWeight: 600,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 400,
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: 'rgba(255, 56, 96, 0.1)',
        border: '1px solid rgba(255, 56, 96, 0.2)',
        borderRadius: 10,
        color: '#ff3860',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    tabs: {
        display: 'flex',
        gap: 12,
        marginBottom: 24,
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    tabActive: {
        background: 'rgba(0, 255, 136, 0.08)',
        borderColor: 'rgba(0, 255, 136, 0.2)',
        color: '#00ff88',
    },
    tabCount: {
        marginLeft: 'auto',
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
    },
    articleList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        gap: 16,
        color: 'rgba(255,255,255,0.5)',
    },
    spinner: {
        width: 32,
        height: 32,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        gap: 12,
        color: 'rgba(255,255,255,0.5)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        border: '1px dashed rgba(255,255,255,0.1)',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
        margin: 0,
    },
    emptyDesc: {
        fontSize: 14,
        margin: 0,
        textAlign: 'center',
    },
    articleCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    articleImage: {
        width: 100,
        height: 70,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
    },
    articleImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    articleContent: {
        flex: 1,
        minWidth: 0,
    },
    articleTags: {
        display: 'flex',
        gap: 8,
        marginBottom: 8,
    },
    articleTag: {
        fontSize: 11,
        color: '#00ff88',
        fontWeight: 600,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 4px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    articleSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        margin: '0 0 8px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    articleMeta: {
        display: 'flex',
        gap: 16,
    },
    articleMetaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
    articleArrow: {
        color: 'rgba(255,255,255,0.3)',
        flexShrink: 0,
    },
}

export default ProfileView
