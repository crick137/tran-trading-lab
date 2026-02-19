"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Target, Clock, Trophy } from "lucide-react";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export function BoldCallSpotlight() {
    const locale = useLocale();
    const t = useTranslations("home");
    const sectionRef = useGsapScroll<HTMLDivElement>();

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto" ref={sectionRef}>
                <MovingBorder
                    className="p-6 md:p-8"
                    borderColor="rgba(255, 165, 0, 0.3)"
                    duration={8}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                <Target className="w-4 h-4 text-gold" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{t("boldCallTitle")}</h3>
                                <p className="text-xs text-white/40">{t("boldCallSubtitle")}</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bullish/10 border border-bullish/20">
                            <Trophy className="w-3.5 h-3.5 text-bullish" />
                            <span className="text-xs font-data font-bold text-bullish">62%</span>
                            <span className="text-xs text-white/40">(29/47)</span>
                        </div>
                    </div>

                    {/* Bold Call Card */}
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 mb-5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-data text-white/30">#BC-047</span>
                            <span className="text-xs text-white/20">|</span>
                            <span className="text-xs text-white/30">Feb 15, 2026</span>
                        </div>
                        <p className="text-white/90 font-medium mb-3">
                            &ldquo;SPX will NOT break 6,200 before March&rdquo;
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs">
                            <span className="flex items-center gap-1.5 text-gold">
                                <Clock className="w-3 h-3" />
                                ⏳ Active
                            </span>
                            <span className="text-white/30">Deadline: Mar 1</span>
                            <span className="text-white/30">Current SPX: <span className="font-data text-bullish">6,117</span></span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        href={`/${locale}/bold-calls`}
                        className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
                    >
                        {t("boldCallCta")}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </MovingBorder>
            </div>
        </section>
    );
}
