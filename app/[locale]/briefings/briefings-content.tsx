"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import Link from "next/link";
import {
    FileText,
    Send,
    ArrowRight,
    Calendar,
    Clock,
    Tag,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import { getDailyBriefs } from "@/lib/daily-brief-data";
import type { DailyBrief } from "@/lib/daily-brief-data";

function BiasIcon({ bias }: { bias: string }) {
    const lower = bias.toLowerCase();
    if (lower.includes("bullish") || lower.includes("강세") || lower.includes("rising") || lower.includes("상승")) {
        return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
    if (lower.includes("bearish") || lower.includes("약세")) {
        return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <Minus className="w-4 h-4 text-[var(--text-tertiary)]" />;
}

function BriefCard({ brief, locale }: { brief: DailyBrief; locale: string }) {
    return (
        <Link
            href={`/${locale}/briefings/${brief.date}`}
            className="block p-6 rounded-xl bg-cv-elevated border border-[var(--border-default)] hover:border-accent/50 transition-all group card-hover"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                    Daily Brief
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Calendar className="w-3.5 h-3.5" />
                    {brief.date}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Clock className="w-3.5 h-3.5" />
                    {brief.readingTime}
                </span>
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-accent transition-colors mb-2">
                {brief.title}
            </h2>

            <p className="text-sm text-[var(--text-tertiary)] mb-4 line-clamp-2">
                {brief.description}
            </p>

            {/* Key levels preview */}
            <div className="flex flex-wrap gap-2 mb-4">
                {brief.keyLevels.slice(0, 3).map((level) => (
                    <div
                        key={level.asset}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-wash)] border border-[var(--border-subtle)] text-xs"
                    >
                        <BiasIcon bias={level.bias} />
                        <span className="font-medium text-[var(--text-primary)]">{level.asset}</span>
                        <span className="text-[var(--text-tertiary)]">
                            {level.support} – {level.resistance}
                        </span>
                    </div>
                ))}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                {brief.tags.slice(0, 5).map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded bg-cv-elevated border border-[var(--border-subtle)] text-[var(--text-tertiary)]"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </Link>
    );
}

export function BriefingsContent() {
    const locale = useLocale();
    const t = useTranslations("briefings");
    const tc = useTranslations("common");
    const briefs = getDailyBriefs(locale as "en" | "ko");

    // Empty state
    if (!briefs || briefs.length === 0) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen">
                    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                        <div>
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                                <FileText className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="text-display text-[var(--text-primary)] mb-4">
                                {t("title")}
                            </h1>
                            <p className="text-[var(--text-tertiary)] mb-12 max-w-2xl mx-auto">
                                {t("subtitle")}
                            </p>
                        </div>
                        <div className="bg-cv-elevated/50 border border-[var(--border-subtle)] rounded-2xl p-12 max-w-2xl mx-auto">
                            <p className="text-[var(--text-tertiary)] text-lg mb-6">
                                {t("noBriefings")}
                                <br />
                                {t("telegramCta")}
                            </p>
                            <a
                                href="https://t.me/TranTradingLabEN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[#0a0a0f] font-bold transition-all hover:shadow-lg hover:shadow-accent/20"
                                style={{ background: "var(--gradient-cta)" }}
                            >
                                <Send className="w-4 h-4" />
                                {tc("joinTelegramChannel")}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <FileText className="w-4 h-4" />
                        {t("title")}
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-6">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </section>

                {/* Briefs List */}
                <SectionReveal>
                    <section className="max-w-4xl mx-auto px-6">
                        <div className="space-y-4">
                            {briefs.map((brief) => (
                                <BriefCard
                                    key={brief.date}
                                    brief={brief}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    </section>
                </SectionReveal>
            </main>
            <Footer />
        </>
    );
}
