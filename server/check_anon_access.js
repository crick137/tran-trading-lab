import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pikvpypivivzhmoyeipd.supabase.co'
// The key found in src/lib/supabase.js
const supabaseAnonKey = 'sb_publishable_0teYfqqVf0awO-kEtpsvCg_JV0imn4T'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAnonAccess() {
    console.log('Testing Anon Key Access...')
    const { data, error } = await supabase
        .from('analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

    if (error) {
        console.error('❌ Error:', error)
        return
    }

    if (!data || data.length === 0) {
        console.log('⚠️ No data found')
        return
    }

    const article = data[0]
    console.log('📝 Title:', article.title)
    console.log('🎵 Audio URL:', article.audio_url) // Check if this is undefined
    console.log('Keys present:', Object.keys(article))
}

checkAnonAccess()
