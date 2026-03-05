"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContentCard } from "@/components/content/content-card";
import { PopularRanking } from "@/components/home/popular-ranking";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
import { Search, FileText } from "lucide-react";
import { getContentByType } from "@/lib/content-utils";

export function ResearchContent() {
    const locale = useLocale() as "en" | "ko";
    const t = useTranslations("research");
    const tc = useTranslations("common");
    const [biasFilter, setBiasFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const allResearch = getContentByType(locale, "research");

    const biasOptions = [
        { id: "all", label: locale === "ko" ? "전체" : "All" },
        { id: "long", label: "Long", color: "text-green-400" },
        { id: "short", label: "Short", color: "text-red-400" },
        { id: "neutral", label: "Neutral", color: "text-amber-400" },
    ];

    const filteredResearch = allResearch.filter((item) => {
        const matchesBias = biasFilter === "all" || item.bias === biasFilter;
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBias && matchesSearch;
    });

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {/* Compact header */}
                <section className="border-b border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[var(--text-primary)]">{t("title")}</h1>
                                <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="border-b border-[var(--border-subtle)] sticky top-16 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder={tc("search")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/40 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                {biasOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setBiasFilter(opt.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${biasFilter === opt.id
                                            ? opt.id === "all"
                                                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                                                : opt.id === "long"
                                                    ? "bg-green-400/20 text-green-400"
                                                    : opt.id === "short"
                                                        ? "bg-red-400/20 text-red-400"
                                                        : "bg-amber-400/20 text-amber-400"
                                            : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main content with sidebar */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Content Feed */}
                        <div className="flex-1 min-w-0">
                            {filteredResearch.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredResearch.map((item) => (
                                        <ContentCard key={item.id} item={item} variant="horizontal" />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-14 h-14 mx-auto rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
                                        <FileText className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <p className="text-sm text-[var(--text-tertiary)]">
                                        {t("noResearch")}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                            <PopularRanking />
                            <SubscribeCTA variant="compact" />
                        </aside>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
