/**
 * TRAN Trading Lab - Telegram Utilities
 * 공유 유틸리티: 시간대, 제한, 중복 방지, 포맷
 * 
 * CRITICAL: All timezone operations use Asia/Seoul explicitly
 */

import { kv } from '@vercel/kv';

// ============================================
// TIMEZONE UTILITIES (Asia/Seoul ONLY)
// ============================================

/**
 * Get current KST date key for rate limiting (YYYY-MM-DD)
 * CRITICAL: Uses timezone offset, not toLocaleString to avoid server locale issues
 */
export function getKSTDateKey() {
    const now = new Date();
    const kstOffset = 9 * 60; // UTC+9
    const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
}

/**
 * Get KST display date for message titles
 */
export function getKSTDisplayDate() {
    return new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get KST display date for English messages
 */
export function getKSTDisplayDateEN() {
    return new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Seoul',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get current KST time string (HH:MM KST)
 */
export function getKSTTimeString() {
    return new Date().toLocaleTimeString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) + ' KST';
}

/**
 * Format a timestamp to KST time string
 */
export function formatToKST(timestamp) {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) + ' KST';
}

// ============================================
// RATE LIMITING (Separate Buckets)
// ============================================

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

/**
 * Rate limit configuration
 * - Regular (daily summary + economic calendar): max 2/day
 * - Trigger (whale + volatility combined): max 4/day
 * - Whale: max 2/day within trigger bucket
 * - Volatility: max 2/day within trigger bucket
 */
const LIMITS = {
    regular: 2,
    trigger: 4,
    whale: 2,
    volatility: 2
};

/**
 * Check if regular push can be sent
 * @param {string} channel - Telegram channel ID
 * @returns {Promise<boolean>}
 */
export async function canSendRegular(channel) {
    if (!KV_AVAILABLE) return true;

    const key = `ratelimit:${channel}:regular:${getKSTDateKey()}`;
    try {
        const count = await kv.get(key) || 0;
        return count < LIMITS.regular;
    } catch (e) {
        console.warn('KV read error:', e.message);
        return true; // Fail open
    }
}

/**
 * Check if trigger push can be sent
 * Must satisfy: trigger_total < 4 AND type_count < 2 AND not duplicate
 * @param {string} channel - Telegram channel ID
 * @param {'whale'|'volatility'} type - Alert type
 * @returns {Promise<boolean>}
 */
export async function canSendTrigger(channel, type) {
    if (!KV_AVAILABLE) return true;

    const dateKey = getKSTDateKey();
    const triggerKey = `ratelimit:${channel}:trigger:${dateKey}`;
    const typeKey = `ratelimit:${channel}:${type}:${dateKey}`;

    try {
        const [triggerCount, typeCount] = await Promise.all([
            kv.get(triggerKey),
            kv.get(typeKey)
        ]);

        const currentTrigger = triggerCount || 0;
        const currentType = typeCount || 0;

        return currentTrigger < LIMITS.trigger && currentType < LIMITS[type];
    } catch (e) {
        console.warn('KV read error:', e.message);
        return true;
    }
}

/**
 * Increment regular counter after successful send
 */
export async function incrementRegular(channel) {
    if (!KV_AVAILABLE) return;

    const key = `ratelimit:${channel}:regular:${getKSTDateKey()}`;
    try {
        await kv.incr(key);
        await kv.expire(key, 86400); // 24h TTL
    } catch (e) {
        console.warn('KV write error:', e.message);
    }
}

/**
 * Increment trigger counters after successful send
 * Increments both the total trigger bucket AND the specific type counter
 */
export async function incrementTrigger(channel, type) {
    if (!KV_AVAILABLE) return;

    const dateKey = getKSTDateKey();
    const triggerKey = `ratelimit:${channel}:trigger:${dateKey}`;
    const typeKey = `ratelimit:${channel}:${type}:${dateKey}`;

    try {
        await Promise.all([
            kv.incr(triggerKey),
            kv.incr(typeKey)
        ]);
        await Promise.all([
            kv.expire(triggerKey, 86400),
            kv.expire(typeKey, 86400)
        ]);
    } catch (e) {
        console.warn('KV write error:', e.message);
    }
}

// ============================================
// DEDUPLICATION (2-hour window)
// ============================================

const DEDUP_TTL = 7200; // 2 hours in seconds

/**
 * Check if a dedup key already exists (alert already sent)
 */
export async function isDuplicate(dedupKey) {
    if (!KV_AVAILABLE) return false;

    try {
        const exists = await kv.get(dedupKey);
        return !!exists;
    } catch (e) {
        console.warn('KV dedup check error:', e.message);
        return false;
    }
}

/**
 * Mark an alert as sent (set dedup key with 2h TTL)
 */
export async function markSent(dedupKey) {
    if (!KV_AVAILABLE) return;

    try {
        await kv.set(dedupKey, 1, { ex: DEDUP_TTL });
    } catch (e) {
        console.warn('KV dedup mark error:', e.message);
    }
}

/**
 * Generate volatility alert dedup key
 * Format: dedup:volatility:<coin>:<timeframe>:<direction>:<level>
 * @param {string} coin - BTC, ETH, etc.
 * @param {'1h'|'4h'} timeframe
 * @param {number} changePercent - Positive = up, negative = down
 */
export function getVolatilityDedupKey(coin, timeframe, changePercent) {
    const direction = changePercent > 0 ? 'up' : 'down';
    const level = Math.abs(changePercent) >= 4.0 ? 'L2' : 'L1';
    return `dedup:volatility:${coin}:${timeframe}:${direction}:${level}`;
}

/**
 * Generate whale alert dedup key
 * Format: dedup:whale:<txhash_prefix>
 */
export function getWhaleDedupKey(txHash) {
    return `dedup:whale:${txHash.slice(0, 20)}`;
}

// ============================================
// VOLATILITY PRIORITY LOGIC
// ============================================

/**
 * Select highest priority volatility alert when multiple trigger
 * Priority: L2 > L1, and within same level: 4H > 1H
 * @param {Array} alerts - Array of {coin, timeframe, change, level}
 * @returns {Object|null} - Highest priority alert or null
 */
export function selectHighestPriorityAlert(alerts) {
    if (!alerts || alerts.length === 0) return null;

    // Sort by priority: L2 first, then 4H within same level
    return alerts.sort((a, b) => {
        // L2 (4%+) has higher priority than L1 (2.5%+)
        const levelA = Math.abs(a.change) >= 4.0 ? 2 : 1;
        const levelB = Math.abs(b.change) >= 4.0 ? 2 : 1;

        if (levelB !== levelA) return levelB - levelA;

        // Same level: 4H > 1H
        if (a.timeframe === '4h' && b.timeframe === '1h') return -1;
        if (a.timeframe === '1h' && b.timeframe === '4h') return 1;

        // Same timeframe: higher absolute change wins
        return Math.abs(b.change) - Math.abs(a.change);
    })[0];
}

// ============================================
// MESSAGE FORMATTING
// ============================================

/**
 * Format unified message with standard structure
 */
export function formatMessage({ title, bullets, conclusion, cta, timestamp = true }) {
    let msg = `${title}\n`;
    msg += '━━━━━━━━━━━━━━━━\n\n';

    if (bullets && bullets.length > 0) {
        msg += bullets.map(b => `• ${b}`).join('\n');
        msg += '\n\n';
    }

    if (conclusion) {
        msg += `${conclusion}\n\n`;
    }

    msg += '━━━━━━━━━━━━━━━━\n';

    if (timestamp) {
        msg += `⏰ ${getKSTTimeString()}\n`;
    }

    if (cta) {
        msg += cta;
    }

    return msg;
}

/**
 * Standard CTA for Korean messages
 */
export const CTA_KR = `🔗 trantradinglab.com
📱 X: @TranTradingLab`;

/**
 * Standard CTA for English messages
 */
export const CTA_EN = `🔗 trantradinglab.com
📱 X: @TranTradingLab`;

// ============================================
// TELEGRAM SEND HELPER
// ============================================

/**
 * Send message to Telegram channel
 */
export async function sendTelegram(channelId, text, botToken) {
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN not set');
        return { ok: false, error: 'No bot token' };
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: channelId,
                    text: text,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            }
        );

        const result = await response.json();

        if (!result.ok) {
            console.error('Telegram API error:', result.description);
        }

        return result;
    } catch (e) {
        console.error('Telegram send error:', e.message);
        return { ok: false, error: e.message };
    }
}

// ============================================
// FEAR & GREED INDEX FETCHER (for daily summary)
// ============================================

/**
 * Fetch current Fear & Greed Index
 */
export async function getFearGreedData() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2');
        const data = await res.json();

        if (data.data && data.data.length >= 2) {
            const today = data.data[0];
            const yesterday = data.data[1];

            return {
                value: parseInt(today.value),
                classification: today.value_classification,
                yesterdayValue: parseInt(yesterday.value),
                change: parseInt(today.value) - parseInt(yesterday.value),
                emoji: getFearGreedEmoji(parseInt(today.value))
            };
        }
        return null;
    } catch (e) {
        console.error('Fear & Greed fetch error:', e.message);
        return null;
    }
}

function getFearGreedEmoji(value) {
    if (value <= 25) return '😱';
    if (value <= 45) return '😰';
    if (value <= 55) return '😐';
    if (value <= 75) return '😏';
    return '🤑';
}

/**
 * Get Korean classification for Fear & Greed
 */
export function getFearGreedKR(classification) {
    const map = {
        'Extreme Fear': '극심한 공포',
        'Fear': '공포',
        'Neutral': '중립',
        'Greed': '탐욕',
        'Extreme Greed': '극심한 탐욕'
    };
    return map[classification] || classification;
}
