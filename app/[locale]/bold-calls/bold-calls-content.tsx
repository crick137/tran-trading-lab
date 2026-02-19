"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { Target } from "lucide-react";

export function BoldCallsContent() {
    const locale = useLocale();
    const t = useTranslations("boldCalls");

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

                    <EmptyState
                        icon={<Target className="w-7 h-7 text-[var(--text-ghost)]" />}
                        title={t("emptyTitle")}
                        subtitle={t("emptySubtitle")}
                        cta={{ label: t("emptyCta"), href: `/${locale}/subscribe` }}
                    />

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
