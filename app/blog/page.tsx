"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/blog/article-card";
import { Search } from "lucide-react";

// Mock articles data
const allArticles = [
    {
        title: "2024년 1분기 한국 시장 전망: 코스피 방향성 분석",
        excerpt: "미국 금리 인하 기대감과 반도체 사이클 회복이 한국 시장에 미치는 영향을 분석합니다.",
        slug: "2024-q1-korea-market-outlook",
        category: "analysis",
        date: "2024-01-15",
        readingTime: "8분",
    },
    {
        title: "SMC 전략 완벽 가이드: Order Block과 Fair Value Gap",
        excerpt: "Smart Money Concept의 핵심 개념인 Order Block과 FVG를 활용한 트레이딩 전략을 상세히 설명합니다.",
        slug: "smc-strategy-guide",
        category: "strategy",
        date: "2024-01-12",
        readingTime: "12분",
    },
    {
        title: "중국 부동산 위기가 한국 증시에 미치는 영향",
        excerpt: "Evergrande 사태 이후 중국 부동산 시장의 변화와 한국 관련 종목에 대한 분석입니다.",
        slug: "china-real-estate-korea-impact",
        category: "news",
        date: "2024-01-10",
        readingTime: "6분",
    },
    {
        title: "ORB 전략으로 시장 오픈 첫 30분 공략하기",
        excerpt: "Opening Range Breakout 전략의 원리와 한국 시장 적용 방법을 알아봅니다.",
        slug: "orb-strategy-korea",
        category: "strategy",
        date: "2024-01-08",
        readingTime: "10분",
    },
    {
        title: "테슬라 실적 발표 후 글로벌 시장 영향 분석",
        excerpt: "테슬라 4분기 실적과 2024년 가이던스가 관련 종목에 미치는 영향을 분석합니다.",
        slug: "tesla-earnings-analysis",
        category: "analysis",
        date: "2024-01-05",
        readingTime: "7분",
    },
    {
        title: "위안화 약세와 한국 수출주 투자 전략",
        excerpt: "중국 위안화 움직임이 한국 수출 기업들에 미치는 영향과 투자 아이디어.",
        slug: "yuan-weakness-korea-exports",
        category: "news",
        date: "2024-01-03",
        readingTime: "5분",
    },
];

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

    const filteredArticles = allArticles.filter((article) => {
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
