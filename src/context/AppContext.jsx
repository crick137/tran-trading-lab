/**
 * 全局应用状态管理
 * Global Application State Management
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// ===== 初始状态 =====
const initialState = {
    // 主题
    theme: 'dark', // 'dark' | 'light'

    // 语言
    language: 'ko', // 'ko' | 'zh' | 'en'

    // 用户认证
    user: null,
    isAuthenticated: false,
    authLoading: true,

    // 全局通知
    notifications: [],

    // 命令面板
    commandPaletteOpen: false,

    // 侧边栏
    sidebarCollapsed: false,

    // 交易面板
    tradePanelOpen: false,
    tradePanelSymbol: null,

    // 价格提醒
    priceAlerts: [],

    // 全局加载状态
    globalLoading: false,

    // 认证弹窗
    authModalOpen: false,
}

// ===== Action Types =====
const ActionTypes = {
    SET_THEME: 'SET_THEME',
    SET_LANGUAGE: 'SET_LANGUAGE',
    SET_USER: 'SET_USER',
    SET_AUTH_LOADING: 'SET_AUTH_LOADING',
    LOGOUT: 'LOGOUT',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    TOGGLE_COMMAND_PALETTE: 'TOGGLE_COMMAND_PALETTE',
    TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
    SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
    OPEN_TRADE_PANEL: 'OPEN_TRADE_PANEL',
    CLOSE_TRADE_PANEL: 'CLOSE_TRADE_PANEL',
    ADD_PRICE_ALERT: 'ADD_PRICE_ALERT',
    REMOVE_PRICE_ALERT: 'REMOVE_PRICE_ALERT',
    SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
    SET_AUTH_MODAL: 'SET_AUTH_MODAL',
}

// ===== Reducer =====
function appReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_THEME:
            localStorage.setItem('tran_theme', action.payload)
            return { ...state, theme: action.payload }

        case ActionTypes.SET_LANGUAGE:
            localStorage.setItem('tran_language', action.payload)
            return { ...state, language: action.payload }

        case ActionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                authLoading: false
            }

        case ActionTypes.SET_AUTH_LOADING:
            return { ...state, authLoading: action.payload }

        case ActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                authLoading: false
            }

        case ActionTypes.ADD_NOTIFICATION:
            const newNotification = {
                id: Date.now(),
                ...action.payload,
                timestamp: new Date()
            }
            return {
                ...state,
                notifications: [...state.notifications, newNotification].slice(-10) // 最多10条
            }

        case ActionTypes.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            }

        case ActionTypes.TOGGLE_COMMAND_PALETTE:
            return { ...state, commandPaletteOpen: !state.commandPaletteOpen }

        case ActionTypes.TOGGLE_SIDEBAR:
            const newCollapsed = !state.sidebarCollapsed
            localStorage.setItem('tran_sidebar_collapsed', newCollapsed)
            return { ...state, sidebarCollapsed: newCollapsed }

        case ActionTypes.SET_SIDEBAR_COLLAPSED:
            localStorage.setItem('tran_sidebar_collapsed', action.payload)
            return { ...state, sidebarCollapsed: action.payload }

        case ActionTypes.OPEN_TRADE_PANEL:
            return {
                ...state,
                tradePanelOpen: true,
                tradePanelSymbol: action.payload
            }

        case ActionTypes.CLOSE_TRADE_PANEL:
            return { ...state, tradePanelOpen: false }

        case ActionTypes.ADD_PRICE_ALERT:
            const alerts = [...state.priceAlerts, action.payload]
            localStorage.setItem('tran_price_alerts', JSON.stringify(alerts))
            return { ...state, priceAlerts: alerts }

        case ActionTypes.REMOVE_PRICE_ALERT:
            const filteredAlerts = state.priceAlerts.filter(a => a.id !== action.payload)
            localStorage.setItem('tran_price_alerts', JSON.stringify(filteredAlerts))
            return { ...state, priceAlerts: filteredAlerts }

        case ActionTypes.SET_GLOBAL_LOADING:
            return { ...state, globalLoading: action.payload }

        case ActionTypes.SET_AUTH_MODAL:
            return { ...state, authModalOpen: action.payload }

        default:
            return state
    }
}

// ===== Context =====
const AppContext = createContext(null)
const AppDispatchContext = createContext(null)

// ===== Provider =====
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    // 初始化：从localStorage恢复设置
    useEffect(() => {
        const savedTheme = localStorage.getItem('tran_theme')
        if (savedTheme) {
            dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme })
        }

        const savedLanguage = localStorage.getItem('tran_language')
        if (savedLanguage) {
            dispatch({ type: ActionTypes.SET_LANGUAGE, payload: savedLanguage })
        }

        const savedSidebar = localStorage.getItem('tran_sidebar_collapsed')
        if (savedSidebar !== null) {
            dispatch({ type: ActionTypes.SET_SIDEBAR_COLLAPSED, payload: savedSidebar === 'true' })
        }

        const savedAlerts = localStorage.getItem('tran_price_alerts')
        if (savedAlerts) {
            try {
                const alerts = JSON.parse(savedAlerts)
                alerts.forEach(alert => {
                    dispatch({ type: ActionTypes.ADD_PRICE_ALERT, payload: alert })
                })
            } catch (e) {
                console.warn('Failed to parse price alerts:', e)
            }
        }

        // 标记认证加载完成（未启用Supabase Auth时）
        // 标记认证加载完成（未启用Supabase Auth时）
        const savedUser = localStorage.getItem('tran_user')
        if (savedUser) {
            try {
                dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(savedUser) })
            } catch (e) {
                console.error(e)
            }
        }
        dispatch({ type: ActionTypes.SET_AUTH_LOADING, payload: false })
    }, [])

    // 应用主题到document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme)
        if (state.theme === 'light') {
            document.body.classList.add('light-theme')
        } else {
            document.body.classList.remove('light-theme')
        }
    }, [state.theme])

    return (
        <AppContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    )
}

// ===== Hooks =====
export function useAppState() {
    const context = useContext(AppContext)
    if (context === null) {
        throw new Error('useAppState must be used within an AppProvider')
    }
    return context
}

export function useAppDispatch() {
    const context = useContext(AppDispatchContext)
    if (context === null) {
        throw new Error('useAppDispatch must be used within an AppProvider')
    }
    return context
}

// ===== 便捷Actions =====
export function useAppActions() {
    const dispatch = useAppDispatch()
    const state = useAppState()

    return {
        // 主题
        setTheme: useCallback((theme) => {
            dispatch({ type: ActionTypes.SET_THEME, payload: theme })
        }, [dispatch]),

        toggleTheme: useCallback(() => {
            dispatch({ type: ActionTypes.SET_THEME, payload: state.theme === 'dark' ? 'light' : 'dark' })
        }, [dispatch, state.theme]),

        // 语言
        setLanguage: useCallback((language) => {
            dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language })
        }, [dispatch]),

        // 通知
        notify: useCallback((message, type = 'info', duration = 3000) => {
            const id = Date.now()
            dispatch({
                type: ActionTypes.ADD_NOTIFICATION,
                payload: { id, message, type, duration }
            })
            if (duration > 0) {
                setTimeout(() => {
                    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id })
                }, duration)
            }
            return id
        }, [dispatch]),

        dismissNotification: useCallback((id) => {
            dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id })
        }, [dispatch]),

        // 命令面板
        toggleCommandPalette: useCallback(() => {
            dispatch({ type: ActionTypes.TOGGLE_COMMAND_PALETTE })
        }, [dispatch]),

        // 侧边栏
        toggleSidebar: useCallback(() => {
            dispatch({ type: ActionTypes.TOGGLE_SIDEBAR })
        }, [dispatch]),

        // 交易面板
        openTradePanel: useCallback((symbol) => {
            dispatch({ type: ActionTypes.OPEN_TRADE_PANEL, payload: symbol })
        }, [dispatch]),

        closeTradePanel: useCallback(() => {
            dispatch({ type: ActionTypes.CLOSE_TRADE_PANEL })
        }, [dispatch]),

        // 价格提醒
        addPriceAlert: useCallback((alert) => {
            dispatch({ type: ActionTypes.ADD_PRICE_ALERT, payload: { ...alert, id: Date.now() } })
        }, [dispatch]),

        removePriceAlert: useCallback((id) => {
            dispatch({ type: ActionTypes.REMOVE_PRICE_ALERT, payload: id })
        }, [dispatch]),

        // Global Loading
        setGlobalLoading: useCallback((loading) => {
            dispatch({ type: ActionTypes.SET_GLOBAL_LOADING, payload: loading })
        }, [dispatch]),

        // Auth
        setUser: useCallback((user) => {
            dispatch({ type: ActionTypes.SET_USER, payload: user })
            localStorage.setItem('tran_user', JSON.stringify(user))
        }, [dispatch]),

        logout: useCallback(() => {
            dispatch({ type: ActionTypes.LOGOUT })
            localStorage.removeItem('tran_user')
        }, [dispatch]),

        // Auth Modal
        openAuthModal: useCallback(() => {
            dispatch({ type: ActionTypes.SET_AUTH_MODAL, payload: true })
        }, [dispatch]),

        closeAuthModal: useCallback(() => {
            dispatch({ type: ActionTypes.SET_AUTH_MODAL, payload: false })
        }, [dispatch]),
    }
}

export default AppContext
