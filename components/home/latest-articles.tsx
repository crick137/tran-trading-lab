"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blog-data";

const latestArticles = blogPosts.slice(0, 3);

export function LatestArticles() {
    const locale = useLocale();
    const t = useTranslations("home");
    const tc = useTranslations("common");

    if (latestArticles.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            {t("latestArticles")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("heroSubtitle")}
                        </p>
                    </div>
                    <Link
                        href={`/${locale}/blog`}
                        className="hidden sm:flex items-center gap-2 text-gold hover:text-gold-light transition-colors group"
                    >
                        {t("viewAll")}
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
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                    >
                        {t("viewAll")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
