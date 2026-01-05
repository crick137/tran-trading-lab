import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function generatePodcastScript() {
    console.log('📝 Generating Test Podcast Script...')
    const systemPrompt = `You are a radio host. Write a very short (2 sentences) intro for a morning crypto show.`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Go.' }],
                temperature: 0.8
            })
        })
        const text = (await res.json()).choices?.[0]?.message?.content?.trim()
        console.log('📜 Script:', text)
        return text
    } catch (e) {
        console.error('Script Gen Error:', e)
        return null
    }
}

async function generateAudio(text) {
    console.log('🎙️ Synthesizing Audio with OpenAI TTS (Onyx)...')
    if (!text) return null
    try {
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tts-1-hd',
                input: text,
                voice: 'onyx'
            })
        })
        const buffer = await res.arrayBuffer()
        console.log('🔊 Audio generated, size:', buffer.byteLength)
        return Buffer.from(buffer)
    } catch (e) {
        console.error('TTS Error:', e)
        return null
    }
}

async function runTest() {
    try {
        // 1. Script
        const script = await generatePodcastScript()
        if (!script) throw new Error('Script generation failed')

        // 2. Audio
        const audioBuffer = await generateAudio(script)
        if (!audioBuffer) throw new Error('Audio generation failed')

        // 3. Upload
        console.log('☁️ Uploading to Supabase...')
        const filename = `audio_test_${Date.now()}.mp3`
        const { data, error } = await supabase.storage
            .from('images') // Using images bucket as configured in main script
            .upload(filename, audioBuffer, { contentType: 'audio/mpeg' })

        if (error) throw error

        const { data: publicData } = supabase.storage.from('images').getPublicUrl(filename)
        const audioUrl = publicData.publicUrl
        console.log('🔗 Audio URL:', audioUrl)

        // 4. Create DB Record
        console.log('💾 Creating Test Article...')
        const { error: dbError } = await supabase.from('analysis').insert({
            title: '🎵 AUDIO TEST: Morning Radio',
            summary: 'This is a test of the AI Podcast generation system.',
            content: `## Audio Test\n\nThis article contains an AI generated audio clip.\n\nScript:\n> ${script}\n\nListen using the player above.`,
            category: '市场分析',
            author: 'Audio Test Bot',
            read_time: '1 min',
            is_published: true,
            audio_url: audioUrl,
            // Use a reliable placeholder or the internal logo if absolute path works, but for safety use a known public image
            image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop' // A reliable Bitcoin nice image
        })

        if (dbError) throw dbError

        console.log('✅ Test Complete! Check the website.')

    } catch (e) {
        console.error('❌ Test Failed:', e)
    }
}

runTest()
