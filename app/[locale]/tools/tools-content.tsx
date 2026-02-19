"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { Wrench, Calculator, FileSpreadsheet, ArrowRight } from "lucide-react";

export function ToolsContent() {
    const locale = useLocale();
    const t = useTranslations("tools");
    const tools = [
        {
            id: "position-sizing",
            titleKey: "positionSizing" as const,
            descKey: "positionSizingDesc" as const,
            icon: Calculator,
            href: `/${locale}/tools/position-sizing`,
        },
        {
            id: "rr-calculator",
            titleKey: "rrCalculator" as const,
            descKey: "rrCalculatorDesc" as const,
            icon: Calculator,
            href: `/${locale}/tools/rr-calculator`,
        },
        {
            id: "templates",
            titleKey: "templates" as const,
            descKey: "templatesDesc" as const,
            icon: FileSpreadsheet,
            href: `/${locale}/tools/templates`,
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <Wrench className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-display text-[var(--text-primary)] mb-4">{t("title")}</h1>
                        <p className="text-lg text-[var(--text-tertiary)]">{t("subtitle")}</p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid gap-5 max-w-3xl mx-auto">
                        {tools.map((tool) => (
                            <TiltCard key={tool.id}>
                                <Link
                                    href={tool.href}
                                    className="flex items-center gap-6 p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] card-hover border-glow group"
                                >
                                    <div className="w-16 h-16 rounded-lg bg-cv-surface flex items-center justify-center shrink-0">
                                        <tool.icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors mb-1">
                                            {t(tool.titleKey)}
                                        </h3>
                                        <p className="text-[var(--text-tertiary)] text-sm">{t(tool.descKey)}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[var(--text-ghost)] group-hover:text-accent transition-colors shrink-0" />
                                </Link>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
