"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { researchArticles } from "@/lib/research-data";
import { blogPosts } from "@/lib/blog-data";
import { TrendingUp, FileText, BookOpen, ArrowRight, Calendar, Clock, Send } from "lucide-react";

export function ReportsContent() {
    const locale = useLocale();
    const t = useTranslations("reports");
    const tc = useTranslations("common");

    const koResearch = researchArticles.filter((a) => a.locale === "ko").slice(0, 6);
    const koBlog = blogPosts.filter((p) => p.locale === "ko").slice(0, 4);

    return (
        <>
            <Navbar />
            <main className="pt-16 pb-16 min-h-screen">
                {/* Header */}
                <section className="border-b border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
                            <TrendingUp className="w-7 h-7 text-accent" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{t("title")}</h1>
                        <p className="text-base text-[var(--text-tertiary)] max-w-[600px] mx-auto">
                            심층 시장 분석, 종목 리서치, 인사이트를 한 곳에서 확인하세요.
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Research Section */}
                    <section className="py-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <FileText className="w-5 h-5 text-accent" />
                                리서치 보고서
                            </h2>
                            <Link
                                href={`/${locale}/research`}
                                className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                                전체 보기 <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {koResearch.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/${locale}/research/${article.slug}`}
                                    className="group p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            article.bias === "long" ? "bg-green-500/20 text-green-400" :
                                            article.bias === "short" ? "bg-red-500/20 text-red-400" :
                                            "bg-gray-500/20 text-gray-400"
                                        }`}>
                                            {article.bias === "long" ? "LONG" : article.bias === "short" ? "SHORT" : "NEUTRAL"}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)]">{article.symbol}</span>
                                    </div>
                                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {article.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {article.readingTime}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Blog Insights Section */}
                    <section className="py-12 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-accent" />
                                인사이트 &amp; 분석
                            </h2>
                            <Link
                                href={`/${locale}/blog`}
                                className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                                전체 보기 <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {koBlog.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/${locale}/blog/${post.slug}`}
                                    className="group flex gap-4 p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all"
                                >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-accent mb-2 block">{post.category}</span>
                                        <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors mb-2 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 mb-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                            <span>{post.date}</span>
                                            <span>{post.readingTime}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center bg-cv-elevated border border-[var(--border-subtle)] rounded-2xl p-8 mb-12">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                            실시간 시장 업데이트
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-6 max-w-xl mx-auto">
                            텔레그램 채널에서 매일 시장 브리핑과 분석 보고서를 받아보세요.
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#0a0a0f] font-semibold transition-all hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            <Send className="w-4 h-4" />
                            {tc("joinTelegramChannel")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
