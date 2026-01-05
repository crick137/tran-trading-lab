import React, { useState } from 'react'
import { Mail, X, Check, Loader, Gift } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * 邮件订阅组件
 * 支持两种模式：内嵌表单 和 弹窗模式
 */
function EmailSubscribe({ variant = 'inline', onClose }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        setError(null)

        try {
            const { error: dbError } = await supabase
                .from('subscribers')
                .insert([{ email, name: name || null, source: 'website' }])

            if (dbError) {
                if (dbError.code === '23505') {
                    setError('이미 구독 중인 이메일입니다')
                } else {
                    throw dbError
                }
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError('구독 처리 중 오류가 발생했습니다')
            console.error('Subscribe error:', err)
        }

        setLoading(false)
    }

    // 成功状态
    if (success) {
        return (
            <div style={variant === 'modal' ? styles.modal : styles.inline}>
                {variant === 'modal' && (
                    <button style={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                )}
                <div style={styles.successContainer}>
                    <div style={styles.successIcon}>
                        <Check size={32} />
                    </div>
                    <h3 style={styles.successTitle}>구독 완료! 🎉</h3>
                    <p style={styles.successText}>
                        매주 최고의 트레이딩 인사이트를 보내드립니다
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={variant === 'modal' ? styles.modal : styles.inline}>
            {variant === 'modal' && (
                <button style={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
            )}

            <div style={styles.header}>
                <div style={styles.iconContainer}>
                    <Gift size={24} />
                </div>
                <h3 style={styles.title}>무료 뉴스레터 구독</h3>
                <p style={styles.subtitle}>
                    매주 최고의 시장 분석과 트레이딩 인사이트를 받아보세요
                </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="이름 (선택)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="이메일 주소 *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                    {loading ? (
                        <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <>
                            <Mail size={18} />
                            구독하기
                        </>
                    )}
                </button>
            </form>

            <p style={styles.privacy}>
                스팸 없음 · 언제든 구독 취소 가능
            </p>
        </div>
    )
}

/**
 * 订阅弹窗触发器
 */
export function SubscribePopup() {
    const [isOpen, setIsOpen] = useState(false)

    // 检查是否已显示过
    React.useEffect(() => {
        const hasShown = sessionStorage.getItem('subscribePopupShown')
        if (!hasShown) {
            const timer = setTimeout(() => {
                setIsOpen(true)
                sessionStorage.setItem('subscribePopupShown', 'true')
            }, 30000) // 30秒后显示
            return () => clearTimeout(timer)
        }
    }, [])

    if (!isOpen) return null

    return (
        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                <EmailSubscribe variant="modal" onClose={() => setIsOpen(false)} />
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        position: 'relative',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 40,
        maxWidth: 420,
        width: '90%',
    },
    inline: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 30,
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
    },
    header: {
        textAlign: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 56,
        height: 56,
        background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        color: '#000',
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 8px',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    input: {
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#fff',
        fontSize: 15,
        outline: 'none',
    },
    submitBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '14px 24px',
        background: 'linear-gradient(90deg, #00ff88, #00cc6a)',
        border: 'none',
        borderRadius: 12,
        color: '#000',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 8,
    },
    error: {
        color: '#ff4757',
        fontSize: 13,
        margin: 0,
    },
    privacy: {
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 16,
    },
    successContainer: {
        textAlign: 'center',
        padding: 20,
    },
    successIcon: {
        width: 64,
        height: 64,
        background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: '#000',
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 12px',
    },
    successText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        margin: 0,
    },
}

export default EmailSubscribe
