/**
 * 调试 Telegram Bot 发送问题
 */

const TELEGRAM_BOT_TOKEN = '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8'
const CHANNEL_ID = '@TranTradingLabNews'

async function debug() {
    console.log('🔍 调试 Telegram Bot...\n')

    // 1. 验证 Bot
    console.log('1️⃣ 验证 Bot Token...')
    const meUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    const meRes = await fetch(meUrl)
    const meData = await meRes.json()

    if (meData.ok) {
        console.log(`   ✅ Bot 有效: @${meData.result.username}`)
    } else {
        console.log('   ❌ Bot Token 无效:', meData.description)
        return
    }

    // 2. 测试发送消息
    console.log('\n2️⃣ 测试发送消息到频道...')
    const sendUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const testMessage = `🧪 테스트 메시지

TRAN Trading Lab 자동 발행 시스템 테스트입니다.
시간: ${new Date().toLocaleString('ko-KR')}

#테스트 #TranTradingLab`

    const sendRes = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHANNEL_ID,
            text: testMessage,
            parse_mode: 'HTML'
        })
    })

    const sendData = await sendRes.json()

    if (sendData.ok) {
        console.log('   ✅ 消息发送成功!')
        console.log('   Message ID:', sendData.result.message_id)
    } else {
        console.log('   ❌ 发送失败!')
        console.log('   Error Code:', sendData.error_code)
        console.log('   Description:', sendData.description)

        if (sendData.error_code === 403) {
            console.log('\n💡 解决方案:')
            console.log('   Bot 没有权限发送消息到频道')
            console.log('   请在 Telegram 中:')
            console.log('   1. 打开频道 @TranTradingLabNews')
            console.log('   2. 点击频道名称 → 编辑')
            console.log('   3. 管理员 → 添加管理员')
            console.log('   4. 搜索你的 Bot 并添加')
            console.log('   5. 给予 "发送消息" 权限')
        }
    }
}

debug().catch(console.error)
