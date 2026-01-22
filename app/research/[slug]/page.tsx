"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SocialShare } from "@/components/blog/social-share";
import { ArticleCTA } from "@/components/blog/article-cta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ResearchHeader } from "@/components/research/research-header";
import { QuickSummary } from "@/components/research/quick-summary";
import { SectionBlock } from "@/components/research/section-block";
import { ScenarioCard } from "@/components/research/scenario-card";
import { ChartImage, Checklist, Conclusion } from "@/components/research/research-widgets";
import { getResearchBySlug, researchArticles } from "@/lib/research-data";

export default function ResearchArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = getResearchBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <ReadingProgress />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/research"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Research로 돌아가기
                    </Link>

                    {/* Header */}
                    <ResearchHeader article={article} />

                    {/* Quick Summary */}
                    <QuickSummary items={article.quickSummary} />

                    {/* Chart Image */}
                    <ChartImage
                        src={article.image}
                        alt={`${article.symbol} ${article.timeframe} Chart`}
                    />

                    {/* Sections */}
                    {article.sections.map((section, index) => (
                        <SectionBlock
                            key={index}
                            icon={section.icon}
                            title={section.title}
                            content={section.content}
                            highlights={section.highlights}
                            delay={index + 3}
                        />
                    ))}

                    {/* Trading Scenarios */}
                    <div className="mb-8">
                        <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground mb-6">
                            <span className="text-2xl">💹</span>
                            트레이딩 시나리오
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {article.scenarios.map((scenario, index) => (
                                <ScenarioCard
                                    key={index}
                                    type={scenario.type}
                                    title={scenario.title}
                                    condition={scenario.condition}
                                    meaning={scenario.meaning}
                                    expectedFlow={scenario.expectedFlow}
                                    strategy={scenario.strategy}
                                    delay={index + 6}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Checklist */}
                    <Checklist items={article.checklist} />

                    {/* Conclusion */}
                    <Conclusion text={article.conclusion} />

                    {/* Social Share */}
                    <div className="mt-12 pt-8 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-muted-foreground">이 분석이 도움이 되셨나요?</p>
                            <SocialShare title={article.title} />
                        </div>
                    </div>

                    {/* CTA */}
                    <ArticleCTA />

                    {/* Related Articles */}
                    {researchArticles.length > 1 && (
                        <>
                            <hr className="my-12 border-border/50" />
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-6">관련 리서치</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {researchArticles
                                        .filter((a) => a.slug !== slug)
                                        .slice(0, 2)
                                        .map((art) => (
                                            <Link
                                                key={art.slug}
                                                href={`/research/${art.slug}`}
                                                className="p-4 rounded-lg bg-card border border-border/50 hover:border-gold/50 transition-all group card-hover"
                                            >
                                                <span className="text-xs text-gold mb-2 block">
                                                    {art.symbol} | {art.timeframe}
                                                </span>
                                                <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                                                    {art.title}
                                                </h3>
                                            </Link>
                                        ))}
                                </div>
                            </section>
                        </>
                    )}
                </article>
            </main>
            <Footer />
        </>
    );
}
