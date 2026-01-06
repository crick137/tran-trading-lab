import React, { useState } from 'react'
import { Share2, Twitter, Send, MessageCircle, Link2, Check, X } from 'lucide-react'

/**
 * ShareButtons - 社交媒体分享组件
 * 支持: Twitter/X, Telegram, WhatsApp, 复制链接
 */
function ShareButtons({ title, url, compact = false }) {
    const [copied, setCopied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const shareUrl = url || window.location.href
    const shareTitle = title || document.title

    const platforms = [
        {
            name: 'Twitter',
            icon: Twitter,
            color: '#1DA1F2',
            getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Telegram',
            icon: Send,
            color: '#0088cc',
            getUrl: () => `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: '#25D366',
            getUrl: () => `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
        }
    ]

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleShare = (platform) => {
        window.open(platform.getUrl(), '_blank', 'width=600,height=400')
        setShowMenu(false)
    }

    // Native Web Share API (if available)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, url: shareUrl })
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Share failed:', err)
            }
        } else {
            setShowMenu(!showMenu)
        }
    }

    if (compact) {
        return (
            <div style={styles.compactContainer}>
                <button onClick={handleNativeShare} style={styles.compactBtn} title="Share">
                    <Share2 size={18} />
                </button>
                {showMenu && (
                    <div style={styles.dropdown}>
                        <button onClick={() => setShowMenu(false)} style={styles.closeBtn}>
                            <X size={14} />
                        </button>
                        {platforms.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => handleShare(p)}
                                style={{ ...styles.dropdownItem, '--hover-color': p.color }}
                            >
                                <p.icon size={16} style={{ color: p.color }} />
                                <span>{p.name}</span>
                            </button>
                        ))}
                        <button onClick={copyLink} style={styles.dropdownItem}>
                            {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Link2 size={16} />}
                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <span style={styles.label}>Share:</span>
            <div style={styles.buttons}>
                {platforms.map((p) => (
                    <button
                        key={p.name}
                        onClick={() => handleShare(p)}
                        style={{ ...styles.iconBtn, background: `${p.color}15`, color: p.color }}
                        title={p.name}
                    >
                        <p.icon size={18} />
                    </button>
                ))}
                <button
                    onClick={copyLink}
                    style={{ ...styles.iconBtn, background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)' }}
                    title="Copy link"
                >
                    {copied ? <Check size={18} style={{ color: '#10b981' }} /> : <Link2 size={18} />}
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: 500,
    },
    buttons: {
        display: 'flex',
        gap: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    compactContainer: {
        position: 'relative',
    },
    compactBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: 'transparent',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        background: '#1a1a2e',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: 12,
        padding: 8,
        minWidth: 160,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },
    dropdownItem: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        color: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontSize: 14,
        transition: 'all 0.2s ease',
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
}

export default ShareButtons
