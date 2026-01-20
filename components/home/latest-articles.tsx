"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import { motion } from "framer-motion";


import { blogPosts } from "@/lib/blog-data";

const latestArticles = blogPosts.slice(0, 3).map(post => ({
    ...post,
    image: `/images/${post.slug}.jpg` // Placeholder - using mock logic for images if needed, or remove image prop if ArticleCard handles it
}));

export function LatestArticles() {
    if (latestArticles.length === 0) {
        return (
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            최신 글
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto rounded-full mb-8" />
                        <div className="bg-card/30 border border-border/50 rounded-2xl p-12 max-w-2xl mx-auto backdrop-blur-sm">
                            <p className="text-muted-foreground text-lg mb-6">
                                콘텐츠 준비 중입니다. 텔레그램에서 최신 업데이트를 받아보세요.
                            </p>
                            <Link
                                href="https://t.me/TranTradingLab"
                                target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                            >
                                텔레그램 채널 입장
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-background relative overflow-hidden">
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
