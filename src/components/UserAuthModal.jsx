import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
    X, Mail, Lock, User, ArrowRight, ArrowLeft,
    Github, Chrome, Shield, CheckCircle, AlertCircle, Zap,
    Eye, EyeOff, KeyRound, RefreshCw
} from 'lucide-react'
import { auth } from '../lib/supabase'
import { useI18n } from '../hooks/useI18n'

function UserAuthModal({ isOpen, onClose, onLogin }) {
    const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'forgot' | 'reset-sent'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const { t, language } = useI18n()

    if (!isOpen) return null

    const texts = {
        ko: {
            signin_title: '로그인',
            signin_subtitle: 'TRAN Trading Lab에 오신 것을 환영합니다',
            signup_title: '회원가입',
            signup_subtitle: '새 계정을 만들고 시작하세요',
            forgot_title: '비밀번호 찾기',
            forgot_subtitle: '이메일로 재설정 링크를 보내드립니다',
            reset_sent_title: '메일 전송 완료',
            reset_sent_subtitle: '이메일을 확인해주세요',
            email: '이메일',
            password: '비밀번호',
            username: '사용자 이름',
            remember: '로그인 유지',
            forgot: '비밀번호를 잊으셨나요?',
            signin_btn: '로그인',
            signup_btn: '가입하기',
            send_reset: '재설정 링크 보내기',
            back_to_signin: '로그인으로 돌아가기',
            no_account: '계정이 없으신가요?',
            has_account: '이미 계정이 있으신가요?',
            go_signup: '가입하기',
            go_signin: '로그인',
            or: '또는',
            error_required: '이메일과 비밀번호를 입력해주세요',
            error_username: '사용자 이름을 입력해주세요',
            email_sent: '비밀번호 재설정 링크를 이메일로 보냈습니다',
            features: {
                security: '최고 수준의 보안',
                realtime: '실시간 시장 데이터',
                ai: 'AI 기반 분석'
            }
        },
        zh: {
            signin_title: '登录',
            signin_subtitle: '欢迎来到 TRAN Trading Lab',
            signup_title: '注册',
            signup_subtitle: '创建新账户开始使用',
            forgot_title: '找回密码',
            forgot_subtitle: '我们将发送重置链接到您的邮箱',
            reset_sent_title: '邮件已发送',
            reset_sent_subtitle: '请检查您的邮箱',
            email: '邮箱',
            password: '密码',
            username: '用户名',
            remember: '记住登录',
            forgot: '忘记密码?',
            signin_btn: '登录',
            signup_btn: '注册',
            send_reset: '发送重置链接',
            back_to_signin: '返回登录',
            no_account: '还没有账户?',
            has_account: '已有账户?',
            go_signup: '注册',
            go_signin: '登录',
            or: '或',
            error_required: '请输入邮箱和密码',
            error_username: '请输入用户名',
            email_sent: '密码重置链接已发送到您的邮箱',
            features: {
                security: '顶级安全防护',
                realtime: '实时市场数据',
                ai: 'AI驱动分析'
            }
        },
        en: {
            signin_title: 'Sign In',
            signin_subtitle: 'Welcome to TRAN Trading Lab',
            signup_title: 'Sign Up',
            signup_subtitle: 'Create a new account to get started',
            forgot_title: 'Reset Password',
            forgot_subtitle: 'We\'ll send a reset link to your email',
            reset_sent_title: 'Email Sent',
            reset_sent_subtitle: 'Please check your inbox',
            email: 'Email',
            password: 'Password',
            username: 'Username',
            remember: 'Remember me',
            forgot: 'Forgot password?',
            signin_btn: 'Sign In',
            signup_btn: 'Sign Up',
            send_reset: 'Send Reset Link',
            back_to_signin: 'Back to Sign In',
            no_account: 'Don\'t have an account?',
            has_account: 'Already have an account?',
            go_signup: 'Sign Up',
            go_signin: 'Sign In',
            or: 'or',
            error_required: 'Please enter email and password',
            error_username: 'Please enter a username',
            email_sent: 'Password reset link sent to your email',
            features: {
                security: 'Bank-grade Security',
                realtime: 'Real-time Market Data',
                ai: 'AI-powered Analytics'
            }
        }
    }

    const txt = texts[language] || texts.en

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            if (mode === 'forgot') {
                await auth.resetPassword(email)
                setMode('reset-sent')
                setSuccess(txt.email_sent)
                setLoading(false)
                return
            }

            if (!email || !password) {
                throw new Error(txt.error_required)
            }

            let userData = null

            if (mode === 'signin') {
                const { user, session } = await auth.signIn(email, password)
                userData = {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0],
                    role: user.user_metadata?.role || 'user',
                    avatar: user.user_metadata?.avatar_url || null
                }

                // Remember me - store preference
                if (rememberMe) {
                    localStorage.setItem('tran_remember', 'true')
                }
            } else if (mode === 'signup') {
                if (!name) throw new Error(txt.error_username)
                const { user, session } = await auth.signUp(email, password, {
                    name,
                    role: 'user',
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                })

                if (!user) throw new Error('Registration failed')

                userData = {
                    id: user.id,
                    email: user.email,
                    name: name,
                    role: 'user',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                }

                if (!session) {
                    setSuccess('Please check your email to verify your account')
                    setLoading(false)
                    return
                }
            }

            onLogin(userData)
            onClose()
        } catch (err) {
            console.error('Auth error:', err)
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthLogin = async (provider) => {
        try {
            await auth.signInWithOAuth(provider)
        } catch (err) {
            setError(err.message)
        }
    }

    const getTitle = () => {
        switch (mode) {
            case 'signup': return txt.signup_title
            case 'forgot': return txt.forgot_title
            case 'reset-sent': return txt.reset_sent_title
            default: return txt.signin_title
        }
    }

    const getSubtitle = () => {
        switch (mode) {
            case 'signup': return txt.signup_subtitle
            case 'forgot': return txt.forgot_subtitle
            case 'reset-sent': return txt.reset_sent_subtitle
            default: return txt.signin_subtitle
        }
    }

    return createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeBtn}>
                    <X size={20} />
                </button>

                <div style={styles.leftPanel}>
                    <div style={styles.brand}>
                        <div style={styles.logo}>
                            <img src="/tran-logo.png" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'contain' }} />
                        </div>
                        <span style={styles.brandName}>TranTradingLab</span>
                    </div>
                    <div style={styles.features}>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}><Shield size={16} /></div>
                            <span>{txt.features.security}</span>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}><CheckCircle size={16} /></div>
                            <span>{txt.features.realtime}</span>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}><Zap size={16} /></div>
                            <span>{txt.features.ai}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.rightPanel}>
                    {/* Back Button for forgot/reset modes */}
                    {(mode === 'forgot' || mode === 'reset-sent') && (
                        <button
                            onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
                            style={styles.backBtn}
                        >
                            <ArrowLeft size={16} />
                            <span>{txt.back_to_signin}</span>
                        </button>
                    )}

                    <div style={styles.header}>
                        <h2 style={styles.title}>{getTitle()}</h2>
                        <p style={styles.subtitle}>{getSubtitle()}</p>
                    </div>

                    {mode === 'reset-sent' ? (
                        <div style={styles.successBox}>
                            <CheckCircle size={48} color="#00ff88" />
                            <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.7)' }}>
                                {txt.email_sent}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={styles.form}>
                            {mode === 'signup' && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>{txt.username}</label>
                                    <div style={styles.inputWrapper}>
                                        <User size={16} style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            style={styles.input}
                                            placeholder={txt.username}
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{txt.email}</label>
                                <div style={styles.inputWrapper}>
                                    <Mail size={16} style={styles.inputIcon} />
                                    <input
                                        type="email"
                                        style={styles.input}
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {mode !== 'forgot' && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>{txt.password}</label>
                                    <div style={styles.inputWrapper}>
                                        <Lock size={16} style={styles.inputIcon} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            style={styles.input}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={styles.eyeBtn}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {mode === 'signin' && (
                                <div style={styles.optionsRow}>
                                    <label style={styles.checkLabel}>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={e => setRememberMe(e.target.checked)}
                                            style={styles.checkbox}
                                        />
                                        <span>{txt.remember}</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setMode('forgot'); setError(''); }}
                                        style={styles.forgotBtn}
                                    >
                                        {txt.forgot}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div style={styles.error}>
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div style={styles.success}>
                                    <CheckCircle size={14} />
                                    <span>{success}</span>
                                </div>
                            )}

                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? (
                                    <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        {mode === 'signin' ? txt.signin_btn :
                                            mode === 'signup' ? txt.signup_btn : txt.send_reset}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {(mode === 'signin' || mode === 'signup') && (
                        <>
                            <div style={styles.divider}>
                                <span>{txt.or}</span>
                            </div>

                            <div style={styles.socialLogin}>
                                <button
                                    style={styles.socialBtn}
                                    onClick={() => handleOAuthLogin('github')}
                                    title="Continue with GitHub"
                                >
                                    <Github size={18} />
                                </button>
                                <button
                                    style={styles.socialBtn}
                                    onClick={() => handleOAuthLogin('google')}
                                    title="Continue with Google"
                                >
                                    <Chrome size={18} />
                                </button>
                            </div>

                            <div style={styles.footer}>
                                <span>{mode === 'signin' ? txt.no_account : txt.has_account}</span>
                                <button
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin')
                                        setError('')
                                        setSuccess('')
                                    }}
                                    style={styles.switchBtn}
                                >
                                    {mode === 'signin' ? txt.go_signup : txt.go_signin}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
    },
    modal: {
        width: 860,
        minHeight: 520,
        background: 'linear-gradient(135deg, #0a1420 0%, #0d1117 100%)',
        borderRadius: 28,
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6), 0 0 40px rgba(0, 210, 106, 0.05)',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 10,
        zIndex: 10,
        transition: 'all 0.2s',
        display: 'flex',
    },
    leftPanel: {
        width: '42%',
        background: 'linear-gradient(135deg, #00d26a 0%, #009b4e 100%)',
        padding: 44,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        zIndex: 1,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.2)',
    },
    brandName: {
        color: '#fff',
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: '-0.5px',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        zIndex: 1,
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        color: 'rgba(255,255,255,0.95)',
        fontSize: 15,
        fontWeight: 500,
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightPanel: {
        flex: 1,
        padding: '44px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        cursor: 'pointer',
        marginBottom: 16,
        padding: 0,
    },
    header: {
        marginBottom: 28,
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: 28,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        margin: 0,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        color: 'rgba(255,255,255,0.3)',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        padding: '14px 16px 14px 46px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        color: '#fff',
        fontSize: 15,
        outline: 'none',
        transition: 'all 0.2s',
    },
    eyeBtn: {
        position: 'absolute',
        right: 14,
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
    },
    optionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -4,
    },
    checkLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
    },
    checkbox: {
        width: 16,
        height: 16,
        accentColor: '#00d26a',
    },
    forgotBtn: {
        background: 'transparent',
        border: 'none',
        color: '#00d26a',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        padding: 0,
    },
    error: {
        padding: '12px 16px',
        background: 'rgba(255, 56, 96, 0.1)',
        border: '1px solid rgba(255, 56, 96, 0.2)',
        borderRadius: 10,
        color: '#ff3860',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    success: {
        padding: '12px 16px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.2)',
        borderRadius: 10,
        color: '#00ff88',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    successBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0',
    },
    submitBtn: {
        padding: 16,
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        color: '#000',
        border: 'none',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transition: 'all 0.2s',
        boxShadow: '0 4px 20px rgba(0, 210, 106, 0.25)',
        marginTop: 4,
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        margin: '24px 0',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
    },
    socialLogin: {
        display: 'flex',
        gap: 14,
        justifyContent: 'center',
    },
    socialBtn: {
        width: 52,
        height: 52,
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    footer: {
        marginTop: 24,
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    switchBtn: {
        background: 'transparent',
        border: 'none',
        color: '#00d26a',
        fontWeight: 600,
        cursor: 'pointer',
        padding: 0,
    },
}

export default UserAuthModal
