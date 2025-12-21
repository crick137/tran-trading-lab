/**
 * 命令面板组件
 * Spotlight/Raycast-style Command Palette
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
    Search, Command, LayoutDashboard, Newspaper, BarChart3,
    Globe, GraduationCap, BookOpen, Wrench, Moon, Sun,
    Bell, Settings, LogOut, User, Zap, TrendingUp,
    Home, ArrowRight, X, Globe2
} from 'lucide-react'
import { getShortcutDisplay } from '../hooks/useKeyboard'

const COMMANDS = [
    // 导航
    { id: 'nav-dashboard', label: '대시보드', labelZh: '仪表盘', icon: LayoutDashboard, category: '导航', action: 'navigate', value: 'dashboard', shortcut: '1' },
    { id: 'nav-brief', label: '실황 브리프', labelZh: '实时快讯', icon: Newspaper, category: '导航', action: 'navigate', value: 'brief', shortcut: '2' },
    { id: 'nav-analysis', label: '분석 아카이브', labelZh: '分析文章', icon: BarChart3, category: '导航', action: 'navigate', value: 'analysis', shortcut: '3' },
    { id: 'nav-news', label: '마켓 뉴스', labelZh: '市场新闻', icon: Globe, category: '导航', action: 'navigate', value: 'news', shortcut: '4' },
    { id: 'nav-lab', label: '지식 연구소', labelZh: '研究课程', icon: GraduationCap, category: '导航', action: 'navigate', value: 'lab', shortcut: '5' },
    { id: 'nav-note', label: '트레이딩 노트', labelZh: '交易笔记', icon: BookOpen, category: '导航', action: 'navigate', value: 'note', shortcut: '6' },
    { id: 'nav-tools', label: '도구', labelZh: '工具', icon: Wrench, category: '导航', action: 'navigate', value: 'tools', shortcut: '7' },

    // 交易
    { id: 'trade-btc', label: 'BTC/USDT 거래', labelZh: '交易 BTC/USDT', icon: Zap, category: '交易', action: 'trade', value: 'BTC/USDT' },
    { id: 'trade-eth', label: 'ETH/USDT 거래', labelZh: '交易 ETH/USDT', icon: Zap, category: '交易', action: 'trade', value: 'ETH/USDT' },
    { id: 'trade-sol', label: 'SOL/USDT 거래', labelZh: '交易 SOL/USDT', icon: Zap, category: '交易', action: 'trade', value: 'SOL/USDT' },

    // 快速操作
    { id: 'goto-admin', label: '관리자 페이지', labelZh: '管理后台', icon: Settings, category: '操作', action: 'url', value: '/admin' },
    { id: 'toggle-theme', label: '테마 전환', labelZh: '切换主题', icon: Moon, category: '操作', action: 'theme', shortcut: 'Ctrl+Shift+D' },
    { id: 'lang-ko', label: '한국어', labelZh: '韩语', icon: Globe2, category: '语言', action: 'language', value: 'ko' },
    { id: 'lang-zh', label: '中文', labelZh: '中文', icon: Globe2, category: '语言', action: 'language', value: 'zh' },
    { id: 'lang-en', label: 'English', labelZh: '英语', icon: Globe2, category: '语言', action: 'language', value: 'en' },
]

function CommandPalette({
    isOpen,
    onClose,
    onNavigate,
    onTrade,
    onThemeToggle,
    onLanguageChange,
    language = 'ko'
}) {
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)
    const listRef = useRef(null)

    // 过滤命令
    const filteredCommands = useMemo(() => {
        if (!query) return COMMANDS
        const q = query.toLowerCase()
        return COMMANDS.filter(cmd =>
            cmd.label.toLowerCase().includes(q) ||
            cmd.labelZh.toLowerCase().includes(q) ||
            cmd.category.toLowerCase().includes(q)
        )
    }, [query])

    // 分组命令
    const groupedCommands = useMemo(() => {
        const groups = {}
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = []
            groups[cmd.category].push(cmd)
        })
        return groups
    }, [filteredCommands])

    // 重置状态
    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    // 键盘导航
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex(i => Math.max(i - 1, 0))
                    break
                case 'Enter':
                    e.preventDefault()
                    executeCommand(filteredCommands[selectedIndex])
                    break
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, filteredCommands, selectedIndex])

    // 滚动到选中项
    useEffect(() => {
        const list = listRef.current
        const selected = list?.querySelector(`[data-index="${selectedIndex}"]`)
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' })
        }
    }, [selectedIndex])

    // 执行命令
    const executeCommand = (cmd) => {
        if (!cmd) return

        switch (cmd.action) {
            case 'navigate':
                onNavigate?.(cmd.value)
                break
            case 'trade':
                onTrade?.(cmd.value)
                break
            case 'theme':
                onThemeToggle?.()
                break
            case 'language':
                onLanguageChange?.(cmd.value)
                break
            case 'url':
                window.location.href = cmd.value
                break
        }
        onClose()
    }

    if (!isOpen) return null

    let flatIndex = 0

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.container} onClick={e => e.stopPropagation()}>
                {/* 搜索输入 */}
                <div style={styles.searchWrapper}>
                    <Command size={18} style={styles.searchIcon} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                            setSelectedIndex(0)
                        }}
                        placeholder={language === 'zh' ? '搜索命令...' : '명령 검색...'}
                        style={styles.searchInput}
                    />
                    <div style={styles.escBadge}>ESC</div>
                </div>

                {/* 命令列表 */}
                <div ref={listRef} style={styles.list}>
                    {Object.entries(groupedCommands).map(([category, commands]) => (
                        <div key={category}>
                            <div style={styles.categoryLabel}>{category}</div>
                            {commands.map((cmd) => {
                                const index = flatIndex++
                                const isSelected = index === selectedIndex
                                return (
                                    <div
                                        key={cmd.id}
                                        data-index={index}
                                        style={{
                                            ...styles.item,
                                            ...(isSelected ? styles.itemSelected : {})
                                        }}
                                        onClick={() => executeCommand(cmd)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <div style={styles.itemLeft}>
                                            <div style={{
                                                ...styles.itemIcon,
                                                ...(isSelected ? styles.itemIconSelected : {})
                                            }}>
                                                <cmd.icon size={16} />
                                            </div>
                                            <span style={styles.itemLabel}>
                                                {language === 'zh' ? cmd.labelZh : cmd.label}
                                            </span>
                                        </div>
                                        <div style={styles.itemRight}>
                                            {cmd.shortcut && (
                                                <kbd style={styles.shortcut}>{cmd.shortcut}</kbd>
                                            )}
                                            <ArrowRight size={14} style={{ opacity: isSelected ? 1 : 0 }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}

                    {filteredCommands.length === 0 && (
                        <div style={styles.noResults}>
                            {language === 'zh' ? '没有找到匹配的命令' : '일치하는 명령이 없습니다'}
                        </div>
                    )}
                </div>

                {/* 底部提示 */}
                <div style={styles.footer}>
                    <div style={styles.footerItem}>
                        <kbd style={styles.footerKey}>↑↓</kbd>
                        <span>{language === 'zh' ? '导航' : '탐색'}</span>
                    </div>
                    <div style={styles.footerItem}>
                        <kbd style={styles.footerKey}>Enter</kbd>
                        <span>{language === 'zh' ? '执行' : '실행'}</span>
                    </div>
                    <div style={styles.footerItem}>
                        <kbd style={styles.footerKey}>Esc</kbd>
                        <span>{language === 'zh' ? '关闭' : '닫기'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 100,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        animation: 'fadeIn 0.15s ease',
    },
    container: {
        width: '100%',
        maxWidth: 560,
        margin: '0 20px',
        background: 'linear-gradient(180deg, rgba(16, 24, 36, 0.98) 0%, rgba(10, 16, 28, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
        overflow: 'hidden',
        animation: 'slideUp 0.2s ease',
    },
    searchWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    },
    searchIcon: {
        color: 'rgba(255, 255, 255, 0.3)',
        flexShrink: 0,
    },
    searchInput: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: 16,
        fontWeight: 500,
        color: '#fff',
    },
    escBadge: {
        padding: '4px 8px',
        fontSize: 10,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.3)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 6,
    },
    list: {
        maxHeight: 400,
        overflowY: 'auto',
        padding: '8px',
    },
    categoryLabel: {
        padding: '8px 12px 6px',
        fontSize: 11,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.35)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.1s ease',
    },
    itemSelected: {
        background: 'rgba(0, 210, 106, 0.1)',
    },
    itemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    itemIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    itemIconSelected: {
        background: 'rgba(0, 210, 106, 0.15)',
        color: '#00d26a',
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    itemRight: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'rgba(255, 255, 255, 0.3)',
    },
    shortcut: {
        padding: '3px 6px',
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(255, 255, 255, 0.4)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
    },
    noResults: {
        padding: '40px 20px',
        textAlign: 'center',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.35)',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '12px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    footerItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.35)',
    },
    footerKey: {
        padding: '2px 5px',
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(255, 255, 255, 0.4)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
    },
}

export default CommandPalette
