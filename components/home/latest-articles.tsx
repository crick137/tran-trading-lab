"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";

// Mock data - will be replaced with real MDX content
const latestArticles = [
    {
        title: "2024년 1분기 한국 시장 전망: 코스피 방향성 분석",
        excerpt: "미국 금리 인하 기대감과 반도체 사이클 회복이 한국 시장에 미치는 영향을 분석합니다.",
        slug: "2024-q1-korea-market-outlook",
        category: "analysis",
        date: "2024-01-15",
        readingTime: "8분",
        image: "/images/market-analysis.jpg",
    },
    {
        title: "SMC 전략 완벽 가이드: Order Block과 Fair Value Gap",
        excerpt: "Smart Money Concept의 핵심 개념인 Order Block과 FVG를 활용한 트레이딩 전략을 상세히 설명합니다.",
        slug: "smc-strategy-guide",
        category: "strategy",
        date: "2024-01-12",
        readingTime: "12분",
        image: "/images/smc-strategy.jpg",
    },
    {
        title: "중국 부동산 위기가 한국 증시에 미치는 영향",
        excerpt: "Evergrande 사태 이후 중국 부동산 시장의 변화와 한국 관련 종목에 대한 분석입니다.",
        slug: "china-real-estate-korea-impact",
        category: "news",
        date: "2024-01-10",
        readingTime: "6분",
        image: "/images/china-news.jpg",
    },
];

export function LatestArticles() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            최신 글
                        </h2>
                        <p className="text-muted-foreground">
                            시장 분석, 트레이딩 전략, 뉴스 번역
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden sm:flex items-center gap-2 text-gold hover:text-gold-light transition-colors group"
                    >
                        모든 글 보기
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestArticles.map((article, index) => (
                        <ArticleCard key={article.slug} {...article} index={index} />
                    ))}
                </div>

                {/* Mobile Link */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                    >
                        모든 글 보기
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
