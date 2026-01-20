"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";

import { blogPosts } from "@/lib/blog-data";

const latestArticles = blogPosts.slice(0, 3).map(post => ({
    ...post,
    image: `/images/${post.slug}.jpg` // Placeholder - using mock logic for images if needed, or remove image prop if ArticleCard handles it
}));

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
