import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkRecent() {
    console.log('🔍 Checking latest 5 articles...')

    const { data, error } = await supabase
        .from('analysis')
        .select('id, title, author, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('❌ Error:', error)
        return
    }

    if (!data || data.length === 0) {
        console.log('✅ No articles found at all.')
        return
    }

    console.log(`Found ${data.length} recent items:`)
    data.forEach(item => {
        console.log(` - [${item.id}] ${item.title} (by ${item.author}) @ ${item.created_at}`)
    })
}

checkRecent()
