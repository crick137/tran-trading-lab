/**
 * 错误边界组件
 * Graceful Error Handling Component
 */
import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })

        // 可以在这里上报错误到监控服务
        console.error('ErrorBoundary caught:', error, errorInfo)

        // 发送到分析服务（如果有）
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message,
                fatal: true
            })
        }
    }

    handleReload = () => {
        window.location.reload()
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    toggleDetails = () => {
        this.setState(prev => ({ showDetails: !prev.showDetails }))
    }

    render() {
        if (this.state.hasError) {
            // 自定义错误UI
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleReload)
            }

            return (
                <div style={styles.container}>
                    {/* 背景装饰 */}
                    <div style={styles.bgGlow1} />
                    <div style={styles.bgGlow2} />

                    <div style={styles.card}>
                        {/* 图标 */}
                        <div style={styles.iconWrapper}>
                            <AlertTriangle size={48} />
                        </div>

                        {/* 标题 */}
                        <h1 style={styles.title}>出现了一些问题</h1>
                        <p style={styles.subtitle}>
                            应用遇到了意外错误。请尝试刷新页面或返回主页。
                        </p>

                        {/* 操作按钮 */}
                        <div style={styles.actions}>
                            <button style={styles.primaryBtn} onClick={this.handleReload}>
                                <RefreshCw size={16} />
                                <span>刷新页面</span>
                            </button>
                            <button style={styles.secondaryBtn} onClick={this.handleGoHome}>
                                <Home size={16} />
                                <span>返回主页</span>
                            </button>
                        </div>

                        {/* 错误详情 */}
                        <button style={styles.detailsToggle} onClick={this.toggleDetails}>
                            <Bug size={14} />
                            <span>{this.state.showDetails ? '隐藏' : '显示'}错误详情</span>
                        </button>

                        {this.state.showDetails && (
                            <div style={styles.errorDetails}>
                                <div style={styles.errorMessage}>
                                    <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
                                </div>
                                {this.state.errorInfo && (
                                    <pre style={styles.stackTrace}>
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

const styles = {
    container: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020408 0%, #0a1420 100%)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: 'hidden',
        zIndex: 9999,
    },
    bgGlow1: {
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(255, 56, 96, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
    },
    bgGlow2: {
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
    },
    card: {
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        margin: '0 20px',
        padding: '48px 40px',
        background: 'rgba(10, 20, 32, 0.95)',
        border: '1px solid rgba(255, 56, 96, 0.2)',
        borderRadius: 24,
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    iconWrapper: {
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 28px',
        background: 'linear-gradient(135deg, rgba(255, 56, 96, 0.2) 0%, rgba(255, 100, 130, 0.1) 100%)',
        borderRadius: 28,
        color: '#ff3860',
    },
    title: {
        margin: '0 0 12px',
        fontSize: 28,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        margin: '0 0 32px',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: 1.6,
    },
    actions: {
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginBottom: 24,
    },
    primaryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        color: '#000',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    secondaryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 24px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    detailsToggle: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: 'transparent',
        border: 'none',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        cursor: 'pointer',
    },
    errorDetails: {
        marginTop: 16,
        padding: 16,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        textAlign: 'left',
    },
    errorMessage: {
        marginBottom: 12,
        fontSize: 12,
        color: '#ff3860',
        wordBreak: 'break-word',
    },
    stackTrace: {
        margin: 0,
        padding: 12,
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(255, 255, 255, 0.5)',
        overflow: 'auto',
        maxHeight: 200,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
}

export default ErrorBoundary
