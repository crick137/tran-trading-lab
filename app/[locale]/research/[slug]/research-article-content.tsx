"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SocialShare } from "@/components/blog/social-share";
import { ArticleCTA } from "@/components/blog/article-cta";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ResearchHeader } from "@/components/research/research-header";
import { QuickSummary } from "@/components/research/quick-summary";
import { SectionBlock } from "@/components/research/section-block";
import { ScenarioCard } from "@/components/research/scenario-card";
import { ChartImage, Checklist, Conclusion } from "@/components/research/research-widgets";
import { getResearchBySlug, researchArticles } from "@/lib/research-data";

export function ResearchArticleContent() {
    const params = useParams();
    const slug = params.slug as string;
    const locale = useLocale();
    const t = useTranslations("researchPost");
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
                        href={`/${locale}/research`}
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToResearch")}
                    </Link>

                    {/* Header */}
                    <ResearchHeader article={article} />

                    {/* Quick Summary */}
                    <QuickSummary items={article.quickSummary} />

                    {/* Content Images for Education Articles */}
                    {article.articleType === 'education' && article.contentImages && article.contentImages.length > 0 ? (
                        <div className="mb-8 space-y-6">
                            {article.contentImages.map((img, index) => (
                                <figure key={index} className="relative rounded-lg overflow-hidden border border-white/10">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        width={800}
                                        height={450}
                                        sizes="(max-width: 768px) 100vw, 800px"
                                        className="w-full h-auto"
                                    />
                                    {img.caption && (
                                        <figcaption className="bg-cv-elevated/50 px-4 py-3 text-sm text-white/50 text-center">
                                            {img.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    ) : (
                        /* Chart Image for Analysis Articles */
                        <ChartImage
                            src={article.image}
                            alt={`${article.symbol} ${article.timeframe} Chart`}
                        />
                    )}

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
                        <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white mb-6">
                            <span className="text-2xl">💹</span>
                            {t("tradingScenarios")}
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
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-white/50">{t("sharePrompt")}</p>
                            <SocialShare title={article.title} />
                        </div>
                    </div>

                    {/* CTA */}
                    <ArticleCTA />

                    {/* Related Articles */}
                    {researchArticles.length > 1 && (
                        <>
                            <hr className="my-12 border-white/10" />
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">{t("relatedResearch")}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {researchArticles
                                        .filter((a) => a.slug !== slug)
                                        .slice(0, 2)
                                        .map((art) => (
                                            <Link
                                                key={art.slug}
                                                href={`/${locale}/research/${art.slug}`}
                                                className="p-4 rounded-lg bg-cv-elevated border border-white/10 hover:border-gold/50 transition-all group card-hover"
                                            >
                                                <span className="text-xs text-gold mb-2 block">
                                                    {art.symbol} | {art.timeframe}
                                                </span>
                                                <h3 className="font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">
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
