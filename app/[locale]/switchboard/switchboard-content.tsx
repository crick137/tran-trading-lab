"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

export function SwitchboardContent() {
    const locale = useLocale();
    const t = useTranslations("switchboard");

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-[var(--text-tertiary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-2xl">{t("description")}</p>
                    </div>

                    <EmptyState
                        icon={<BarChart3 className="w-7 h-7 text-[var(--text-ghost)]" />}
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
