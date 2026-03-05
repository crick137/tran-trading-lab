"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContentCard } from "@/components/content/content-card";
import { PopularRanking } from "@/components/home/popular-ranking";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
import { TrendingUp, Send, ArrowRight } from "lucide-react";
import type { UnifiedContentItem } from "@/lib/content-utils";

interface BriefingsContentProps {
    items: UnifiedContentItem[];
}

export function BriefingsContent({ items }: BriefingsContentProps) {
    const locale = useLocale() as "en" | "ko";
    const t = useTranslations("briefings");
    const tc = useTranslations("common");

    const allBriefings = items;

    // Empty state
    if (!allBriefings || allBriefings.length === 0) {
        return (
            <>
                <Navbar />
                <main className="pt-16 min-h-screen">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-green-400/10 flex items-center justify-center mb-6">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-[var(--text-tertiary)] mb-8 max-w-lg mx-auto">
                            {t("noBriefings")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#0a0a0f] font-semibold transition-all hover:brightness-110"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            <Send className="w-4 h-4" />
                            {tc("joinTelegramChannel")}
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const [latestBriefing, ...olderBriefings] = allBriefings;

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {/* Compact header */}
                <section className="border-b border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[var(--text-primary)]">{t("title")}</h1>
                                <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main content with sidebar */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* Latest briefing — featured */}
                            <ContentCard item={latestBriefing} variant="featured" />

                            {/* Older briefings */}
                            {olderBriefings.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                        {locale === "ko" ? "이전 브리핑" : "Previous Briefings"}
                                    </h2>
                                    {olderBriefings.map((item) => (
                                        <ContentCard key={item.id} item={item} variant="horizontal" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                            <PopularRanking items={items} />
                            <SubscribeCTA variant="compact" />
                        </aside>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
