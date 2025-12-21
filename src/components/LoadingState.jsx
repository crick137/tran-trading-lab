/**
 * 加载状态组件
 * Loading State & Skeleton Components
 */
import React from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'

// ===== 全屏加载 =====
export function FullScreenLoader({ message = '加载中...' }) {
    return (
        <div style={styles.fullScreen}>
            <div style={styles.loaderCard}>
                <div style={styles.spinnerWrapper}>
                    <div style={styles.spinner} />
                    <div style={styles.spinnerGlow} />
                </div>
                <span style={styles.loaderText}>{message}</span>
            </div>
        </div>
    )
}

// ===== 内联加载 =====
export function InlineLoader({ size = 16, color = '#00d26a' }) {
    return (
        <Loader2
            size={size}
            style={{
                color,
                animation: 'spin 1s linear infinite'
            }}
        />
    )
}

// ===== 骨架屏 =====
export function Skeleton({ width, height, radius = 4, style = {} }) {
    return (
        <div
            style={{
                ...styles.skeleton,
                width: width || '100%',
                height: height || 16,
                borderRadius: radius,
                ...style
            }}
        />
    )
}

// ===== 文本骨架 =====
export function SkeletonText({ lines = 3, lineHeight = 16, gap = 8 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '60%' : '100%'}
                    height={lineHeight}
                />
            ))}
        </div>
    )
}

// ===== 卡片骨架 =====
export function SkeletonCard({ height = 120 }) {
    return (
        <div style={{ ...styles.skeletonCard, height }}>
            <Skeleton width={40} height={40} radius={10} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={12} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <Skeleton width={80} height={16} />
                <Skeleton width={50} height={12} />
            </div>
        </div>
    )
}

// ===== 表格骨架 =====
export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div style={styles.skeletonTable}>
            {/* 表头 */}
            <div style={styles.skeletonTableHead}>
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} width={60 + Math.random() * 40} height={12} />
                ))}
            </div>
            {/* 行 */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} style={styles.skeletonTableRow}>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            width={colIndex === 0 ? 100 : 60 + Math.random() * 30}
                            height={14}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

// ===== 图表骨架 =====
export function SkeletonChart({ height = 300 }) {
    return (
        <div style={{ ...styles.skeletonChart, height }}>
            <div style={styles.chartBars}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.chartBar,
                            height: `${30 + Math.random() * 60}%`,
                        }}
                    />
                ))}
            </div>
            <div style={styles.chartLabel}>
                <Skeleton width={60} height={10} />
            </div>
        </div>
    )
}

// ===== 市场行骨架 =====
export function SkeletonMarketRow() {
    return (
        <div style={styles.marketRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Skeleton width={32} height={32} radius={8} />
                <div>
                    <Skeleton width={50} height={14} style={{ marginBottom: 4 }} />
                    <Skeleton width={70} height={10} />
                </div>
            </div>
            <Skeleton width={80} height={16} />
            <Skeleton width={50} height={14} />
            <Skeleton width={60} height={24} radius={4} />
        </div>
    )
}

// ===== 刷新按钮 =====
export function RefreshButton({ onClick, loading = false, size = 16 }) {
    return (
        <button
            style={styles.refreshBtn}
            onClick={onClick}
            disabled={loading}
        >
            <RefreshCw
                size={size}
                style={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    opacity: loading ? 0.5 : 1
                }}
            />
        </button>
    )
}

// ===== 空状态 =====
export function EmptyState({
    icon: Icon,
    title = '暂无数据',
    description = '',
    action = null
}) {
    return (
        <div style={styles.emptyState}>
            {Icon && (
                <div style={styles.emptyIcon}>
                    <Icon size={48} />
                </div>
            )}
            <h3 style={styles.emptyTitle}>{title}</h3>
            {description && <p style={styles.emptyDesc}>{description}</p>}
            {action && <div style={styles.emptyAction}>{action}</div>}
        </div>
    )
}

const styles = {
    // 全屏加载
    fullScreen: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 4, 8, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
    },
    loaderCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
    spinnerWrapper: {
        position: 'relative',
        width: 60,
        height: 60,
    },
    spinner: {
        width: '100%',
        height: '100%',
        border: '3px solid rgba(255, 255, 255, 0.05)',
        borderTopColor: '#00d26a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    spinnerGlow: {
        position: 'absolute',
        inset: -10,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 210, 106, 0.2) 0%, transparent 70%)',
        animation: 'pulse 2s ease-in-out infinite',
    },
    loaderText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 500,
    },

    // 骨架屏
    skeleton: {
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0.03) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    },
    skeletonCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
    skeletonTable: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    skeletonTableHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '8px 8px 0 0',
    },
    skeletonTableRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.01)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    },
    skeletonChart: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 16,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
    },
    chartBars: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        flex: 1,
    },
    chartBar: {
        flex: 1,
        background: 'linear-gradient(180deg, rgba(0, 210, 106, 0.1) 0%, rgba(0, 210, 106, 0.02) 100%)',
        borderRadius: '4px 4px 0 0',
        animation: 'shimmer 1.5s infinite',
    },
    chartLabel: {
        marginTop: 12,
        textAlign: 'center',
    },
    marketRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.01)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    },

    // 刷新按钮
    refreshBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 8,
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },

    // 空状态
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
    },
    emptyIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        marginBottom: 24,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 24,
        color: 'rgba(255, 255, 255, 0.15)',
    },
    emptyTitle: {
        margin: '0 0 8px',
        fontSize: 18,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    emptyDesc: {
        margin: '0 0 24px',
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.35)',
        maxWidth: 300,
    },
    emptyAction: {},
}

// 添加动画样式
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
    `
    document.head.appendChild(styleSheet)
}

export default {
    FullScreenLoader,
    InlineLoader,
    Skeleton,
    SkeletonText,
    SkeletonCard,
    SkeletonTable,
    SkeletonChart,
    SkeletonMarketRow,
    RefreshButton,
    EmptyState,
}
