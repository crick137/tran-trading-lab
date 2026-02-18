"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, FileText } from "lucide-react";
import { Lamp } from "@/components/ui/aceternity/lamp";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { blogPosts } from "@/lib/blog-data";
import { researchArticles } from "@/lib/research-data";

export function LatestArticles() {
    const locale = useLocale();
    const t = useTranslations("home");
    const sectionRef = useGsapScroll<HTMLDivElement>();

    const hasBlogPosts = blogPosts.length > 0;
    const hasResearch = researchArticles.length > 0;

    // If no real content at all, show empty state
    if (!hasBlogPosts && !hasResearch) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto" ref={sectionRef}>
                    <Lamp className="mb-8">
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider text-center">
                            {t("latestArticles")}
                        </h2>
                    </Lamp>
                    <div className="text-center py-12 rounded-xl bg-cv-elevated border border-white/5">
                        <FileText className="w-10 h-10 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 mb-2">{t("emptyStateTitle")}</p>
                        <p className="text-sm text-white/30 mb-6 max-w-md mx-auto">{t("emptyStateDesc")}</p>
                        <Link
                            href={`/${locale}/subscribe`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-cv-void hover:shadow-lg hover:shadow-gold/20 transition-all"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("emptyStateCta")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Show real research articles if available
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
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto" ref={sectionRef}>
                <div className="flex items-center justify-between mb-8">
                    <Lamp>
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
                            {t("latestArticles")}
                        </h2>
                    </Lamp>
                    <Link
                        href={`/${locale}/${hasResearch ? "research" : "blog"}`}
                        className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1 group"
                    >
                        {t("viewAll")}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {articlesToShow.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${locale}/${article.basePath}/${article.slug}`}
                            className="block p-5 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow h-full"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border text-gold bg-gold/10 border-gold/20">
                                    {article.category}
                                </span>
                                <span className="text-[10px] text-white/30">{article.date}</span>
                            </div>

                            <h3 className="text-base font-semibold text-white/90 mb-2 line-clamp-2 leading-snug">
                                {article.title}
                            </h3>

                            <p className="text-sm text-white/40 line-clamp-2 mb-4 leading-relaxed">
                                {article.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
