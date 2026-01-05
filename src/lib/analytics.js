import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Google Analytics 4 追踪器
 * 自动追踪页面访问和自定义事件
 */

// 你的 GA4 Measurement ID (需要在 Vercel 环境变量中设置)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// 初始化 GA4
export function initGA() {
    if (typeof window === 'undefined') return

    // 加载 gtag.js
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    // 初始化 dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
        window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
    })

    console.log('📊 Google Analytics initialized')
}

// 页面浏览追踪
export function trackPageView(path) {
    if (typeof window === 'undefined' || !window.gtag) return
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
    })
}

// 自定义事件追踪
export function trackEvent(action, category, label, value) {
    if (typeof window === 'undefined' || !window.gtag) return
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}

// 常用事件快捷方法
export const analytics = {
    // 文章阅读
    articleView: (articleId, title) => trackEvent('view_article', 'content', title, articleId),

    // 点赞
    like: (articleId) => trackEvent('like', 'engagement', 'article', articleId),

    // 分享
    share: (platform, url) => trackEvent('share', 'social', platform, url),

    // 订阅邮件
    subscribe: (email) => trackEvent('subscribe', 'conversion', 'email'),

    // 工具使用
    toolUse: (toolName) => trackEvent('use_tool', 'engagement', toolName),

    // 会员购买
    purchase: (planName, amount) => trackEvent('purchase', 'conversion', planName, amount),
}

/**
 * useAnalytics Hook - 自动追踪页面访问
 */
export function useAnalytics() {
    const location = useLocation()

    useEffect(() => {
        trackPageView(location.pathname)
    }, [location])

    return { trackEvent, analytics }
}
