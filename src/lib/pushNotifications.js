/**
 * Web Push 通知服务
 * 使用 OneSignal 免费服务实现浏览器推送
 * 
 * 设置步骤：
 * 1. 去 https://onesignal.com 免费注册
 * 2. 创建 Web Push 应用，获取 App ID
 * 3. 在 Vercel 环境变量中设置 VITE_ONESIGNAL_APP_ID
 */

// OneSignal App ID (需要在 Vercel 设置)
const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID

let isInitialized = false

/**
 * 初始化 OneSignal
 */
export function initPushNotifications() {
    if (typeof window === 'undefined' || isInitialized) return

    if (!ONESIGNAL_APP_ID || ONESIGNAL_APP_ID === 'YOUR_ONESIGNAL_APP_ID') {
        console.log('📢 Push notifications not configured (missing ONESIGNAL_APP_ID)')
        return
    }

    // 加载 OneSignal SDK
    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.async = true
    script.onload = () => {
        window.OneSignalDeferred = window.OneSignalDeferred || []
        window.OneSignalDeferred.push(async function (OneSignal) {
            await OneSignal.init({
                appId: ONESIGNAL_APP_ID,
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                    enable: true, // 显示浮动订阅按钮
                    size: 'medium',
                    theme: 'default',
                    position: 'bottom-left',
                    offset: {
                        bottom: '24px',
                        left: '24px'
                    },
                    prenotify: true,
                    showCredit: false,
                    text: {
                        'tip.state.unsubscribed': '뉴스 알림 구독',
                        'tip.state.subscribed': '알림 구독됨',
                        'tip.state.blocked': '알림이 차단됨',
                        'message.prenotify': '클릭하여 최신 뉴스 알림을 받으세요',
                        'message.action.subscribed': '알림 구독 완료!',
                        'message.action.resubscribed': '알림 다시 구독됨',
                        'message.action.unsubscribed': '알림 구독 취소됨'
                    },
                    colors: {
                        'circle.background': '#00ff88',
                        'circle.foreground': '#000000',
                        'badge.background': '#00d26a',
                        'badge.foreground': '#ffffff',
                        'badge.bordercolor': 'white',
                        'pulse.color': '#00ff88',
                        'dialog.button.background.hovering': '#00d26a',
                        'dialog.button.background.active': '#00ff88',
                        'dialog.button.background': '#00ff88',
                        'dialog.button.foreground': '#000000'
                    }
                },
                welcomeNotification: {
                    title: 'TRAN Trading Lab',
                    message: '환영합니다! 이제 최신 시장 분석을 실시간으로 받아볼 수 있습니다.',
                    url: 'https://trantradinglab.com'
                }
            })

            console.log('📢 OneSignal Push Notifications initialized')
            isInitialized = true
        })
    }

    document.head.appendChild(script)
}

/**
 * 发送推送通知（服务端调用）
 * 在 Cron 脚本中使用
 */
export async function sendPushNotification(title, message, url) {
    const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY

    if (!ONESIGNAL_REST_API_KEY) {
        console.log('OneSignal REST API key not configured')
        return null
    }

    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                included_segments: ['Subscribed Users'],
                headings: { en: title, ko: title },
                contents: { en: message, ko: message },
                url: url,
                chrome_web_icon: 'https://trantradinglab.com/icon-192.png'
            })
        })

        const result = await response.json()
        console.log('📢 Push notification sent:', result.id)
        return result
    } catch (e) {
        console.error('Push notification error:', e)
        return null
    }
}

/**
 * 获取推送通知权限状态
 */
export function getNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'unsupported'
    }
    return Notification.permission // 'default', 'granted', 'denied'
}

/**
 * 检查用户是否已订阅
 */
export async function isSubscribed() {
    if (!window.OneSignal) return false

    return new Promise((resolve) => {
        window.OneSignalDeferred.push(async (OneSignal) => {
            const subscribed = await OneSignal.User.PushSubscription.optedIn
            resolve(subscribed)
        })
    })
}
