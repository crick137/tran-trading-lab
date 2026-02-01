"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/blog/article-card";
import { Search } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

function BlogContent() {
    const searchParams = useSearchParams();
    const t = useTranslations("blog");
    const tc = useTranslations("common");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

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
        return (
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t("emptyTitle")}</h1>
                    <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                        {t("emptySubtitle")}
                    </p>
                    <div className="bg-card/30 border border-border/50 rounded-2xl p-12 max-w-2xl mx-auto backdrop-blur-sm">
                        <p className="text-muted-foreground text-lg mb-6">
                            {t("noPosts")}<br />
                            {t("telegramCta")}
                        </p>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            {tc("joinTelegramChannel")}
                        </Link>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={tc("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? "bg-gold text-background"
                                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50"
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
                        <p className="text-muted-foreground">
                            {t("noResults")}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="pt-24 min-h-screen" />}>
                <BlogContent />
            </Suspense>
            <Footer />
        </>
    );
}
