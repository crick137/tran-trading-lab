/**
 * 测试所有 Telegram 自动发布功能
 * 使用方法: node test-telegram-features.js
 */

import fetch from 'node-fetch'

const CRON_SECRET = process.env.CRON_SECRET || 'your_cron_secret_here'
const BASE_URL = process.env.VERCEL_URL || process.argv[2] || 'your-project.vercel.app'

// 如果是在本地，需要设置正确的URL
const API_BASE = BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL}`

const FEATURES = [
    {
        name: '每日交易小贴士',
        path: '/api/cron/daily-trading-tip',
        description: '测试交易小贴士生成和发送'
    },
    {
        name: '新闻深度解读',
        path: '/api/cron/news-analysis',
        description: '测试新闻分析和发送'
    },
    {
        name: '市场情绪卡片',
        path: '/api/cron/market-sentiment-card',
        description: '测试市场情绪卡片生成'
    },
    {
        name: '市场故事',
        path: '/api/cron/daily-market-story',
        description: '测试市场故事生成'
    },
    {
        name: '交易心理测试',
        path: '/api/cron/trading-psychology-quiz',
        description: '测试心理测试生成'
    },
    {
        name: '价格警报',
        path: '/api/cron/price-alerts',
        description: '测试价格警报功能'
    },
    {
        name: '鲸鱼警报',
        path: '/api/cron/whale-alerts',
        description: '测试鲸鱼警报功能'
    }
]

async function testFeature(feature) {
    console.log(`\n🧪 测试: ${feature.name}`)
    console.log(`   ${feature.description}`)
    console.log(`   URL: ${API_BASE}${feature.path}`)
    
    try {
        const startTime = Date.now()
        
        const response = await fetch(`${API_BASE}${feature.path}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CRON_SECRET}`,
                'Content-Type': 'application/json'
            }
        })
        
        const duration = Date.now() - startTime
        const data = await response.json()
        
        if (response.ok) {
            console.log(`   ✅ 成功! (${duration}ms)`)
            console.log(`   📊 响应:`, JSON.stringify(data, null, 2))
            return { success: true, data, duration }
        } else {
            console.log(`   ❌ 失败! (${response.status})`)
            console.log(`   📊 错误:`, data)
            return { success: false, error: data, duration }
        }
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`)
        return { success: false, error: error.message }
    }
}

async function runTests() {
    console.log('🚀 开始测试 Telegram 自动发布功能\n')
    console.log(`📍 API 地址: ${API_BASE}`)
    console.log(`🔑 CRON_SECRET: ${CRON_SECRET.substring(0, 10)}...`)
    console.log('━'.repeat(60))
    
    const results = []
    
    for (const feature of FEATURES) {
        const result = await testFeature(feature)
        results.push({ feature: feature.name, ...result })
        
        // 等待1秒再测试下一个，避免API限流
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // 总结
    console.log('\n' + '━'.repeat(60))
    console.log('📊 测试总结\n')
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    console.log(`✅ 成功: ${successCount}/${results.length}`)
    console.log(`❌ 失败: ${failCount}/${results.length}`)
    
    if (failCount > 0) {
        console.log('\n失败的测试:')
        results.filter(r => !r.success).forEach(r => {
            console.log(`  - ${r.feature}`)
        })
    }
    
    console.log('\n💡 提示:')
    console.log('  - 检查 Telegram 频道是否收到消息')
    console.log('  - 查看 Vercel 日志获取详细错误信息')
    console.log('  - 确认所有环境变量已正确配置')
}

// 运行测试
runTests().catch(console.error)
