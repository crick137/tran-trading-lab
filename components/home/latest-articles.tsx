"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Clock } from "lucide-react";
import { Lamp } from "@/components/ui/aceternity/lamp";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

interface ArticlePreview {
    slug: string;
    title: string;
    excerpt: string;
    readTime: string;
    category: string;
    date: string;
}

const mockArticles: ArticlePreview[] = [
    {
        slug: "why-bond-market-screaming",
        title: "Why the Bond Market Is Screaming a Warning",
        excerpt: "10Y yields are flashing signals that equity traders are ignoring. Here's what the spread tells us about the next 6 months.",
        readTime: "6 min",
        category: "Macro",
        date: "Feb 18, 2026",
    },
    {
        slug: "btc-halving-cycle-update",
        title: "BTC Halving Cycle: Where Are We Now?",
        excerpt: "Comparing current price action to 2016 and 2020 post-halving trajectories. The divergence is telling.",
        readTime: "4 min",
        category: "Crypto",
        date: "Feb 16, 2026",
    },
    {
        slug: "risk-management-101-position-sizing",
        title: "Risk Management 101: Position Sizing That Works",
        excerpt: "The Kelly Criterion, fixed fractional, and why most retail traders risk too much per trade.",
        readTime: "5 min",
        category: "Education",
        date: "Feb 14, 2026",
    },
];

function CategoryBadge({ category }: { category: string }) {
    const colorMap: Record<string, string> = {
        Macro: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        Crypto: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        Education: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        Korea: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    };
    return (
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${colorMap[category] || "text-white/40 bg-white/5 border-white/10"}`}>
            {category}
        </span>
    );
}

export function LatestArticles() {
    const locale = useLocale();
    const t = useTranslations("home");
    const gridRef = useGsapScroll<HTMLDivElement>({
        children: true,
        stagger: 0.12,
    });

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Lamp>
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
                            {t("latestArticles")}
                        </h2>
                    </Lamp>
                    <Link
                        href={`/${locale}/blog`}
                        className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1 group"
                    >
                        {t("viewAll")}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Articles Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockArticles.map((article) => (
                        <TiltCard key={article.slug}>
                            <Link
                                href={`/${locale}/blog/${article.slug}`}
                                className="block p-5 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow h-full"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <CategoryBadge category={article.category} />
                                    <span className="text-[10px] text-white/30">{article.date}</span>
                                </div>

                                <h3 className="text-base font-semibold text-white/90 mb-2 line-clamp-2 leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-white/40 line-clamp-2 mb-4 leading-relaxed">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center gap-1 text-xs text-white/30">
                                    <Clock className="w-3 h-3" />
                                    <span>{article.readTime}</span>
                                </div>
                            </Link>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
