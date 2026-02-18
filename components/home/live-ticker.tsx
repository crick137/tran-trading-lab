"use client";

import { useTranslations } from "next-intl";

interface TickerItem {
    symbol: string;
    price: string;
    change: string;
    isPositive: boolean;
}

const tickerData: TickerItem[] = [
    { symbol: "SPX", price: "6,117", change: "+0.24%", isPositive: true },
    { symbol: "NDQ", price: "19,843", change: "+0.41%", isPositive: true },
    { symbol: "BTC", price: "95,432", change: "-1.2%", isPositive: false },
    { symbol: "ETH", price: "2,684", change: "-0.8%", isPositive: false },
    { symbol: "VIX", price: "15.2", change: "-3.1%", isPositive: true },
    { symbol: "Gold", price: "2,931", change: "+0.5%", isPositive: true },
    { symbol: "10Y", price: "4.52%", change: "+2bp", isPositive: false },
    { symbol: "DXY", price: "106.8", change: "+0.3%", isPositive: true },
    { symbol: "KOSPI", price: "2,612", change: "+0.3%", isPositive: true },
    { symbol: "Oil", price: "71.2", change: "-1.5%", isPositive: false },
];

function TickerItemDisplay({ item }: { item: TickerItem }) {
    return (
        <div className="flex items-center gap-2 px-4 whitespace-nowrap">
            <span className="text-white/50 text-xs font-medium">{item.symbol}</span>
            <span className="font-data text-sm text-white/90">{item.price}</span>
            <span className={`font-data text-xs ${item.isPositive ? "text-bullish" : "text-bearish"}`}>
                {item.isPositive ? "▲" : "▼"} {item.change}
            </span>
        </div>
    );
}

export function LiveTicker() {
    const t = useTranslations("home");

    return (
        <section
            className="relative border-y border-white/5 bg-cv-elevated/50 overflow-hidden py-2.5"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
        >
            <div className="animate-ticker flex">
                {/* Duplicate the items for seamless scrolling */}
                {[...tickerData, ...tickerData].map((item, index) => (
                    <TickerItemDisplay key={`${item.symbol}-${index}`} item={item} />
                ))}
            </div>
        </section>
    );
}
