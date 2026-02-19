"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Activity, Bitcoin } from "lucide-react";
import useSWR from "swr";

interface CoinPrice {
    symbol: string;
    usd: number;
    usd_24h_change: number;
}

interface FearGreedData {
    value: number;
    classification: string;
}

interface MarketData {
    coins: CoinPrice[] | null;
    fearGreed: FearGreedData | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getSignal(classification: string): "bullish" | "bearish" | "neutral" {
    const lower = classification.toLowerCase();
    if (lower.includes("extreme fear") || lower.includes("fear")) return "bearish";
    if (lower.includes("extreme greed") || lower.includes("greed")) return "bullish";
    return "neutral";
}

function formatPrice(price: number): string {
    if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function MiniSparkline({ signal }: { signal: string }) {
    const color = signal === "bullish" ? "var(--bullish)" : signal === "bearish" ? "var(--bearish)" : "var(--neutral)";
    return (
        <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-30" aria-hidden="true">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points="0,18 10,15 20,16 30,12 40,14 50,10 60,11 70,8 80,6"
            />
        </svg>
    );
}

function SkeletonCard() {
    return (
        <div className="block p-8 sm:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[var(--border-default)]" />
                    <div className="w-20 h-4 rounded bg-[var(--border-default)]" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="w-16 h-8 rounded bg-[var(--border-default)] mb-2" />
                    <div className="w-12 h-4 rounded bg-[var(--border-default)]" />
                </div>
                <div className="w-20 h-6 rounded bg-[var(--bg-wash)]" />
            </div>
        </div>
    );
}

interface CardData {
    id: string;
    icon: React.ElementType;
    value: string;
    label: string;
    change: string;
    signal: "bullish" | "bearish" | "neutral";
}

// Ethereum SVG icon (lucide doesn't have one)
function EthIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 3 12 12 16 21 12" />
            <polygon points="12 16 3 12 12 22 21 12" />
        </svg>
    );
}

export function MarketPulse() {
    const locale = useLocale();
    const t = useTranslations("home");
    const { data, isLoading } = useSWR<MarketData>("/api/market-data", fetcher, {
        refreshInterval: 300_000,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
    });

    // Build cards array — only include cards with real API data
    const cards: CardData[] = [];

    const fearGreed = data?.fearGreed;
    if (fearGreed) {
        cards.push({
            id: "fear-greed",
            icon: Activity,
            value: String(fearGreed.value),
            label: "Fear & Greed",
            change: fearGreed.classification,
            signal: getSignal(fearGreed.classification),
        });
    }

    const coins = data?.coins;
    const btc = coins?.find((c) => c.symbol === "BTC");
    if (btc) {
        cards.push({
            id: "btc",
            icon: Bitcoin,
            value: `$${formatPrice(btc.usd)}`,
            label: "BTC",
            change: `${btc.usd_24h_change >= 0 ? "+" : ""}${btc.usd_24h_change.toFixed(2)}%`,
            signal: btc.usd_24h_change >= 0 ? "bullish" : "bearish",
        });
    }

    const eth = coins?.find((c) => c.symbol === "ETH");
    if (eth) {
        cards.push({
            id: "eth",
            icon: EthIcon,
            value: `$${formatPrice(eth.usd)}`,
            label: "ETH",
            change: `${eth.usd_24h_change >= 0 ? "+" : ""}${eth.usd_24h_change.toFixed(2)}%`,
            signal: eth.usd_24h_change >= 0 ? "bullish" : "bearish",
        });
    }

    // If loaded but no cards (all API calls returned null), hide the section entirely
    if (!isLoading && cards.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-overline text-[var(--text-muted)] text-center mb-10">
                    {t("marketPulseTitle")}
                </h2>

                <div className={`grid grid-cols-1 gap-6 ${cards.length === 1 ? "md:grid-cols-1 max-w-md mx-auto" : cards.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
                    {isLoading && !data ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        cards.map((card) => (
                            <Link
                                key={card.id}
                                href={`/${locale}/dashboard`}
                                className={`block p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] signal-${card.signal}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <card.icon className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">{card.label}</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-bold tabular-nums font-data text-[var(--text-primary)]">{card.value}</p>
                                        <p className={`text-sm tabular-nums font-data mt-1.5 ${card.signal === "bullish" ? "text-bullish" :
                                            card.signal === "bearish" ? "text-bearish" :
                                                "text-neutral"
                                            }`}>
                                            {card.change}
                                        </p>
                                    </div>
                                    <MiniSparkline signal={card.signal} />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
