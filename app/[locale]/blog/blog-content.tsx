"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/blog/article-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Search, FileText, Send, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

function BlogInner() {
    const searchParams = useSearchParams();
    const locale = useLocale();
    const t = useTranslations("blog");
    const tc = useTranslations("common");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const heroRef = useGsapScroll<HTMLDivElement>();

    const categories = [
        { id: "all", label: t("categoryAll") },
        { id: "analysis", label: t("categoryAnalysis") },
        { id: "strategy", label: t("categoryStrategy") },
        { id: "news", label: t("categoryNews") },
    ];

    // Sync with URL params
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categories.some(c => c.id === categoryParam)) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    // Handle Empty State
    if (!blogPosts || blogPosts.length === 0) {
        const communityLink = locale === "ko"
            ? { href: "https://invite.kakao.com/tc/luxHFht3xL", label: "카카오톡 참여" }
            : { href: "https://t.me/TranTradingLabEN", label: tc("joinTelegramChannel") };

        return (
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                        <FileText className="w-8 h-8 text-gold" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">{t("emptyTitle")}</h1>
                    <p className="text-white/40 mb-12 max-w-2xl mx-auto">
                        {t("emptySubtitle")}
                    </p>
                    <div className="bg-cv-elevated/50 border border-gold/10 rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-white/40 text-lg mb-8">
                            {t("noPosts")}<br />
                            {t("telegramCta")}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={communityLink.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cv-primary font-bold transition-all hover:shadow-lg hover:shadow-gold/20"
                                style={{ background: "var(--gradient-cta)" }}
                            >
                                <Send className="w-4 h-4" />
                                {communityLink.label}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <Link
                                href={`/${locale}/dashboard`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cv-elevated border border-white/10 text-white/60 text-sm font-semibold hover:text-white hover:border-gold/30 transition-all group"
                            >
                                <BarChart3 className="w-4 h-4" />
                                {locale === "ko" ? "대시보드 보기" : "View Dashboard"}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
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
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div ref={heroRef} className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                        <FileText className="w-8 h-8 text-gold" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                    <p className="text-lg text-white/40 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            placeholder={tc("search")}
                            aria-label={tc("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-cv-elevated border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? "bg-gold text-cv-primary"
                                    : "bg-cv-elevated border border-white/5 text-white/40 hover:text-white/70 hover:border-gold/30"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article, index) => (
                            <ArticleCard key={article.slug} {...article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-white/40">
                            {t("noResults")}
                        </p>
                    </div>
                )}
            </div>
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
