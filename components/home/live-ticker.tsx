"use client";

import useSWR from "swr";

interface CoinPrice {
    symbol: string;
    usd: number;
    usd_24h_change: number;
}

interface MarketData {
    coins: CoinPrice[] | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatPrice(price: number): string {
    if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function TickerItemDisplay({ symbol, price, change }: { symbol: string; price: string; change: string; isPositive: boolean }) {
    const positive = !change.startsWith("-");
    return (
        <div className="flex items-center gap-2 px-4 whitespace-nowrap">
            <span className="text-[var(--text-secondary)] text-xs font-medium">{symbol}</span>
            <span className="font-data text-sm text-[var(--text-primary)]">{price}</span>
            <span className={`font-data text-xs ${positive ? "text-bullish" : "text-bearish"}`}>
                {positive ? "▲" : "▼"} {change}
            </span>
        </div>
    );
}

export function LiveTicker() {
    const { data } = useSWR<MarketData>("/api/market-data", fetcher, {
        refreshInterval: 300_000, // 5 min
        revalidateOnFocus: false,
    });

    const coins = data?.coins;

    // Only show ticker when we have real API data — no hardcoded prices
    if (!coins || coins.length === 0) return null;

    const items = coins.map((c) => ({
        symbol: c.symbol,
        price: `$${formatPrice(c.usd)}`,
        change: `${c.usd_24h_change >= 0 ? "+" : ""}${c.usd_24h_change.toFixed(2)}%`,
        isPositive: c.usd_24h_change >= 0,
    }));

    return (
        <section
            className="relative border-y border-[var(--border-subtle)] bg-cv-elevated/50 overflow-hidden py-2.5"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
        >
            <div className="animate-ticker flex">
                {[...items, ...items, ...items].map((item, index) => (
                    <TickerItemDisplay key={`${item.symbol}-${index}`} {...item} />
                ))}
            </div>
        </section>
    );
}
