"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { Target, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
import { getBoldCallsByLocale, type BoldCall } from "@/lib/bold-calls-data";
import { motion } from "framer-motion";

function StatusBadge({ status }: { status: BoldCall['status'] }) {
    const config = {
        active: { icon: Clock, label: "Active", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
        hit: { icon: CheckCircle2, label: "Hit ✓", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        stopped: { icon: XCircle, label: "Stopped", className: "bg-red-500/10 text-red-400 border-red-500/20" },
        expired: { icon: Clock, label: "Expired", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    };
    const { icon: Icon, label, className } = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function DirectionIcon({ direction }: { direction: BoldCall['direction'] }) {
    if (direction === 'long') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (direction === 'short') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-amber-400" />;
}

function BoldCallCard({ call, index }: { call: BoldCall; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-xl border border-[var(--border-subtle)] bg-cv-elevated p-5 sm:p-6 hover:border-[var(--accent)]/30 transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        call.direction === 'long' ? 'bg-emerald-500/10' :
                        call.direction === 'short' ? 'bg-red-500/10' : 'bg-amber-500/10'
                    }`}>
                        <DirectionIcon direction={call.direction} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">{call.title}</h3>
                        <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {call.date} · {call.asset}
                        </p>
                    </div>
                </div>
                <StatusBadge status={call.status} />
            </div>

            {/* Levels */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)] mb-1">Entry</p>
                    <p className="text-sm font-mono font-medium text-[var(--text-primary)]">{call.entry}</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)] mb-1">Target</p>
                    <p className="text-sm font-mono font-medium text-emerald-400">{call.target}</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-ghost)] mb-1">Stop Loss</p>
                    <p className="text-sm font-mono font-medium text-red-400">{call.stopLoss}</p>
                </div>
            </div>

            {/* Thesis */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                {call.thesis}
            </p>

            {/* Result (if completed) */}
            {call.result && (
                <div className={`rounded-lg p-3 border ${
                    call.status === 'hit'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                }`}>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-[var(--text-secondary)]">Result</p>
                        {call.returnPct && (
                            <span className={`text-sm font-mono font-bold ${
                                call.status === 'hit' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                                {call.returnPct}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{call.result}</p>
                </div>
            )}
        </motion.div>
    );
}

export function BoldCallsContent() {
    const locale = useLocale();
    const t = useTranslations("boldCalls");
    const calls = getBoldCallsByLocale(locale as 'ko' | 'en');

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-display text-[var(--text-primary)]">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-[var(--text-tertiary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>

                    {calls.length === 0 ? (
                        <EmptyState
                            icon={<Target className="w-7 h-7 text-[var(--text-ghost)]" />}
                            title={t("emptyTitle")}
                            subtitle={t("emptySubtitle")}
                            cta={{ label: t("emptyCta"), href: `/${locale}/subscribe` }}
                        />
                    ) : (
                        <div className="space-y-4">
                            {calls.map((call, index) => (
                                <BoldCallCard key={call.id} call={call} index={index} />
                            ))}
                        </div>
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
