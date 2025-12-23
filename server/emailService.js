/**
 * Email Service for TRAN Trading Lab
 * Uses Nodemailer with Gmail SMTP
 */

import nodemailer from 'nodemailer'

// 邮件配置
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'izuowangdaozi@gmail.com',
        pass: process.env.SMTP_PASS || '' // App password required for Gmail
    }
}

// 创建邮件传输器
const createTransporter = () => {
    return nodemailer.createTransport(EMAIL_CONFIG)
}

// 邮件模板
const emailTemplates = {
    // 欢迎邮件
    welcome: (name, lang = 'ko') => {
        const content = {
            ko: {
                subject: 'TRAN Trading Lab에 오신 것을 환영합니다! 🎉',
                html: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 40px; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <h1 style="color: #00ff88; margin: 0;">TRAN Trading Lab</h1>
                            <p style="color: rgba(255,255,255,0.6); margin-top: 8px;">Professional Crypto Trading Platform</p>
                        </div>
                        <h2 style="color: #fff; margin-bottom: 16px;">안녕하세요, ${name}님! 👋</h2>
                        <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                            TRAN Trading Lab에 가입해 주셔서 감사합니다. 이제 실시간 시장 데이터, AI 분석, 
                            거래 시뮬레이션 등 모든 기능을 이용하실 수 있습니다.
                        </p>
                        <div style="background: rgba(0, 210, 106, 0.1); border: 1px solid rgba(0, 210, 106, 0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
                            <h3 style="color: #00ff88; margin: 0 0 12px;">시작하기</h3>
                            <ul style="color: rgba(255,255,255,0.8); padding-left: 20px; margin: 0;">
                                <li>대시보드에서 실시간 시장 확인</li>
                                <li>AI 어시스턴트에게 분석 요청</li>
                                <li>거래 시뮬레이터로 연습</li>
                            </ul>
                        </div>
                        <a href="${process.env.APP_URL || 'http://localhost:5173'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #00d26a, #00ff88); color: #000; 
                                  padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                            지금 시작하기 →
                        </a>
                        <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 40px; text-align: center;">
                            © 2024 TRAN Trading Lab. All rights reserved.
                        </p>
                    </div>
                `
            },
            zh: {
                subject: '欢迎来到 TRAN Trading Lab! 🎉',
                html: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 40px; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <h1 style="color: #00ff88; margin: 0;">TRAN Trading Lab</h1>
                        </div>
                        <h2 style="color: #fff;">您好, ${name}! 👋</h2>
                        <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                            感谢您注册 TRAN Trading Lab。现在您可以使用实时市场数据、AI分析、交易模拟等所有功能。
                        </p>
                        <a href="${process.env.APP_URL || 'http://localhost:5173'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #00d26a, #00ff88); color: #000; 
                                  padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                            立即开始 →
                        </a>
                    </div>
                `
            },
            en: {
                subject: 'Welcome to TRAN Trading Lab! 🎉',
                html: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 40px; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <h1 style="color: #00ff88; margin: 0;">TRAN Trading Lab</h1>
                        </div>
                        <h2 style="color: #fff;">Hello, ${name}! 👋</h2>
                        <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                            Thank you for joining TRAN Trading Lab. You now have access to real-time market data, AI analytics, trading simulation, and more.
                        </p>
                        <a href="${process.env.APP_URL || 'http://localhost:5173'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #00d26a, #00ff88); color: #000; 
                                  padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                            Get Started →
                        </a>
                    </div>
                `
            }
        }
        return content[lang] || content.en
    },

    // 通知邮件
    notification: (title, message, lang = 'ko') => {
        return {
            subject: `[TRAN] ${title}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 40px; border-radius: 16px;">
                    <h1 style="color: #00ff88; margin: 0 0 24px;">📢 ${title}</h1>
                    <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">${message}</p>
                    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 40px;">
                        — TRAN Trading Lab Team
                    </p>
                </div>
            `
        }
    },

    // 订阅确认邮件
    confirmSubscription: (name, unsubscribeUrl, lang = 'ko') => {
        const content = {
            ko: {
                subject: '🎉 TRAN Trading Lab 구독을 환영합니다!',
                greeting: `안녕하세요, ${name}님!`,
                message: 'TRAN Trading Lab 뉴스레터를 구독해 주셔서 감사합니다. 이제 최신 암호화폐 분석, 시장 동향, 거래 팁을 받으실 수 있습니다.',
                benefits: ['실시간 시장 분석', 'AI 매매 신호', '독점 거래 전략'],
                unsubscribe: '구독을 취소하려면'
            },
            zh: {
                subject: '🎉 欢迎订阅 TRAN Trading Lab!',
                greeting: `您好，${name}！`,
                message: '感谢您订阅 TRAN Trading Lab 邮件通知。您将收到最新的加密货币分析、市场动态和交易技巧。',
                benefits: ['实时市场分析', 'AI 交易信号', '独家交易策略'],
                unsubscribe: '如需退订，请点击'
            },
            en: {
                subject: '🎉 Welcome to TRAN Trading Lab Newsletter!',
                greeting: `Hello, ${name}!`,
                message: 'Thank you for subscribing to TRAN Trading Lab newsletter. You will receive the latest crypto analysis, market trends, and trading tips.',
                benefits: ['Real-time market analysis', 'AI trading signals', 'Exclusive trading strategies'],
                unsubscribe: 'To unsubscribe, click'
            }
        }
        const t = content[lang] || content.en
        return {
            subject: t.subject,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0d1117 0%, #161b22 100%); color: #fff; padding: 48px; border-radius: 20px; border: 1px solid rgba(0,210,106,0.2);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #00d26a, #00ff88); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">✓</div>
                        <h1 style="color: #00ff88; margin: 0; font-size: 28px;">TRAN Trading Lab</h1>
                    </div>
                    <h2 style="color: #fff; margin: 0 0 16px; font-size: 22px;">${t.greeting}</h2>
                    <p style="color: rgba(255,255,255,0.8); line-height: 1.7; font-size: 15px;">${t.message}</p>
                    <div style="background: rgba(0, 210, 106, 0.1); border: 1px solid rgba(0, 210, 106, 0.2); border-radius: 14px; padding: 24px; margin: 28px 0;">
                        <ul style="color: rgba(255,255,255,0.9); margin: 0; padding: 0 0 0 20px; line-height: 2;">
                            ${t.benefits.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>
                    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 36px; text-align: center;">
                        ${t.unsubscribe}: <a href="${unsubscribeUrl}" style="color: rgba(255,255,255,0.5);">here</a>
                    </p>
                </div>
            `
        }
    },

    // 内容更新邮件
    contentUpdate: (title, content, unsubscribeUrl, lang = 'ko') => {
        const labels = {
            ko: { readMore: '자세히 보기', unsubscribe: '구독 취소' },
            zh: { readMore: '阅读更多', unsubscribe: '退订' },
            en: { readMore: 'Read More', unsubscribe: 'Unsubscribe' }
        }
        const t = labels[lang] || labels.en
        return {
            subject: `📈 [TRAN] ${title}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0d1117 0%, #161b22 100%); color: #fff; padding: 48px; border-radius: 20px; border: 1px solid rgba(0,212,255,0.2);">
                    <div style="text-align: center; margin-bottom: 28px;">
                        <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">TRAN Trading Lab</h1>
                        <p style="color: rgba(255,255,255,0.4); margin: 8px 0 0; font-size: 12px;">Newsletter Update</p>
                    </div>
                    <div style="background: rgba(0, 212, 255, 0.05); border-left: 4px solid #00d4ff; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
                        <h2 style="color: #fff; margin: 0 0 8px; font-size: 20px;">${title}</h2>
                    </div>
                    <div style="color: rgba(255,255,255,0.85); line-height: 1.8; font-size: 15px; white-space: pre-wrap;">${content}</div>
                    <a href="${process.env.APP_URL || 'https://www.trantradinglab.com'}" 
                       style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0099cc); color: #000; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 28px;">
                        ${t.readMore} →
                    </a>
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center;">
                        <a href="${unsubscribeUrl}" style="color: rgba(255,255,255,0.4); font-size: 12px; text-decoration: none;">${t.unsubscribe}</a>
                    </div>
                </div>
            `
        }
    },

    // 退订确认邮件
    unsubscribeConfirm: (lang = 'ko') => {
        const content = {
            ko: {
                subject: 'TRAN Trading Lab 구독이 취소되었습니다',
                title: '구독이 취소되었습니다',
                message: '더 이상 TRAN Trading Lab의 뉴스레터를 받지 않으실 것입니다. 다시 구독하시려면 웹사이트를 방문해 주세요.',
                resubscribe: '다시 구독하기'
            },
            zh: {
                subject: '您已退订 TRAN Trading Lab',
                title: '退订成功',
                message: '您将不再收到 TRAN Trading Lab 的邮件通知。如需重新订阅，请访问我们的网站。',
                resubscribe: '重新订阅'
            },
            en: {
                subject: 'You have unsubscribed from TRAN Trading Lab',
                title: 'Unsubscribed Successfully',
                message: 'You will no longer receive newsletters from TRAN Trading Lab. To re-subscribe, please visit our website.',
                resubscribe: 'Re-subscribe'
            }
        }
        const t = content[lang] || content.en
        return {
            subject: t.subject,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #fff; padding: 48px; border-radius: 20px; text-align: center;">
                    <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(255,255,255,0.05); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">👋</div>
                    <h1 style="color: #fff; margin: 0 0 16px; font-size: 24px;">${t.title}</h1>
                    <p style="color: rgba(255,255,255,0.6); line-height: 1.6; font-size: 15px; margin-bottom: 28px;">${t.message}</p>
                    <a href="${process.env.APP_URL || 'https://www.trantradinglab.com'}" 
                       style="display: inline-block; background: rgba(255,255,255,0.1); color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px;">
                        ${t.resubscribe}
                    </a>
                </div>
            `
        }
    }
}

// 发送邮件
export async function sendEmail(to, template, data = {}) {
    try {
        const transporter = createTransporter()

        let emailContent
        if (typeof template === 'string') {
            // 使用预定义模板
            const templateFn = emailTemplates[template]
            if (templateFn) {
                emailContent = templateFn(data.name || 'User', data.lang || 'ko')
            } else {
                throw new Error(`Template "${template}" not found`)
            }
        } else {
            // 自定义内容
            emailContent = template
        }

        const mailOptions = {
            from: `"TRAN Trading Lab" <${EMAIL_CONFIG.auth.user}>`,
            to,
            subject: emailContent.subject,
            html: emailContent.html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('📧 Email sent:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('❌ Email send error:', error.message)
        return { success: false, error: error.message }
    }
}

// 发送测试邮件
export async function sendTestEmail(to) {
    return sendEmail(to, {
        subject: 'TRAN Trading Lab - Test Email',
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #00d26a;">✅ Email Configuration Works!</h2>
                <p>This is a test email from TRAN Trading Lab.</p>
                <p>Time: ${new Date().toISOString()}</p>
            </div>
        `
    })
}

// 验证邮件配置
export async function verifyEmailConfig() {
    try {
        const transporter = createTransporter()
        await transporter.verify()
        console.log('✅ Email configuration verified')
        return { success: true }
    } catch (error) {
        console.error('❌ Email configuration error:', error.message)
        return { success: false, error: error.message }
    }
}

export { emailTemplates }
