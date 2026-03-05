"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContentCard } from "@/components/content/content-card";
import { PopularRanking } from "@/components/home/popular-ranking";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
import { Search, FileText, BookOpen } from "lucide-react";
import { getContentByType, type UnifiedContentItem } from "@/lib/content-utils";

function BlogInner() {
    const searchParams = useSearchParams();
    const locale = useLocale() as "en" | "ko";
    const t = useTranslations("blog");
    const tc = useTranslations("common");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const allBlogContent = getContentByType(locale, "blog");

    const categories = [
        { id: "all", label: locale === "ko" ? "전체" : "All" },
        { id: "market-analysis", label: locale === "ko" ? "시장 분석" : "Market Analysis" },
        { id: "education", label: locale === "ko" ? "교육" : "Education" },
        { id: "cognitive-bias", label: locale === "ko" ? "인지 편향" : "Cognitive Biases" },
        { id: "risk-management", label: locale === "ko" ? "리스크 관리" : "Risk Management" },
        { id: "macro", label: locale === "ko" ? "매크로" : "Macro" },
        { id: "korean-market", label: locale === "ko" ? "한국 시장" : "Korean Market" },
    ];

    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [searchParams]);

    const filteredArticles = allBlogContent.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="pt-16 min-h-screen">
            {/* Compact header */}
            <section className="border-b border-[var(--border-subtle)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[var(--text-primary)]">{t("title")}</h1>
                            <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter inline */}
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
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                        ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    {cat.label}
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
                        {filteredArticles.length > 0 ? (
                            <div className="space-y-4">
                                {filteredArticles.map((item) => (
                                    <ContentCard key={item.id} item={item} variant="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-14 h-14 mx-auto rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                                    <FileText className="w-7 h-7 text-[var(--accent)]" />
                                </div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                    {t("emptyTitle")}
                                </h2>
                                <p className="text-sm text-[var(--text-tertiary)] mb-6">
                                    {searchQuery ? t("noResults") : t("noPosts")}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                        className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {locale === "ko" ? "필터 초기화" : "Clear filters"}
                                    </button>
                                )}
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
    );
}

export function BlogContent() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="pt-16 min-h-screen" />}>
                <BlogInner />
            </Suspense>
            <Footer />
        </>
    );
}
