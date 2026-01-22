import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Get article data from query params
    const title = searchParams.get('title') || 'TRAN Trading Lab Research';
    const subtitle = searchParams.get('subtitle') || '';
    const symbol = searchParams.get('symbol') || '';
    const timeframe = searchParams.get('timeframe') || '';
    const bias = searchParams.get('bias') || 'neutral';
    const date = searchParams.get('date') || '';

    // Determine bias colors and text
    const biasConfig: Record<string, { color: string; bg: string; text: string }> = {
        long: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', text: 'BULLISH' },
        short: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: 'BEARISH' },
        neutral: { color: '#F5C542', bg: 'rgba(245, 197, 66, 0.15)', text: 'NEUTRAL' },
    };

    const biasData = biasConfig[bias] || biasConfig.neutral;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0a0a0b 0%, #161618 50%, #1a1a1c 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '60px',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Top bar with logo and symbol */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #F5C542 0%, #d4a837 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#0a0a0b',
                            }}
                        >
                            T
                        </div>
                        <span style={{ fontSize: '24px', color: '#888888' }}>
                            TRAN Trading Lab
                        </span>
                    </div>

                    {/* Symbol badge */}
                    {symbol && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'rgba(245, 197, 66, 0.1)',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid rgba(245, 197, 66, 0.3)',
                            }}
                        >
                            <span style={{ fontSize: '28px', color: '#F5C542', fontWeight: 'bold' }}>
                                {symbol}
                            </span>
                            <span style={{ fontSize: '20px', color: '#888888' }}>
                                {timeframe}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main title */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: '52px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            lineHeight: 1.2,
                            marginBottom: '20px',
                        }}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div
                            style={{
                                fontSize: '28px',
                                color: '#888888',
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>

                {/* Bottom bar with bias and date */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Bias indicator */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: biasData.bg,
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: `1px solid ${biasData.color}`,
                        }}
                    >
                        <span style={{ fontSize: '20px', color: biasData.color, fontWeight: 'bold' }}>
                            {biasData.text}
                        </span>
                    </div>

                    {/* Date */}
                    <span style={{ fontSize: '18px', color: '#666666' }}>
                        {date}
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
