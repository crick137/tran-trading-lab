// 健康检查 API
// Vercel Serverless Function

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        platform: 'vercel'
    })
}
