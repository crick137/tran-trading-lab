"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Clock } from "lucide-react";

interface PopularArticle {
    title: string;
    slug: string;
    views: number;
    readingTime: string;
}

interface PopularArticlesProps {
    articles: PopularArticle[];
}

// Default mock data - can be replaced with real data from props
const defaultArticles: PopularArticle[] = [
    {
        title: "SMC 전략 완벽 가이드: Order Block과 Fair Value Gap",
        slug: "smc-strategy-guide",
        views: 2847,
        readingTime: "12분",
    },
    {
        title: "2024년 1분기 한국 시장 전망: 코스피 방향성 분석",
        slug: "2024-q1-korea-market-outlook",
        views: 2156,
        readingTime: "8분",
    },
    {
        title: "ORB 전략으로 시장 오픈 첫 30분 공략하기",
        slug: "orb-strategy-korea",
        views: 1893,
        readingTime: "10분",
    },
    {
        title: "중국 부동산 위기가 한국 증시에 미치는 영향",
        slug: "china-real-estate-korea-impact",
        views: 1654,
        readingTime: "6분",
    },
    {
        title: "테슬라 실적 발표 후 글로벌 시장 영향 분석",
        slug: "tesla-earnings-analysis",
        views: 1432,
        readingTime: "7분",
    },
];

export function PopularArticles({ articles = defaultArticles }: Partial<PopularArticlesProps>) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-semibold text-foreground">인기 글</h3>
            </div>

            <div className="space-y-3">
                {articles.map((article, index) => (
                    <motion.div
                        key={article.slug}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link
                            href={`/blog/${article.slug}`}
                            className="group flex gap-4 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-gold/50 transition-all"
                        >
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                                {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-gold transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {article.readingTime}
                                    </span>
                                    <span>{article.views.toLocaleString()} 조회</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
