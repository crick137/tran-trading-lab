/**
 * 全局通知系统
 * Global Notification System
 */
import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useAppState, useAppActions } from '../context/AppContext'

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
}

const COLORS = {
    success: { bg: 'rgba(0, 210, 106, 0.1)', border: 'rgba(0, 210, 106, 0.3)', text: '#00d26a' },
    error: { bg: 'rgba(255, 56, 96, 0.1)', border: 'rgba(255, 56, 96, 0.3)', text: '#ff3860' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
    info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
}

function NotificationItem({ notification, onDismiss }) {
    const [isExiting, setIsExiting] = useState(false)
    const { type = 'info', message, id } = notification
    const Icon = ICONS[type] || ICONS.info
    const colors = COLORS[type] || COLORS.info

    const handleDismiss = () => {
        setIsExiting(true)
        setTimeout(() => onDismiss(id), 300)
    }

    return (
        <div
            style={{
                ...styles.notification,
                background: colors.bg,
                borderColor: colors.border,
                animation: isExiting ? 'slideOut 0.3s ease forwards' : 'slideIn 0.3s ease',
            }}
        >
            <Icon size={18} style={{ color: colors.text, flexShrink: 0 }} />
            <span style={styles.message}>{message}</span>
            <button style={styles.dismiss} onClick={handleDismiss}>
                <X size={14} />
            </button>
        </div>
    )
}

export function NotificationCenter() {
    const { notifications } = useAppState()
    const { dismissNotification } = useAppActions()

    if (notifications.length === 0) return null

    return (
        <div style={styles.container}>
            {notifications.map(notif => (
                <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onDismiss={dismissNotification}
                />
            ))}
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        top: 70,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9998,
        maxWidth: 360,
    },
    notification: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.3)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    message: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 1.4,
    },
    dismiss: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: 6,
        color: 'rgba(255, 255, 255, 0.4)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
}

// Add animation keyframes
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style')
    styleEl.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `
    document.head.appendChild(styleEl)
}

export default NotificationCenter
