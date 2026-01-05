/**
 * 环境变量验证工具
 */

export function validateRequiredEnv(envVars) {
    const missing = []
    
    for (const key of envVars) {
        if (!process.env[key]) {
            missing.push(key)
        }
    }
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}

export function getEnvOrThrow(key, defaultValue = null) {
    const value = process.env[key] || defaultValue
    if (value === null || value === undefined) {
        throw new Error(`Environment variable ${key} is required`)
    }
    return value
}
