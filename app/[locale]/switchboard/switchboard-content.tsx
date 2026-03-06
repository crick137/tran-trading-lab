"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Calendar, Shield } from "lucide-react";
import { getLatestSnapshot, type SwitchboardSignal, type SwitchboardSnapshot } from "@/lib/switchboard-data";
import { motion } from "framer-motion";

function SignalBadge({ signal }: { signal: SwitchboardSignal['signal'] }) {
    const config = {
        bullish: { icon: TrendingUp, label: "Bullish", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        bearish: { icon: TrendingDown, label: "Bearish", className: "bg-red-500/10 text-red-400 border-red-500/20" },
        neutral: { icon: Minus, label: "Neutral", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
        caution: { icon: AlertTriangle, label: "Caution", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    };
    const { icon: Icon, label, className } = config[signal];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function SignalRow({ signal, index }: { signal: SwitchboardSignal; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="rounded-xl border border-[var(--border-subtle)] bg-cv-elevated p-4 sm:p-5 hover:border-[var(--accent)]/20 transition-all"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">{signal.asset}</h3>
                    <p className="text-lg font-mono font-bold text-[var(--text-primary)] mt-0.5">{signal.level}</p>
                </div>
                <SignalBadge signal={signal.signal} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)]">Support</p>
                    <p className="text-sm font-mono text-emerald-400">{signal.support}</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)]">Resistance</p>
                    <p className="text-sm font-mono text-red-400">{signal.resistance}</p>
                </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{signal.note}</p>
        </motion.div>
    );
}

function MarketStateCard({ snapshot }: { snapshot: SwitchboardSnapshot }) {
    const stateColors: Record<string, string> = {
        A: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        B: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        C: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        D: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        E: "text-red-400 bg-red-500/10 border-red-500/20",
    };

    const fgColor = snapshot.fearGreedIndex <= 25 ? "text-red-400" :
                    snapshot.fearGreedIndex <= 45 ? "text-amber-400" :
                    snapshot.fearGreedIndex <= 55 ? "text-zinc-400" :
                    snapshot.fearGreedIndex <= 75 ? "text-blue-400" : "text-emerald-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-[var(--border-subtle)] bg-cv-elevated p-5 sm:p-6 mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span className="text-sm text-[var(--text-tertiary)]">{snapshot.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)] mb-2">Market State</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${stateColors[snapshot.marketState] || stateColors.C}`}>
                        <span className="text-2xl font-bold font-mono">{snapshot.marketState}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5">{snapshot.marketStateLabel}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)] mb-2">Fear & Greed</p>
                    <div className="inline-flex items-center gap-2">
                        <span className={`text-3xl font-bold font-mono ${fgColor}`}>{snapshot.fearGreedIndex}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5">{snapshot.fearGreedLabel}</p>
                </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <p className="text-xs font-medium text-[var(--accent)]">Weekly Note</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{snapshot.weeklyNote}</p>
            </div>
        </motion.div>
    );
}

export function SwitchboardContent() {
    const locale = useLocale();
    const t = useTranslations("switchboard");
    const snapshot = getLatestSnapshot(locale as 'ko' | 'en');

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-display text-[var(--text-primary)]">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-[var(--text-tertiary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-2xl">{t("description")}</p>
                    </div>

                    {!snapshot ? (
                        <EmptyState
                            icon={<TrendingUp className="w-7 h-7 text-[var(--text-ghost)]" />}
                            title={t("emptyTitle")}
                            subtitle={t("emptySubtitle")}
                            cta={{ label: t("emptyCta"), href: `/${locale}/subscribe` }}
                        />
                    ) : (
                        <>
                            {/* Market State Overview */}
                            <MarketStateCard snapshot={snapshot} />

                            {/* Signal Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {snapshot.signals.map((signal, index) => (
                                    <SignalRow key={signal.id} signal={signal} index={index} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Disclaimer */}
                    <p className="text-xs text-[var(--text-ghost)] mt-10 leading-relaxed text-center">
                        {t("disclaimer")}
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
