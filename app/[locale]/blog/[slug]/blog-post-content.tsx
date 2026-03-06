"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { SocialShare } from "@/components/blog/social-share";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { blogPosts, categoryLabels } from "@/lib/blog-data";
import { ArticleCTA } from "@/components/blog/article-cta";
import { MarkdownRenderer } from "@/components/content/markdown-renderer";


export function BlogPostContent() {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations("blogPost");
    const slug = params.slug as string;
    const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
    const article = blogPosts[currentIndex];

    if (!article) {
        notFound();
    }

    const prevArticle = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextArticle = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

    return (
        <>
            <ReadingProgress />
            <Navbar />
            <main className="pt-16 min-h-screen">
                <TableOfContents content={article.content} />

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: t("blogBreadcrumb"), href: `/${locale}/blog` },
                            { label: categoryLabels[article.category] || article.category, href: `/${locale}/blog?category=${article.category}` },
                            { label: article.title },
                        ]}
                    />

                    {/* Back Link */}
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToBlog")}
                    </Link>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent mb-4">
                            {categoryLabels[article.category] || article.category}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {article.readingTime}{t("readSuffix")}
                            </span>
                        </div>

                        {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <Tag className="w-4 h-4 text-[var(--text-secondary)]" />
                                {article.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs rounded-md bg-cv-elevated border border-[var(--border-default)] text-[var(--text-secondary)]"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <SocialShare title={article.title} />
                    </motion.header>

                    {/* Hero image */}
                    {article.image && !article.image.startsWith('/api/') && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-8 border border-[var(--border-subtle)]"
                        >
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 720px"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                    )}

                    {/* Author card */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] mb-10">
                        <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image
                                src="/tiger-logo.png"
                                alt="TTL"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Tran Trading Lab</p>
                            <p className="text-xs text-[var(--text-tertiary)]">
                                {locale === "ko" ? "시장 분석 & 트레이딩 인사이트" : "Market Analysis & Trading Insights"}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <MarkdownRenderer content={article.content} />
                    </motion.div>

                    {/* Inline subscribe CTA */}
                    <ArticleCTA />

                    {/* Bottom Share */}
                    <div className="mt-12 pt-8 border-t border-[var(--border-default)]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-[var(--text-secondary)]">{t("sharePrompt")}</p>
                            <SocialShare title={article.title} />
                        </div>
                    </div>

                    {/* Article Navigation — Prev / Next */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevArticle ? (
                            <Link
                                href={`/${locale}/blog/${prevArticle.slug}`}
                                className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">{locale === "ko" ? "이전 글" : "Previous"}</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{prevArticle.title}</p>
                                </div>
                            </Link>
                        ) : <div />}
                        {nextArticle ? (
                            <Link
                                href={`/${locale}/blog/${nextArticle.slug}`}
                                className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors text-right"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">{locale === "ko" ? "다음 글" : "Next"}</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{nextArticle.title}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                            </Link>
                        ) : <div />}
                    </div>

                    <hr className="my-12 border-[var(--border-default)]" />

                    {/* Related Articles */}
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{t("relatedPosts")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {blogPosts
                                .filter((p) => p.slug !== slug)
                                .slice(0, 2)
                                .map((art) => (
                                    <Link
                                        key={art.slug}
                                        href={`/${locale}/blog/${art.slug}`}
                                        className="p-4 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all group"
                                    >
                                        <span className="text-xs text-[var(--accent)] mb-2 block">
                                            {categoryLabels[art.category] || art.category}
                                        </span>
                                        <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                                            {art.title}
                                        </h3>
                                        {art.tags && (
                                            <div className="mt-2 flex gap-1 flex-wrap">
                                                {art.tags.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="text-xs text-[var(--text-secondary)]">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
