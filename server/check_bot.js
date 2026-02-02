const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNELS = ['@TranTradingLabKR', '@TranTradingLab', '@TranTradingLabNews']

if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required')
    process.exit(1)
}

async function diagnose() {
    console.log('🔍 正在诊断频道信息...');

    for (const channel of CHANNELS) {
        try {
            console.log(`\n👉 检查: ${channel}`);
            const chatRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${channel}`);
            const chat = await chatRes.json();

            if (chat.ok) {
                console.log(`   ✅ 名称: "${chat.result.title}"`);
                console.log(`   🆔 ID: ${chat.result.id}`);
                console.log(`   📝 类型: ${chat.result.type}`);
            } else {
                console.log(`   ❌ 无法访问: ${chat.description}`);
            }
        } catch (e) {
            console.error(`   ❌ 网络错误: ${e.message}`);
        }
    }
}

diagnose();
