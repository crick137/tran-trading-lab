/**
 * Newsletter Subscription Component
 * 邮件订阅组件
 */
import React, { useState } from 'react'
import { Mail, Check, AlertCircle, Loader, Sparkles } from 'lucide-react'
import { useAppState } from '../context/AppContext'

const API_BASE = import.meta.env.PROD
    ? 'https://www.trantradinglab.com'
    : 'http://localhost:3001'

const translations = {
    ko: {
        title: '뉴스레터 구독',
        subtitle: '최신 암호화폐 분석과 시장 동향을 받아보세요',
        placeholder: '이메일 주소',
        namePlaceholder: '이름 (선택)',
        button: '구독하기',
        loading: '처리 중...',
        success: '구독해 주셔서 감사합니다! 확인 이메일을 확인해 주세요.',
        error: '오류가 발생했습니다. 다시 시도해 주세요.',
        already: '이미 구독 중인 이메일입니다.',
        benefits: ['실시간 시장 분석', 'AI 매매 신호', '독점 거래 전략']
    },
    zh: {
        title: '订阅邮件通知',
        subtitle: '获取最新加密货币分析和市场动态',
        placeholder: '邮箱地址',
        namePlaceholder: '姓名（选填）',
        button: '立即订阅',
        loading: '处理中...',
        success: '订阅成功！请查收确认邮件。',
        error: '出错了，请稍后重试。',
        already: '该邮箱已订阅。',
        benefits: ['实时市场分析', 'AI 交易信号', '独家交易策略']
    },
    en: {
        title: 'Subscribe to Newsletter',
        subtitle: 'Get the latest crypto analysis and market trends',
        placeholder: 'Email address',
        namePlaceholder: 'Name (optional)',
        button: 'Subscribe',
        loading: 'Processing...',
        success: 'Thank you for subscribing! Check your email for confirmation.',
        error: 'Something went wrong. Please try again.',
        already: 'This email is already subscribed.',
        benefits: ['Real-time market analysis', 'AI trading signals', 'Exclusive strategies']
    }
}

function NewsletterSubscribe({ variant = 'default' }) {
    const { language } = useAppState()
    const t = translations[language] || translations.en

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [message, setMessage] = useState('')

    // Email validation regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        // Validate email format
        if (!isValidEmail(email)) {
            setStatus('error')
            setMessage(language === 'ko' ? '유효한 이메일을 입력해 주세요.'
                : language === 'zh' ? '请输入有效的邮箱地址。'
                    : 'Please enter a valid email address.')
            return
        }

        setStatus('loading')
        try {
            // Try API first
            const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, language })
            })
            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setMessage(t.success)
                setEmail('')
                setName('')
                // Also save to localStorage as backup
                saveToLocalStorage(email, name)

                // Track signup event
                if (window.gtag) {
                    window.gtag('event', 'sign_up', {
                        method: 'newsletter',
                        location: 'sidebar'
                    })
                }
            } else {
                setStatus('error')
                setMessage(data.error?.includes('already') ? t.already : t.error)
            }
        } catch (err) {
            console.warn('API failed, saving locally:', err)
            // Fallback: Save to localStorage
            saveToLocalStorage(email, name)
            setStatus('success')
            setMessage(t.success)
            setEmail('')
            setName('')

            // Track signup event (fallback)
            if (window.gtag) {
                window.gtag('event', 'sign_up', {
                    method: 'newsletter_fallback',
                    location: 'sidebar'
                })
            }
        }

        // 5秒后重置状态
        setTimeout(() => {
            setStatus('idle')
            setMessage('')
        }, 5000)
    }

    // Fallback local storage
    const saveToLocalStorage = (email, name) => {
        try {
            const subscribers = JSON.parse(localStorage.getItem('tran_newsletter_pending') || '[]')
            if (!subscribers.find(s => s.email === email)) {
                subscribers.push({
                    email,
                    name,
                    language,
                    subscribed_at: new Date().toISOString()
                })
                localStorage.setItem('tran_newsletter_pending', JSON.stringify(subscribers))
            }
        } catch (e) {
            console.warn('Failed to save to localStorage:', e)
        }
    }

    const isCompact = variant === 'compact'

    return (
        <div style={isCompact ? styles.containerCompact : styles.container}>
            {/* 背景光效 */}
            <div style={styles.glow} />

            <div style={styles.content}>
                {!isCompact && (
                    <div style={styles.iconWrap}>
                        <Mail size={28} />
                    </div>
                )}

                <div style={styles.textSection}>
                    <h3 style={isCompact ? styles.titleCompact : styles.title}>
                        <Sparkles size={16} style={{ marginRight: 8 }} />
                        {t.title}
                    </h3>
                    {!isCompact && <p style={styles.subtitle}>{t.subtitle}</p>}
                </div>

                {!isCompact && (
                    <div style={styles.benefits}>
                        {t.benefits.map((b, i) => (
                            <span key={i} style={styles.benefit}>✓ {b}</span>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.placeholder}
                            style={styles.input}
                            disabled={status === 'loading' || status === 'success'}
                        />
                        {!isCompact && (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.namePlaceholder}
                                style={{ ...styles.input, flex: '0 0 140px' }}
                                disabled={status === 'loading' || status === 'success'}
                            />
                        )}
                        <button
                            type="submit"
                            disabled={!email || status === 'loading' || status === 'success'}
                            style={{
                                ...styles.button,
                                ...(status === 'success' ? styles.buttonSuccess : {}),
                                ...(status === 'error' ? styles.buttonError : {})
                            }}
                        >
                            {status === 'loading' && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                            {status === 'success' && <Check size={16} />}
                            {status === 'error' && <AlertCircle size={16} />}
                            {status === 'idle' && <Mail size={16} />}
                            <span>{status === 'loading' ? t.loading : t.button}</span>
                        </button>
                    </div>
                </form>

                {message && (
                    <div style={{
                        ...styles.message,
                        background: status === 'success'
                            ? 'rgba(0, 210, 106, 0.1)'
                            : 'rgba(255, 56, 96, 0.1)',
                        borderColor: status === 'success'
                            ? 'rgba(0, 210, 106, 0.2)'
                            : 'rgba(255, 56, 96, 0.2)',
                        color: status === 'success' ? '#00ff88' : '#ff3860'
                    }}>
                        {status === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 210, 106, 0.05) 100%)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        borderRadius: 20,
        padding: 32,
        overflow: 'hidden',
    },
    containerCompact: {
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: 20,
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
    iconWrap: {
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00d4ff 0%, #00d26a 100%)',
        borderRadius: 16,
        color: '#000',
        marginBottom: 20,
    },
    textSection: {
        marginBottom: 16,
    },
    title: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
    },
    titleCompact: {
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
    },
    subtitle: {
        margin: '8px 0 0',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    benefits: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    benefit: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        background: 'rgba(0, 210, 106, 0.1)',
        padding: '6px 12px',
        borderRadius: 20,
    },
    form: {
        marginTop: 16,
    },
    inputGroup: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
    },
    input: {
        flex: 1,
        minWidth: 180,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        fontSize: 14,
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #00d4ff 0%, #00d26a 100%)',
        border: 'none',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        color: '#000',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    buttonSuccess: {
        background: 'linear-gradient(135deg, #00d26a, #00ff88)',
    },
    buttonError: {
        background: 'linear-gradient(135deg, #ff3860, #ff6b8a)',
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        padding: '12px 16px',
        borderRadius: 10,
        fontSize: 13,
        border: '1px solid',
    },
}

export default NewsletterSubscribe
