import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function cleanup() {
    console.log('🧹 Starting precision cleanup...')

    // 1. List items to be deleted
    const { data, error } = await supabase
        .from('analysis')
        .select('id, title, author')
        .or('title.ilike.%AUDIO TEST%,author.eq.Audio Test Bot')

    if (error) {
        console.error('❌ Error fetching items:', error)
        return
    }

    if (!data || data.length === 0) {
        console.log('✅ No "Audio Test" items found. Clean!')
        return
    }

    console.log(`Found ${data.length} items to delete:`)
    data.forEach(item => console.log(` - [${item.id}] ${item.title} (by ${item.author})`))

    // 2. Delete them
    const ids = data.map(item => item.id)
    const { error: delError } = await supabase
        .from('analysis')
        .delete()
        .in('id', ids)

    if (delError) {
        console.error('❌ Error deleting items:', delError)
    } else {
        console.log(`✅ Successfully deleted ${ids.length} items.`)
    }
}

cleanup()
