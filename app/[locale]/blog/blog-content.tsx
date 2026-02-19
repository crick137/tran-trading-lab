"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ArticleCard } from "@/components/blog/article-card";
import { Search, FileText, Send, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

function BlogInner() {
    const searchParams = useSearchParams();
    const locale = useLocale();
    const t = useTranslations("blog");
    const tc = useTranslations("common");
    const th = useTranslations("home");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const categoryIds = ["all", "analysis", "strategy", "news"] as const;
    const categories = categoryIds.map(id => ({
        id,
        label: t(id === "all" ? "categoryAll" : id === "analysis" ? "categoryAnalysis" : id === "strategy" ? "categoryStrategy" : "categoryNews"),
    }));

    // Sync with URL params
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoryIds.includes(categoryParam as typeof categoryIds[number])) {
            setSelectedCategory(categoryParam);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Handle Empty State
    if (!blogPosts || blogPosts.length === 0) {
        const communityLink = locale === "ko"
            ? { href: "https://invite.kakao.com/tc/luxHFht3xL", label: "카카오톡 참여" }
            : { href: "https://t.me/TranTradingLabEN", label: tc("joinTelegramChannel") };

        return (
            <main className="pt-24 pb-16 min-h-screen">
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <FileText className="w-4 h-4" />
                        {t("emptyTitle")}
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-6">{t("emptyTitle")}</h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed mb-12">
                        {t("emptySubtitle")}
                    </p>
                    <div className="p-8 md:p-12 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] max-w-2xl mx-auto">
                        <p className="text-[var(--text-tertiary)] text-lg mb-8">
                            {t("noPosts")}<br />
                            {t("telegramCta")}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={communityLink.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[#0a0a0f] font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
                                style={{ background: "var(--gradient-cta)" }}
                            >
                                <Send className="w-4 h-4" />
                                {communityLink.label}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <Link
                                href={`/${locale}/dashboard`}
                                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-cv-elevated border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-semibold hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all group"
                            >
                                <BarChart3 className="w-4 h-4" />
                                {tc("dashboard")}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    const filteredArticles = blogPosts.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="pt-24 pb-16 min-h-screen">
            {/* Hero */}
            <section className="max-w-5xl mx-auto px-6 text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                    <FileText className="w-4 h-4" />
                    {t("title")}
                </div>
                <h1 className="text-display text-[var(--text-primary)] mb-6">{t("title")}</h1>
                <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                    {t("subtitle")}
                </p>
            </section>

            {/* Search & Filter */}
            <section className="max-w-5xl mx-auto px-6 mb-12">
                <div className="space-y-4">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder={tc("search")}
                            aria-label={tc("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 h-14 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-ghost)] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? "bg-accent text-[#0a0a0f]"
                                    : "bg-cv-elevated border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <SectionReveal>
                <section className="max-w-5xl mx-auto px-6">
                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article, index) => (
                                <ArticleCard key={article.slug} {...article} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 max-w-lg mx-auto">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                <FileText className="w-7 h-7 text-accent" />
                            </div>
                            <h2 className="text-section text-[var(--text-primary)] mb-3">
                                {t("emptyTitle")}
                            </h2>
                            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-8">
                                {t("noResults")}
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-cv-elevated border border-[var(--border-default)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                            >
                                {tc("search").replace("...", "")} {t("categoryAll")}
                            </button>
                        </div>
                    )}
                </section>
            </SectionReveal>

            {/* Newsletter CTA */}
            <SectionReveal>
                <section className="max-w-5xl mx-auto px-6 py-24">
                    <div className="p-8 md:p-12 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] text-center">
                        <h2 className="text-section text-[var(--text-primary)] mb-4">
                            {th("subscribeCta")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-8 max-w-[480px] mx-auto">
                            {th("subscribeDescription")}
                        </p>
                        <Link
                            href={`/${locale}/subscribe`}
                            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[#0a0a0f] font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {tc("subscribeFree")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </SectionReveal>
        </main>
    );
}

export function BlogContent() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="pt-24 min-h-screen" />}>
                <BlogInner />
            </Suspense>
            <Footer />
        </>
    );
}
