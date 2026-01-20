"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/blog/article-card";
import { Search } from "lucide-react";
import Link from "next/link"; // Added missing import
import { blogPosts } from "@/lib/blog-data";

const categories = [
    { id: "all", label: "전체" },
    { id: "analysis", label: "시장 분석" },
    { id: "strategy", label: "트레이딩 전략" },
    { id: "news", label: "뉴스 번역" },
];

function BlogContent() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

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
            <>
                <Navbar />
                <main className="pt-24 pb-16 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                        <h1 className="text-4xl font-bold text-foreground mb-4">블로그</h1>
                        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                            콘텐츠 준비 중입니다.
                        </p>
                        <div className="bg-card/30 border border-border/50 rounded-2xl p-12 max-w-2xl mx-auto backdrop-blur-sm">
                            <p className="text-muted-foreground text-lg mb-6">
                                아직 등록된 게시물이 없습니다.<br />
                                텔레그램에서 가장 빠른 소식을 받아보세요.
                            </p>
                            <Link
                                href="https://t.me/TranTradingLab"
                                target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                            >
                                텔레그램 채널 입장
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
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
                    <h1 className="text-4xl font-bold text-foreground mb-4">블로그</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        시장 분석, 트레이딩 전략, 그리고 중국 금융 뉴스 번역까지.
                        <br />
                        투자에 필요한 모든 인사이트를 제공합니다.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="검색..."
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
                            검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
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
