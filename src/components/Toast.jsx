import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// Toast Context
const ToastContext = createContext(null)

export function useToast() {
    return useContext(ToastContext)
}

// Toast Types
const TOAST_TYPES = {
    success: { icon: CheckCircle, color: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)' },
    error: { icon: XCircle, color: '#ff4466', bg: 'rgba(255, 68, 102, 0.1)' },
    warning: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    info: { icon: Info, color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)' },
}

// Toast Item
function ToastItem({ toast, onRemove }) {
    const [isExiting, setIsExiting] = useState(false)
    const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info
    const Icon = config.icon

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => onRemove(toast.id), 300)
        }, toast.duration || 3000)

        return () => clearTimeout(timer)
    }, [toast, onRemove])

    return (
        <div
            style={{
                ...styles.toast,
                background: config.bg,
                borderColor: config.color,
                animation: isExiting
                    ? 'notification-slide-out 0.3s ease forwards'
                    : 'notification-slide-in 0.4s ease'
            }}
        >
            <Icon size={18} style={{ color: config.color, flexShrink: 0 }} />
            <div style={styles.toastContent}>
                {toast.title && <div style={styles.toastTitle}>{toast.title}</div>}
                <div style={styles.toastMessage}>{toast.message}</div>
            </div>
            <button style={styles.closeBtn} onClick={() => {
                setIsExiting(true)
                setTimeout(() => onRemove(toast.id), 300)
            }}>
                <X size={14} />
            </button>
        </div>
    )
}

// Toast Container
export function ToastContainer({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((toast) => {
        const id = Date.now()
        setToasts(prev => [...prev, { ...toast, id }])
        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    // 快捷方法
    const success = useCallback((message, title) => addToast({ type: 'success', message, title }), [addToast])
    const error = useCallback((message, title) => addToast({ type: 'error', message, title }), [addToast])
    const warning = useCallback((message, title) => addToast({ type: 'warning', message, title }), [addToast])
    const info = useCallback((message, title) => addToast({ type: 'info', message, title }), [addToast])

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}
            <div style={styles.container}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

const styles = {
    container: {
        position: 'fixed',
        top: 80,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 2000,
        pointerEvents: 'none',
    },
    toast: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        minWidth: 300,
        maxWidth: 400,
        background: 'rgba(15, 25, 35, 0.95)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'auto',
    },
    toastContent: {
        flex: 1,
        minWidth: 0,
    },
    toastTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 4,
    },
    toastMessage: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 1.5,
    },
    closeBtn: {
        padding: 4,
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.4)',
        cursor: 'pointer',
        flexShrink: 0,
    },
}

export default ToastContainer
