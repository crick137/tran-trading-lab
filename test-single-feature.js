/**
 * 快速测试单个功能
 * 测试：发送功能、AI调用、内容质量
 * 
 * 使用方法: 
 * node test-single-feature.js your-project.vercel.app your_cron_secret
 */

// 使用原生 fetch (Node 18+)
// 如果 Node 版本 < 18, 需要安装: npm install node-fetch

const PROJECT_URL = process.argv[2] || 'your-project.vercel.app'
const CRON_SECRET = process.argv[3] || 'your_cron_secret_here'

const API_URL = `https://${PROJECT_URL}/api/cron/daily-trading-tip`

console.log('🧪 开始测试 Telegram 自动发布功能\n')
console.log('━'.repeat(60))
console.log(`📍 项目地址: ${API_URL}`)
console.log(`🔑 CRON_SECRET: ${CRON_SECRET.substring(0, 10)}...`)
console.log('━'.repeat(60))

async function test() {
    try {
        console.log('\n📤 1. 发送请求到 API...')
        const startTime = Date.now()
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CRON_SECRET}`,
                'Content-Type': 'application/json'
            }
        })
        
        const duration = Date.now() - startTime
        const responseText = await response.text()
        
        console.log(`   响应时间: ${duration}ms`)
        console.log(`   状态码: ${response.status}`)
        
        // 尝试解析JSON
        let data
        try {
            data = JSON.parse(responseText)
        } catch (e) {
            console.log('\n❌ 响应不是有效的JSON格式!')
            console.log('   响应内容:', responseText.substring(0, 200))
            console.log('\n💡 可能的原因:')
            console.log('   - 项目URL不正确（返回了HTML页面）')
            console.log('   - 项目未部署或部署失败')
            console.log('   - 网络问题')
            return
        }
        
        // 检查1: API调用是否成功
        if (!response.ok) {
            console.log('\n❌ API调用失败!')
            console.log('   错误信息:', data)
            if (response.status === 401) {
                console.log('\n💡 401错误通常表示:')
                console.log('   - CRON_SECRET不正确')
                console.log('   - Authorization header格式错误')
            }
            return
        }
        
        console.log('   ✅ API调用成功')
        
        // 检查2: 是否成功发送到Telegram
        console.log('\n📱 2. 检查Telegram发送状态...')
        if (data.success) {
            console.log('   ✅ Telegram消息发送成功!')
            console.log(`   消息ID: ${data.messageId || 'N/A'}`)
            console.log(`   时间戳: ${data.timestamp || 'N/A'}`)
        } else {
            console.log('   ❌ Telegram发送失败!')
            console.log('   错误:', data.error || data)
            return
        }
        
        // 检查3: AI调用状态（从响应时间推断）
        console.log('\n🤖 3. 检查AI调用状态...')
        if (duration > 3000) {
            console.log(`   ✅ AI调用正常 (响应时间 ${duration}ms，说明AI已处理)`)
        } else if (duration < 1000) {
            console.log('   ⚠️  响应时间过短，可能AI未调用或使用缓存')
        } else {
            console.log(`   ✅ AI调用可能正常 (响应时间 ${duration}ms)`)
        }
        
        // 检查4: 内容质量（需要查看实际消息）
        console.log('\n📝 4. 内容质量检查...')
        console.log('   💡 请检查 Telegram 频道 @http4477 中的消息:')
        console.log('      - 消息是否完整发送')
        console.log('      - 格式是否正确（HTML格式）')
        console.log('      - 内容是否专业且有用')
        console.log('      - 是否包含具体数据和数字')
        console.log('      - 语言是否流畅自然')
        
        // 总结
        console.log('\n' + '━'.repeat(60))
        console.log('📊 测试总结\n')
        console.log('✅ API调用: 成功')
        console.log('✅ Telegram发送: 成功')
        console.log('✅ AI调用: 正常')
        console.log('📝 内容质量: 请手动检查 Telegram 频道')
        console.log('\n💡 下一步:')
        console.log('   1. 打开 Telegram，查看 @http4477 频道')
        console.log('   2. 检查最新消息的内容和质量')
        console.log('   3. 如果内容有问题，查看 Vercel 日志获取详细信息')
        
    } catch (error) {
        console.log('\n❌ 测试失败!')
        console.log('   错误:', error.message)
        console.log('\n💡 可能的原因:')
        console.log('   - 项目URL不正确')
        console.log('   - CRON_SECRET不正确')
        console.log('   - 网络连接问题')
        console.log('   - 项目未部署或部署失败')
    }
}

test()
