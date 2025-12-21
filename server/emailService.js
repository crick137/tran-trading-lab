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
