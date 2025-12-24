import React, { useState, useEffect } from 'react'
import { X, Send, Trash2, MessageSquare, User } from 'lucide-react'
import { interactions } from '../lib/supabase'
import { useAppState, useAppActions } from '../context/AppContext'
import { useI18n } from '../hooks/useI18n'

function CommentPanel({ articleId, isOpen, onClose }) {
    const { user, isAuthenticated } = useAppState()
    const { openAuthModal, notify } = useAppActions()
    const { t, language } = useI18n()

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // 加载评论
    useEffect(() => {
        if (isOpen && articleId) {
            loadComments()
        }
    }, [isOpen, articleId])

    const loadComments = async () => {
        setLoading(true)
        try {
            const data = await interactions.getComments(articleId)
            setComments(data)
        } catch (err) {
            console.error('加载评论失败:', err)
        }
        setLoading(false)
    }

    // 提交评论
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        if (!isAuthenticated) {
            openAuthModal()
            return
        }

        setSubmitting(true)
        try {
            const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Anonymous'
            const comment = await interactions.addComment(articleId, user.id, username, newComment.trim())
            setComments([comment, ...comments])
            setNewComment('')
            notify(t('views.interaction.commentPosted'), 'success')
        } catch (err) {
            console.error('发布评论失败:', err)
            notify(t('views.interaction.commentFailed'), 'error')
        }
        setSubmitting(false)
    }

    // 删除评论
    const handleDelete = async (commentId) => {
        if (!confirm(t('views.interaction.deleteConfirm'))) return

        try {
            await interactions.deleteComment(commentId, user.id)
            setComments(comments.filter(c => c.id !== commentId))
            notify(t('views.interaction.commentDeleted'), 'success')
        } catch (err) {
            console.error('删除评论失败:', err)
            notify(t('views.interaction.deleteFailed'), 'error')
        }
    }

    // 格式化时间
    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = Math.floor((now - date) / 1000 / 60)

        if (diff < 1) return t('views.interaction.justNow')
        if (diff < 60) return t('views.interaction.minutesAgo').replace('{n}', diff)
        if (diff < 1440) return t('views.interaction.hoursAgo').replace('{n}', Math.floor(diff / 60))

        const locales = { ko: 'ko-KR', zh: 'zh-CN', en: 'en-US' }
        return date.toLocaleDateString(locales[language] || 'en-US')
    }

    if (!isOpen) return null

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.panel} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerTitle}>
                        <MessageSquare size={20} />
                        <span>{t('views.interaction.comments')} ({comments.length})</span>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Comment Input */}
                <form style={styles.inputSection} onSubmit={handleSubmit}>
                    <div style={styles.inputWrapper}>
                        <textarea
                            style={styles.textarea}
                            placeholder={isAuthenticated ? t('views.interaction.writeComment') : t('views.interaction.loginToComment')}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            rows={3}
                            disabled={!isAuthenticated}
                        />
                        <button
                            type="submit"
                            style={{
                                ...styles.submitBtn,
                                opacity: submitting || !newComment.trim() ? 0.5 : 1
                            }}
                            disabled={submitting || !newComment.trim()}
                        >
                            <Send size={16} />
                            <span>{submitting ? t('views.interaction.sending') : t('views.interaction.send')}</span>
                        </button>
                    </div>
                </form>

                {/* Comments List */}
                <div style={styles.commentList}>
                    {loading ? (
                        <div style={styles.emptyState}>
                            <div style={styles.spinner} />
                            <span>{t('common.loading')}</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div style={styles.emptyState}>
                            <MessageSquare size={40} style={{ opacity: 0.3 }} />
                            <span>{t('views.interaction.noComments')}</span>
                            <span style={{ fontSize: 12 }}>{t('views.interaction.beFirst')}</span>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} style={styles.commentItem}>
                                <div style={styles.avatar}>
                                    <User size={16} />
                                </div>
                                <div style={styles.commentContent}>
                                    <div style={styles.commentHeader}>
                                        <span style={styles.username}>{comment.username}</span>
                                        <span style={styles.time}>{formatTime(comment.created_at)}</span>
                                    </div>
                                    <p style={styles.commentText}>{comment.content}</p>
                                </div>
                                {user?.id === comment.user_id && (
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    panel: {
        width: 420,
        maxWidth: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0f18 0%, #050810 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
    },
    closeBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: 8,
        padding: 8,
        cursor: 'pointer',
        color: 'rgba(255, 255, 255, 0.6)',
        transition: 'all 0.2s',
    },
    inputSection: {
        padding: 20,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    textarea: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#fff',
        fontSize: 14,
        resize: 'none',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s',
    },
    submitBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: 'flex-end',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 8,
        color: '#000',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    commentList: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 40,
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
    },
    spinner: {
        width: 24,
        height: 24,
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    commentItem: {
        display: 'flex',
        gap: 12,
        padding: '16px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ff88',
        flexShrink: 0,
    },
    commentContent: {
        flex: 1,
        minWidth: 0,
    },
    commentHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },
    username: {
        fontSize: 14,
        fontWeight: 600,
        color: '#fff',
    },
    time: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    commentText: {
        margin: 0,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 1.6,
        wordBreak: 'break-word',
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        padding: 4,
        cursor: 'pointer',
        color: 'rgba(255, 255, 255, 0.3)',
        transition: 'color 0.2s',
        flexShrink: 0,
    },
}

export default CommentPanel
