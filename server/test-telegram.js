/**
 * 测试 Telegram Bot 连接
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required')
    process.exit(1)
}

async function testBot() {
    console.log('🔍 Testing Telegram Bot connection...\n')

    // 1. 获取 Bot 信息
    const meUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    const meResponse = await fetch(meUrl)
    const meData = await meResponse.json()

    if (meData.ok) {
        console.log('✅ Bot 连接成功!')
        console.log(`   Bot Name: @${meData.result.username}`)
        console.log(`   Display Name: ${meData.result.first_name}`)
    } else {
        console.log('❌ Bot 连接失败:', meData.description)
        return
    }

    // 2. 获取最近的更新（用于找到 chat_id）
    console.log('\n🔍 检查频道/群组 ID...')
    const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    const updatesResponse = await fetch(updatesUrl)
    const updatesData = await updatesResponse.json()

    if (updatesData.ok && updatesData.result.length > 0) {
        console.log('\n📋 找到以下聊天:')
        const seenChats = new Set()
        updatesData.result.forEach(update => {
            const chat = update.message?.chat || update.channel_post?.chat
            if (chat && !seenChats.has(chat.id)) {
                seenChats.add(chat.id)
                console.log(`   Chat ID: ${chat.id}`)
                console.log(`   Type: ${chat.type}`)
                console.log(`   Name: ${chat.title || chat.first_name || 'Private'}`)
                console.log('')
            }
        })

        console.log('💡 请将上面的 Chat ID 添加到配置中')
    } else {
        console.log('⚠️ 未找到聊天记录')
        console.log('💡 请按以下步骤操作:')
        console.log('   1. 创建一个 Telegram 频道或群组')
        console.log('   2. 将 @bot 添加为管理员')
        console.log('   3. 在频道/群组中发送任意消息')
        console.log('   4. 重新运行此测试')
    }
}

testBot().catch(console.error)
