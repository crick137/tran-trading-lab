
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Ensure env vars are loaded if running locally
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pikvpypivivzhmoyeipd.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize transparently - if key is missing, database ops will fail (handled in logic)
export const supabase = SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null

export const TABLES = {
    ANALYSIS: 'analysis',
    NEWS: 'news'
}

/**
 * Uploads a DALL-E image URL to Supabase Storage to make it permanent.
 * @param {string} imageUrl - The temporary DALL-E URL
 * @param {string} folder - Folder in bucket (default 'ai-generated')
 * @returns {Promise<string|null>} - The permanent Supabase Public URL
 */
export async function uploadImageFromUrl(imageUrl, folder = 'ai-generated') {
    if (!supabase) {
        console.error('Supabase not initialized (Missing Service Key)')
        return null
    }

    try {
        // 1. Download image
        const res = await fetch(imageUrl)
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`)
        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 2. Generate filename
        const timestamp = Date.now()
        const filename = `${folder}/${timestamp}_${Math.random().toString(36).substring(7)}.png`

        // 3. Upload
        const { data, error } = await supabase.storage
            .from('images') // Bucket name from src/lib/supabase.js
            .upload(filename, buffer, {
                contentType: 'image/png',
                upsert: false
            })

        if (error) {
            console.error('Supabase Upload Error:', error)
            return null
        }

        // 4. Get Public URL
        const { data: publicData } = supabase.storage
            .from('images')
            .getPublicUrl(data.path)

        return publicData.publicUrl
    } catch (e) {
        console.error('Image Persist Error:', e.message)
        return null
    }
}

/**
 * Create a new post in the Analysis table
 */
export async function createAnalysisPost({ title, summary, content, category, author, imageUrl, audioUrl, readTime = '5min' }) {
    if (!supabase) return { error: 'No Supabase connection (Service Key missing)' }

    const { data, error } = await supabase
        .from(TABLES.ANALYSIS)
        .insert({
            title,
            summary,
            content, // Markdown
            category,
            author, // Persona Name
            image_url: imageUrl,
            audio_url: audioUrl,
            read_time: readTime,
            is_published: true,
            is_featured: false,
            created_at: new Date().toISOString()
        })
        .select()
        .single()

    return { data, error }
}
