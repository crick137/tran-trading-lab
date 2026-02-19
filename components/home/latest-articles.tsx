"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import { researchArticles } from "@/lib/research-data";

export function LatestArticles() {
    const locale = useLocale();
    const t = useTranslations("home");
    const hasBlogPosts = blogPosts.length > 0;
    const hasResearch = researchArticles.length > 0;

    if (!hasBlogPosts && !hasResearch) {
        return null;
    }

    const articlesToShow = hasResearch
        ? researchArticles.slice(0, 3).map((a) => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.description,
            category: a.articleType === "education" ? "Education" : "Analysis",
            date: a.date,
            readTime: a.readingTime,
            basePath: "research",
        }))
        : blogPosts.slice(0, 3).map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            date: p.date,
            readTime: p.readingTime,
            basePath: "blog",
        }));

    return (
        <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-section text-[var(--text-primary)]">
                        {t("latestArticles")}
                    </h2>
                    <Link
                        href={`/${locale}/${hasResearch ? "research" : "blog"}`}
                        className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1 group"
                    >
                        {t("viewAll")}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articlesToShow.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${locale}/${article.basePath}/${article.slug}`}
                            className="block p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-full"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-overline text-accent">
                                    {article.category}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">{article.date}</span>
                            </div>

                            <h3 className="text-card-title text-[var(--text-primary)] mb-3 line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                                {article.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
