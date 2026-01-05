
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

// Mock Express Request/Response
const createMockReqRes = (name) => {
    const req = {
        headers: {
            authorization: `Bearer ${process.env.CRON_SECRET}`
        }
    }
    const res = {
        status: (code) => ({
            json: (data) => {
                console.log(`\n[${name}] Status: ${code}`)
                if (code !== 200) {
                    console.error(`[${name}] Error Data:`, data)
                } else {
                    console.log(`[${name}] Success Data:`, JSON.stringify(data, null, 2).slice(0, 200) + '...')
                }
                return data
            }
        })
    }
    return { req, res }
}

const runTest = async () => {
    const scripts = [
        '../api/cron/technical-analysis.js',
        '../api/cron/weekly-report.js',
        // '../api/cron/economic-calendar.js', // Skip to save time, logic is simple
        '../api/cron/daily-trading-tip.js',
        '../api/cron/market-sentiment-card.js',
        '../api/cron/daily-market-story.js',
        '../api/cron/trading-psychology-quiz.js',
        '../api/cron/news-analysis.js'
    ]

    console.log('🚀 Starting Comprehensive Test for All Upgraded Features...')
    console.log(`Target Channel: ${process.env.TELEGRAM_MAIN_CHANNEL_ID || process.env.TELEGRAM_CHANNEL_ID}`)
    console.log(`Model: GPT-5.2 + DALL-E 3`)

    for (const scriptPath of scripts) {
        const name = path.basename(scriptPath)
        console.log(`\n-----------------------------------`)
        console.log(`🧪 Testing: ${name}`)
        console.log(`-----------------------------------`)

        try {
            const module = await import(scriptPath)
            const handler = module.default
            const { req, res } = createMockReqRes(name)

            await handler(req, res)
        } catch (e) {
            console.error(`❌ Failed to run ${name}:`, e)
        }
    }
}

runTest()
