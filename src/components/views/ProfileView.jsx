import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Heart, Bookmark, ArrowLeft, Calendar, Clock,
    ThumbsUp, MessageSquare, ChevronRight, Mail, LogOut,
    Edit3, X, Check, Camera, Upload, Loader, Eye, FileText
} from 'lucide-react'
import { db, TABLES, interactions, auth, storage } from '../../lib/supabase'
import { useAppState, useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'
import ArticleDetailView from './ArticleDetailView'

function ProfileView({ onNavigate }) {
    const { user, isAuthenticated } = useAppState()
    const { logout, openAuthModal, setUser, notify } = useAppActions()
    const { t, language } = useI18n()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [activeTab, setActiveTab] = useState('likes') // 'likes' | 'bookmarks' | 'comments'
    const [likedArticles, setLikedArticles] = useState([])
    const [bookmarkedArticles, setBookmarkedArticles] = useState([])
    const [userComments, setUserComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedArticle, setSelectedArticle] = useState(null)

    // 编辑状态
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [tempAvatar, setTempAvatar] = useState(null)
    const [tempAvatarFile, setTempAvatarFile] = useState(null)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)

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

            // 获取用户评论
            const comments = await interactions.getUserComments?.(user.id) || []
            setUserComments(comments)
        } catch (err) {
            console.error('加载用户互动数据失败:', err)
        }
        setLoading(false)
    }

    // 打开编辑模态框
    const handleOpenEdit = () => {
        setEditName(user?.name || user?.user_metadata?.username || '')
        setEditBio(user?.user_metadata?.bio || '')
        setTempAvatar(null)
        setTempAvatarFile(null)
        setIsEditing(true)
    }

    // 处理头像选择
    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            if (notify) {
                notify(
                    language === 'ko' ? '지원하지 않는 이미지 형식입니다' :
                        language === 'zh' ? '不支持的图片格式' : 'Unsupported image format',
                    'error'
                )
            }
            return
        }

        // 验证文件大小 (最大 2MB)
        if (file.size > 2 * 1024 * 1024) {
            if (notify) {
                notify(
                    language === 'ko' ? '이미지 크기가 2MB를 초과합니다' :
                        language === 'zh' ? '图片大小不能超过 2MB' : 'Image size cannot exceed 2MB',
                    'error'
                )
            }
            return
        }

        // 预览图片
        const reader = new FileReader()
        reader.onload = (event) => {
            setTempAvatar(event.target.result)
            setTempAvatarFile(file)
        }
        reader.readAsDataURL(file)
    }

    // 保存用户信息
    const handleSaveProfile = async () => {
        if (!editName.trim()) return

        setSaving(true)
        try {
            let avatarUrl = user?.avatar || user?.user_metadata?.avatar_url

            // 如果有新头像，先上传
            if (tempAvatarFile) {
                setUploadingAvatar(true)
                try {
                    avatarUrl = await storage.uploadImage(tempAvatarFile, 'avatars')
                } catch (err) {
                    console.error('头像上传失败:', err)
                    if (notify) {
                        notify(
                            language === 'ko' ? '아바타 업로드 실패' :
                                language === 'zh' ? '头像上传失败' : 'Avatar upload failed',
                            'error'
                        )
                    }
                }
                setUploadingAvatar(false)
            }

            // 更新用户元数据
            const updatedUser = await auth.updateProfile({
                username: editName.trim(),
                name: editName.trim(),
                bio: editBio.trim(),
                avatar_url: avatarUrl
            })

            // 更新本地状态
            if (setUser) {
                setUser({
                    ...user,
                    name: editName.trim(),
                    avatar: avatarUrl,
                    user_metadata: {
                        ...user?.user_metadata,
                        username: editName.trim(),
                        name: editName.trim(),
                        bio: editBio.trim(),
                        avatar_url: avatarUrl
                    }
                })
            }

            setIsEditing(false)
            setTempAvatar(null)
            setTempAvatarFile(null)

            if (notify) {
                notify(
                    language === 'ko' ? '프로필이 업데이트되었습니다' :
                        language === 'zh' ? '个人信息已更新' : 'Profile updated',
                    'success'
                )
            }
        } catch (err) {
            console.error('更新个人信息失败:', err)
            if (notify) {
                notify(
                    language === 'ko' ? '업데이트 실패' :
                        language === 'zh' ? '更新失败' : 'Update failed',
                    'error'
                )
            }
        }
        setSaving(false)
    }

    // 格式化日期
    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        const locales = { ko: 'ko-KR', zh: 'zh-CN', en: 'en-US' }
        return date.toLocaleDateString(locales[language] || 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // 获取用户加入时间
    const getMemberSince = () => {
        const createdAt = user?.created_at || user?.user_metadata?.created_at
        if (!createdAt) return '-'
        return formatDate(createdAt)
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

    const currentArticles = activeTab === 'likes' ? likedArticles :
        activeTab === 'bookmarks' ? bookmarkedArticles : []
    const displayName = user.name || user?.user_metadata?.username || user?.user_metadata?.name || 'User'
    const displayAvatar = user.avatar || user?.user_metadata?.avatar_url
    const displayBio = user?.user_metadata?.bio || ''

    return (
        <div style={styles.container}>
            {/* 返回按钮 */}
            <button style={styles.backBtn} onClick={() => onNavigate && onNavigate('home')}>
                <ArrowLeft size={18} />
                <span>{language === 'ko' ? '홈으로' : language === 'zh' ? '返回首页' : 'Back Home'}</span>
            </button>

            {/* 用户信息卡片 */}
            <div style={styles.profileCard}>
                <div style={styles.avatarSection}>
                    <div style={styles.avatarLarge}>
                        {displayAvatar ? (
                            <img src={displayAvatar} alt={displayName} style={styles.avatarImg} />
                        ) : (
                            <span style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <div style={styles.userInfo}>
                    <div style={styles.userNameRow}>
                        <h1 style={styles.userName}>{displayName}</h1>
                        <button style={styles.editBtn} onClick={handleOpenEdit}>
                            <Edit3 size={16} />
                            <span>{language === 'ko' ? '편집' : language === 'zh' ? '编辑' : 'Edit'}</span>
                        </button>
                    </div>

                    {displayBio && (
                        <p style={styles.userBio}>{displayBio}</p>
                    )}

                    <div style={styles.userEmail}>
                        <Mail size={14} />
                        <span>{user.email}</span>
                    </div>

                    <div style={styles.userMeta}>
                        <div style={styles.metaItem}>
                            <Calendar size={14} />
                            <span>
                                {language === 'ko' ? '가입일' : language === 'zh' ? '加入时间' : 'Joined'}: {getMemberSince()}
                            </span>
                        </div>
                    </div>

                    <div style={styles.userStats}>
                        <div style={styles.statItem}>
                            <ThumbsUp size={16} />
                            <span style={styles.statNumber}>{likedArticles.length}</span>
                            <span style={styles.statLabel}>
                                {language === 'ko' ? '좋아요' : language === 'zh' ? '点赞' : 'Likes'}
                            </span>
                        </div>
                        <div style={styles.statItem}>
                            <Bookmark size={16} />
                            <span style={styles.statNumber}>{bookmarkedArticles.length}</span>
                            <span style={styles.statLabel}>
                                {language === 'ko' ? '저장됨' : language === 'zh' ? '收藏' : 'Saved'}
                            </span>
                        </div>
                        <div style={styles.statItem}>
                            <MessageSquare size={16} />
                            <span style={styles.statNumber}>{userComments.length}</span>
                            <span style={styles.statLabel}>
                                {language === 'ko' ? '댓글' : language === 'zh' ? '评论' : 'Comments'}
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
                    <span>{language === 'ko' ? '좋아요한 글' : language === 'zh' ? '点赞的文章' : 'Liked'}</span>
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
                    <span>{language === 'ko' ? '저장한 글' : language === 'zh' ? '收藏的文章' : 'Saved'}</span>
                    <span style={styles.tabCount}>{bookmarkedArticles.length}</span>
                </button>
            </div>

            {/* 文章列表 */}
            <div style={styles.articleList}>
                {loading ? (
                    <div style={styles.loadingState}>
                        <div style={styles.spinner} />
                        <span>{language === 'ko' ? '로딩 중...' : language === 'zh' ? '加载中...' : 'Loading...'}</span>
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
                        <button
                            style={styles.browseBtn}
                            onClick={() => onNavigate && onNavigate('analysis')}
                        >
                            <FileText size={16} />
                            <span>{language === 'ko' ? '글 둘러보기' : language === 'zh' ? '浏览文章' : 'Browse Articles'}</span>
                        </button>
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

            {/* 编辑模态框 */}
            {isEditing && (
                <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {language === 'ko' ? '프로필 편집' : language === 'zh' ? '编辑个人资料' : 'Edit Profile'}
                            </h2>
                            <button style={styles.modalCloseBtn} onClick={() => setIsEditing(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            {/* 头像上传 */}
                            <div style={styles.editAvatarSection}>
                                <div
                                    style={styles.editAvatar}
                                    onClick={handleAvatarClick}
                                >
                                    {uploadingAvatar ? (
                                        <div style={styles.avatarLoading}>
                                            <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                        </div>
                                    ) : tempAvatar ? (
                                        <img src={tempAvatar} alt="Preview" style={styles.avatarImg} />
                                    ) : displayAvatar ? (
                                        <img src={displayAvatar} alt={displayName} style={styles.avatarImg} />
                                    ) : (
                                        <span style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</span>
                                    )}
                                    <div style={styles.avatarOverlay}>
                                        <Camera size={24} color="#fff" />
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />
                                <span style={styles.avatarHint}>
                                    {language === 'ko' ? '클릭하여 사진 변경' :
                                        language === 'zh' ? '点击更换头像' : 'Click to change photo'}
                                </span>
                            </div>

                            {/* 用户名 */}
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>
                                    {language === 'ko' ? '사용자 이름' : language === 'zh' ? '用户名' : 'Username'}
                                    <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    style={styles.formInput}
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    placeholder={language === 'ko' ? '이름을 입력하세요' : language === 'zh' ? '请输入用户名' : 'Enter your name'}
                                    maxLength={30}
                                />
                            </div>

                            {/* 个人简介 */}
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>
                                    {language === 'ko' ? '자기소개' : language === 'zh' ? '个人简介' : 'Bio'}
                                </label>
                                <textarea
                                    style={styles.formTextarea}
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    placeholder={language === 'ko' ? '간단한 자기소개를 적어보세요' :
                                        language === 'zh' ? '写一段简短的个人介绍' : 'Write a short bio about yourself'}
                                    rows={3}
                                    maxLength={200}
                                />
                                <span style={styles.charCount}>{editBio.length}/200</span>
                            </div>

                            {/* 邮箱（只读） */}
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>
                                    {language === 'ko' ? '이메일' : language === 'zh' ? '邮箱' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    style={{ ...styles.formInput, opacity: 0.6, cursor: 'not-allowed' }}
                                    value={user.email}
                                    disabled
                                />
                                <span style={styles.formHint}>
                                    {language === 'ko' ? '이메일은 변경할 수 없습니다' :
                                        language === 'zh' ? '邮箱不可修改' : 'Email cannot be changed'}
                                </span>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                                {language === 'ko' ? '취소' : language === 'zh' ? '取消' : 'Cancel'}
                            </button>
                            <button
                                style={{
                                    ...styles.saveBtn,
                                    opacity: saving || !editName.trim() ? 0.6 : 1
                                }}
                                onClick={handleSaveProfile}
                                disabled={saving || !editName.trim()}
                            >
                                {saving ? (
                                    <>
                                        <div style={styles.btnSpinner} />
                                        {uploadingAvatar
                                            ? (language === 'ko' ? '업로드 중...' : language === 'zh' ? '上传中...' : 'Uploading...')
                                            : (language === 'ko' ? '저장 중...' : language === 'zh' ? '保存中...' : 'Saving...')
                                        }
                                    </>
                                ) : (
                                    <><Check size={16} /> {language === 'ko' ? '저장' : language === 'zh' ? '保存' : 'Save'}</>
                                )}
                            </button>
                        </div>
                    </div>
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
        alignItems: 'flex-start',
        gap: 28,
        padding: 32,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 24,
        marginBottom: 32,
        position: 'relative',
    },
    avatarSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
        flexShrink: 0,
        border: '3px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 800,
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userNameRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    userName: {
        fontSize: 28,
        fontWeight: 800,
        margin: 0,
        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    editBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    userBio: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        margin: '0 0 12px 0',
        lineHeight: 1.5,
    },
    userEmail: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
    },
    userMeta: {
        display: 'flex',
        gap: 20,
        marginBottom: 16,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
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
    },
    statNumber: {
        fontWeight: 700,
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
        position: 'absolute',
        top: 24,
        right: 24,
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
        gap: 16,
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
    browseBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        border: 'none',
        borderRadius: 10,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
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
    // 模态框样式
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        width: 480,
        maxWidth: '90%',
        maxHeight: '85vh',
        overflow: 'auto',
        background: 'linear-gradient(180deg, #0d1117 0%, #080c12 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        animation: 'fadeIn 0.2s ease',
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 28px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: '#fff',
        margin: 0,
    },
    modalCloseBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: 10,
        padding: 8,
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    modalBody: {
        padding: '28px',
    },
    editAvatarSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 28,
    },
    editAvatar: {
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    avatarOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.2s',
    },
    avatarLoading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
    },
    avatarHint: {
        marginTop: 12,
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 13,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
    },
    required: {
        color: '#ff3860',
    },
    formInput: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#fff',
        fontSize: 15,
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    formTextarea: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#fff',
        fontSize: 15,
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        minHeight: 80,
    },
    charCount: {
        display: 'block',
        textAlign: 'right',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
    },
    formHint: {
        display: 'block',
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 6,
    },
    modalFooter: {
        display: 'flex',
        gap: 12,
        padding: '20px 28px 28px',
    },
    cancelBtn: {
        flex: 1,
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    saveBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 20px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 12,
        color: '#000',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    btnSpinner: {
        width: 16,
        height: 16,
        border: '2px solid rgba(0,0,0,0.2)',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
}

// 添加 CSS 动画和悬停效果
const styleSheet = document.createElement('style')
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .profile-edit-avatar:hover .avatar-overlay {
        opacity: 1 !important;
    }
    
    .profile-edit-avatar:hover {
        transform: scale(1.02);
    }
`
if (typeof document !== 'undefined' && !document.getElementById('profile-styles')) {
    styleSheet.id = 'profile-styles'
    document.head.appendChild(styleSheet)
}

export default ProfileView
