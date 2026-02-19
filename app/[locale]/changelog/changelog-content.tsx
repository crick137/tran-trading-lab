"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { History, Sparkles, Wrench, Bug, Zap } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    feature: <Sparkles className="w-4 h-4 text-accent" />,
    improvement: <Zap className="w-4 h-4 text-[var(--signal-info)]" />,
    fix: <Bug className="w-4 h-4 text-[var(--signal-bullish)]" />,
    update: <Wrench className="w-4 h-4 text-[var(--text-secondary)]" />,
};

export function ChangelogContent() {
    const locale = useLocale();
    const t = useTranslations("changelog");

    const entries = t.raw("entries") as Array<{
        date: string;
        version: string;
        items: Array<{ type: string; text: string }>;
    }>;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <History className="w-4 h-4" />
                        {t("title")}
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-6">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </section>

                {/* Entries */}
                <SectionReveal>
                    <section className="max-w-3xl mx-auto px-6 py-16">
                        <div className="space-y-12">
                            {entries.map((entry, idx) => (
                                <div key={idx} className="relative pl-8 border-l-2 border-[var(--border-subtle)]">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-2 border-[var(--bg-void)]" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-overline text-accent">{entry.version}</span>
                                        <span className="text-sm text-[var(--text-muted)]">{entry.date}</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {entry.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-tertiary)]">
                                                <span className="mt-0.5 shrink-0">{iconMap[item.type] || iconMap.update}</span>
                                                {item.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </SectionReveal>
            </main>
            <Footer />
        </>
    );
}
