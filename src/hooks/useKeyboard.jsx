/**
 * 全局键盘快捷键系统
 * Global Keyboard Shortcuts System
 */
import { useEffect, useCallback, useRef } from 'react'

// 快捷键定义
export const SHORTCUTS = {
    // 命令面板
    COMMAND_PALETTE: { key: 'k', meta: true, description: '打开命令面板' },
    COMMAND_PALETTE_ALT: { key: 'k', ctrl: true, description: '打开命令面板' },

    // 搜索
    SEARCH: { key: '/', description: '搜索' },
    SEARCH_ALT: { key: 's', ctrl: true, description: '搜索' },

    // 关闭
    ESCAPE: { key: 'Escape', description: '关闭面板' },

    // 导航
    NAV_DASHBOARD: { key: '1', description: '大盘' },
    NAV_BRIEF: { key: '2', description: '快讯' },
    NAV_ANALYSIS: { key: '3', description: '分析' },
    NAV_NEWS: { key: '4', description: '新闻' },
    NAV_LAB: { key: '5', description: '研究所' },
    NAV_NOTE: { key: '6', description: '笔记' },
    NAV_TOOLS: { key: '7', description: '工具' },

    // 交易
    TRADE: { key: 't', description: '打开交易面板' },
    BUY: { key: 'b', description: '买入' },
    SELL: { key: 's', shift: true, description: '卖出' },

    // 视图
    TOGGLE_SIDEBAR: { key: '[', ctrl: true, description: '切换侧边栏' },
    REFRESH: { key: 'r', ctrl: true, description: '刷新' },

    // 主题
    TOGGLE_THEME: { key: 'd', ctrl: true, shift: true, description: '切换主题' },
}

// 解析快捷键字符串
function parseShortcut(shortcut) {
    const parts = []
    if (shortcut.meta) parts.push('⌘')
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    parts.push(shortcut.key.toUpperCase())
    return parts.join('+')
}

// 检查事件是否匹配快捷键
function matchesShortcut(event, shortcut) {
    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
    const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey
    const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
    const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
    const altMatch = shortcut.alt ? event.altKey : !event.altKey

    return keyMatch && metaMatch && ctrlMatch && shiftMatch && altMatch
}

/**
 * 键盘快捷键Hook
 * @param {Object} shortcuts - 快捷键到回调函数的映射
 * @param {Object} options - 配置选项
 */
export function useKeyboard(shortcuts = {}, options = {}) {
    const {
        enabled = true,
        preventDefault = true,
        ignoreInputs = true
    } = options

    const shortcutsRef = useRef(shortcuts)
    shortcutsRef.current = shortcuts

    const handleKeyDown = useCallback((event) => {
        if (!enabled) return

        // 忽略输入框中的快捷键（除了 Escape）
        if (ignoreInputs && event.key !== 'Escape') {
            const target = event.target
            if (target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                return
            }
        }

        // 检查每个定义的快捷键
        for (const [name, callback] of Object.entries(shortcutsRef.current)) {
            const shortcut = SHORTCUTS[name]
            if (shortcut && matchesShortcut(event, shortcut)) {
                if (preventDefault) {
                    event.preventDefault()
                }
                callback(event)
                return
            }
        }
    }, [enabled, preventDefault, ignoreInputs])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}

/**
 * 全局快捷键Hook（用于顶层组件）
 */
export function useGlobalKeyboard({
    onCommandPalette,
    onNavigate,
    onEscape,
    onToggleSidebar,
    onToggleTheme,
    onTrade,
    onRefresh,
    onSearch,
}) {
    useKeyboard({
        COMMAND_PALETTE: onCommandPalette,
        COMMAND_PALETTE_ALT: onCommandPalette,
        ESCAPE: onEscape,
        NAV_DASHBOARD: () => onNavigate?.('dashboard'),
        NAV_BRIEF: () => onNavigate?.('brief'),
        NAV_ANALYSIS: () => onNavigate?.('analysis'),
        NAV_NEWS: () => onNavigate?.('news'),
        NAV_LAB: () => onNavigate?.('lab'),
        NAV_NOTE: () => onNavigate?.('note'),
        NAV_TOOLS: () => onNavigate?.('tools'),
        TOGGLE_SIDEBAR: onToggleSidebar,
        TOGGLE_THEME: onToggleTheme,
        TRADE: onTrade,
        REFRESH: onRefresh,
        SEARCH: onSearch,
    })
}

/**
 * 获取快捷键显示文本
 */
export function getShortcutDisplay(name) {
    const shortcut = SHORTCUTS[name]
    if (!shortcut) return ''
    return parseShortcut(shortcut)
}

/**
 * 快捷键标签组件
 */
export function ShortcutBadge({ name, style = {} }) {
    const display = getShortcutDisplay(name)
    if (!display) return null

    return (
        <kbd style={{ ...kbdStyle, ...style }}>
            {display}
        </kbd>
    )
}

const kbdStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    padding: '2px 6px',
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
}

export default useKeyboard
