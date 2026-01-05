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
    console.log('🧹 Starting cleanup of test analysis data...')

    // 1. Delete "Test Runner" items (The one on the right in screenshot)
    const { count: count1, error: err1 } = await supabase
        .from('analysis')
        .delete({ count: 'exact' })
        .eq('author', 'Test Runner')

    if (err1) console.error('Error deleting Test Runner items:', err1.message)
    else console.log(`Deleted ${count1} items by author 'Test Runner'.`)

    // 2. Delete items with "TEST" in title (Redundant but safe)
    const { count: count2, error: err2 } = await supabase
        .from('analysis')
        .delete({ count: 'exact' })
        .ilike('title', '%TEST:%')

    if (err2) console.error('Error deleting TEST title items:', err2.message)
    else console.log(`Deleted ${count2} items containing 'TEST:'.`)

    // 3. Delete the specific "Premium Morning Report" test (The one on the left in screenshot)
    // "TRAN Trading Lab — 프리미엄 모닝 리포트"
    const { count: count3, error: err3 } = await supabase
        .from('analysis')
        .delete({ count: 'exact' })
        .ilike('title', '%TRAN Trading Lab — 프리미엄 모닝 리포트%')

    if (err3) console.error('Error deleting Premium Report items:', err3.message)
    else console.log(`Deleted ${count3} items matching 'TRAN Trading Lab — 프리미엄 모닝 리포트'.`)

    console.log('✅ Cleanup complete.')
}

cleanup()
