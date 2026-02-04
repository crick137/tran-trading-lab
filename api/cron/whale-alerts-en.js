/**
 * 🐋 TRAN Whale Alert (English)
 * Vercel Cron: Every 6 hours (30 */6 * * * UTC)
 * Channel: @TranTradingLabEN
 * 
 * Conditions:
 * - Amount ≥ $50M
    * - Exchange - related transfers only
        * 
 * Limits:
 * - Max 2 / day(whale type)
    * - Max 4 / day trigger total
        * - Dedup by txhash
            */

import {
    getKSTDisplayDateEN,
    getKSTTimeString,
    canSendTrigger,
    incrementTrigger,
    isDuplicate,
    markSent,
    getWhaleDedupKey,
    sendTelegram,
    CTA_EN
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabEN';

const MIN_AMOUNT_USD = 50000000;

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
        return 95000;
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

    if (address.includes('binance') || address.includes('coinbase')) {
        return { isExchange: true, exchange: 'Unknown Exchange' };
    }

    return { isExchange: false };
}

async function getRecentLargeTransactions() {
    const transactions = [];

    try {
        const btcPrice = await getBTCPrice();
        const btcRes = await fetch('https://blockchain.info/unconfirmed-transactions?format=json', {
            signal: AbortSignal.timeout(15000)
        });
        const btcData = await btcRes.json();

        for (const tx of btcData.txs?.slice(0, 100) || []) {
            const outputValue = tx.out?.reduce((sum, o) => sum + (o.value || 0), 0) / 1e8;
            const usdValue = outputValue * btcPrice;

            if (usdValue >= MIN_AMOUNT_USD) {
                const fromAddr = tx.inputs?.[0]?.prev_out?.addr || '';
                const toAddr = tx.out?.[0]?.addr || '';

                const fromCheck = isExchangeAddress(fromAddr);
                const toCheck = isExchangeAddress(toAddr);

                if (fromCheck.isExchange || toCheck.isExchange) {
                    transactions.push({
                        id: tx.hash,
                        coin: 'BTC',
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
            label: 'Deposit to Exchange',
            interpretation: '⚠️ Potential selling pressure ↑\n   (May also be internal consolidation)',
            action: '💡 Consider holding or partial profit-taking'
        };
    } else {
        return {
            icon: '📤',
            label: 'Withdrawal from Exchange',
            interpretation: '📈 Potential selling pressure ↓\n   (May also be wallet migration)',
            action: '💡 Positive signal but not sufficient for buy decision alone'
        };
    }
}

function generateMessage(tx) {
    const dateStr = getKSTDisplayDateEN();
    const semantic = getSemanticMessage(tx.direction);

    const amountStr = tx.amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const usdStr = (tx.amountUsd / 1000000).toFixed(0);

    let msg = `🐋 <b>Large Transaction Detected</b> | ${tx.coin}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    msg += `💰 <b>${amountStr} ${tx.coin}</b> (~$${usdStr}M)\n`;
    msg += `${semantic.icon} <b>${semantic.label}</b>\n\n`;

    msg += `📍 ${tx.from} → ${tx.to}\n`;
    msg += `🏦 Exchange: ${tx.exchange}\n\n`;

    msg += `${semantic.interpretation}\n\n`;
    msg += `${semantic.action}\n\n`;

    msg += `<i>※ Whale movements alone are not sufficient for trading decisions.\n   Always combine with other indicators.</i>\n\n`;

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_EN;
    msg += `\n\n#WhaleAlert #${tx.coin} #TranTradingLab`;

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
        console.log('🐋 Checking for whale transactions (EN)...');

        const canSend = await canSendTrigger(CHANNEL_ID, 'whale');
        if (!canSend && !isTest) {
            console.log('Whale alert EN: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached'
            });
        }

        const transactions = await getRecentLargeTransactions();

        if (transactions.length === 0) {
            return res.status(200).json({
                success: true,
                alertsSent: 0,
                message: 'No whale transactions found'
            });
        }

        let alertsSent = 0;

        for (const tx of transactions) {
            const dedupKey = getWhaleDedupKey(tx.id);
            const isDup = await isDuplicate(dedupKey);

            if (isDup) {
                continue;
            }

            const stillCanSend = await canSendTrigger(CHANNEL_ID, 'whale');
            if (!stillCanSend && !isTest) {
                break;
            }

            const message = generateMessage(tx);
            const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

            if (result.ok) {
                await Promise.all([
                    incrementTrigger(CHANNEL_ID, 'whale'),
                    markSent(dedupKey)
                ]);
                alertsSent++;
                console.log(`✅ Sent whale alert (EN) for ${tx.amount} ${tx.coin}`);
            }

            if (alertsSent >= 1) break;
        }

        return res.status(200).json({
            success: true,
            alertsSent,
            totalFound: transactions.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Whale alert EN error:', error);
        return res.status(500).json({ error: error.message });
    }
}
