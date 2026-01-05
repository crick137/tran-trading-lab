import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkLatest() {
    const { data, error } = await supabase
        .from('analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

    if (error) {
        console.error(error)
        return
    }

    const article = data[0]
    console.log('📝 Latest Article:', article.title)
    console.log('🖼️ Image URL:', article.image_url)
    console.log('🎵 Audio URL:', article.audio_url)
    console.log('Full Object keys:', Object.keys(article))
}

checkLatest()
