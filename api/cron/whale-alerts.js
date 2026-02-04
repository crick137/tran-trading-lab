/**
 * 🐋 TRAN 고래 알림 (Whale Alert)
 * Vercel Cron: 6시간마다 실행 (0 */6 * * * UTC)
 * 채널: @TranTradingLabKR
 * 
 * 조건:
 * - 금액 ≥ $50M
    * - 거래소 관련 전송만(입금 / 출금)
        * 
 * 제한:
 * - 일일 최대 2회(whale 타입)
    * - 트리거 총합 4회(whale + volatility)
        * - txhash로 중복 방지
            */

import { kv } from '@vercel/kv';
import {
    getKSTDisplayDate,
    getKSTTimeString,
    canSendTrigger,
    incrementTrigger,
    isDuplicate,
    markSent,
    getWhaleDedupKey,
    sendTelegram,
    CTA_KR
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabKR';

// Minimum amount for alert (USD)
const MIN_AMOUNT_USD = 50000000; // $50M

// Known exchange wallet patterns (simplified)
const EXCHANGE_PATTERNS = {
    'binance': ['34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo', 'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97'],
    'coinbase': ['1FzWLkAahHooV3kzTgyx6qsswXJ6sCXkSR'],
    'kraken': ['3AfpNBjcGCdpqXpBs8bhWEcbNmP6v7Sg38'],
    'bitfinex': ['3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r'],
    'huobi': ['1HckjUpRGcrrRAtFaaCAUaGjsPx9oYmLaZ'],
    'okx': ['3LYJfcfHPXYJreMsASk2jkn69LTEYQgmBp']
};

// ============================================
// Whale Detection
// ============================================

async function getBTCPrice() {
    try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await res.json();
        return parseFloat(data.price);
    } catch {
        return 95000; // Fallback
    }
}

function isExchangeAddress(address) {
    if (!address) return { isExchange: false };

    for (const [exchange, wallets] of Object.entries(EXCHANGE_PATTERNS)) {
        for (const wallet of wallets) {
            if (address.toLowerCase().includes(wallet.slice(0, 10).toLowerCase())) {
                return { isExchange: true, exchange };
            }
        }
    }

    // Check for common exchange patterns
    if (address.includes('binance') || address.includes('coinbase')) {
        return { isExchange: true, exchange: 'Unknown Exchange' };
    }

    return { isExchange: false };
}

async function getRecentLargeTransactions() {
    const transactions = [];

    try {
        // Fetch unconfirmed BTC transactions
        const btcPrice = await getBTCPrice();
        const btcRes = await fetch('https://blockchain.info/unconfirmed-transactions?format=json', {
            signal: AbortSignal.timeout(15000)
        });
        const btcData = await btcRes.json();

        for (const tx of btcData.txs?.slice(0, 100) || []) {
            const outputValue = tx.out?.reduce((sum, o) => sum + (o.value || 0), 0) / 1e8;
            const usdValue = outputValue * btcPrice;

            if (usdValue >= MIN_AMOUNT_USD) {
                // Check if exchange-related
                const fromAddr = tx.inputs?.[0]?.prev_out?.addr || '';
                const toAddr = tx.out?.[0]?.addr || '';

                const fromCheck = isExchangeAddress(fromAddr);
                const toCheck = isExchangeAddress(toAddr);

                // Only include if exchange-related
                if (fromCheck.isExchange || toCheck.isExchange) {
                    transactions.push({
                        id: tx.hash,
                        coin: 'BTC',
                        coinKR: '비트코인',
                        amount: outputValue,
                        amountUsd: usdValue,
                        from: fromAddr ? fromAddr.slice(0, 8) + '...' : 'Unknown',
                        to: toAddr ? toAddr.slice(0, 8) + '...' : 'Unknown',
                        direction: toCheck.isExchange ? 'to_exchange' : 'from_exchange',
                        exchange: toCheck.exchange || fromCheck.exchange || 'Exchange',
                        timestamp: tx.time * 1000
                    });
                }
            }
        }
    } catch (e) {
        console.error('Whale detection error:', e.message);
    }

    return transactions;
}

// ============================================
// Message Generation
// ============================================

function getSemanticMessage(direction) {
    if (direction === 'to_exchange') {
        return {
            icon: '📥',
            label: '거래소 입금',
            interpretation: '⚠️ 잠재적 매도 압력 ↑\n   (단, 내부 자금 정리 가능성도 있음)',
            action: '💡 관망 또는 분할 익절 고려'
        };
    } else {
        return {
            icon: '📤',
            label: '거래소 출금',
            interpretation: '📈 잠재적 매도 압력 ↓\n   (단, 지갑 마이그레이션 가능성도 있음)',
            action: '💡 긍정 신호지만 단독 매수 근거로 부족'
        };
    }
}

function generateMessage(tx) {
    const dateStr = getKSTDisplayDate();
    const semantic = getSemanticMessage(tx.direction);

    const amountStr = tx.amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const usdStr = (tx.amountUsd / 1000000).toFixed(0);

    let msg = `🐋 <b>대형 거래 감지</b> | ${tx.coin}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    msg += `💰 <b>${amountStr} ${tx.coin}</b> (~$${usdStr}M)\n`;
    msg += `${semantic.icon} <b>${semantic.label}</b>\n\n`;

    msg += `📍 ${tx.from} → ${tx.to}\n`;
    msg += `🏦 관련 거래소: ${tx.exchange}\n\n`;

    msg += `${semantic.interpretation}\n\n`;
    msg += `${semantic.action}\n\n`;

    msg += `<i>※ 고래 움직임은 단독 매매 근거가 될 수 없습니다.\n   반드시 다른 지표와 함께 판단하세요.</i>\n\n`;

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_KR;
    msg += `\n\n#고래알림 #${tx.coin} #TranTradingLab`;

    return msg;
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    const isTest = req.url?.includes('test=true');

    if (!isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('🐋 Checking for whale transactions...');

        // Rate limit check
        const canSend = await canSendTrigger(CHANNEL_ID, 'whale');
        if (!canSend && !isTest) {
            console.log('Whale alert: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (trigger ≤4/day or whale ≤2/day)'
            });
        }

        // Get transactions
        const transactions = await getRecentLargeTransactions();
        console.log(`Found ${transactions.length} large exchange-related transactions`);

        if (transactions.length === 0) {
            return res.status(200).json({
                success: true,
                alertsSent: 0,
                message: 'No whale transactions found'
            });
        }

        let alertsSent = 0;

        for (const tx of transactions) {
            // Check dedup
            const dedupKey = getWhaleDedupKey(tx.id);
            const isDup = await isDuplicate(dedupKey);

            if (isDup) {
                console.log(`Skipping duplicate tx: ${tx.id.slice(0, 16)}...`);
                continue;
            }

            // Re-check rate limit
            const stillCanSend = await canSendTrigger(CHANNEL_ID, 'whale');
            if (!stillCanSend && !isTest) {
                console.log('Rate limit reached during processing');
                break;
            }

            // Send message
            const message = generateMessage(tx);
            const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

            if (result.ok) {
                await Promise.all([
                    incrementTrigger(CHANNEL_ID, 'whale'),
                    markSent(dedupKey)
                ]);
                alertsSent++;
                console.log(`✅ Sent whale alert for ${tx.amount} ${tx.coin}`);
            }

            // Max 1 per run to spread alerts
            if (alertsSent >= 1) break;
        }

        return res.status(200).json({
            success: true,
            alertsSent,
            totalFound: transactions.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Whale alert error:', error);
        return res.status(500).json({ error: error.message });
    }
}
