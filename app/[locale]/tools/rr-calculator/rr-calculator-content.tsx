"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

export function RRCalculatorContent() {
    const locale = useLocale();
    const t = useTranslations("rrCalc");
    const tc = useTranslations("common");

    const [entryPrice, setEntryPrice] = useState<number>(100);
    const [stopPrice, setStopPrice] = useState<number>(95);
    const [targetPrice, setTargetPrice] = useState<number>(115);

    const isLong = targetPrice > entryPrice;
    const risk = Math.abs(entryPrice - stopPrice);
    const reward = Math.abs(targetPrice - entryPrice);
    const rr = risk > 0 ? reward / risk : 0;
    const stopPercent = ((entryPrice - stopPrice) / entryPrice) * 100;
    const targetPercent = ((targetPrice - entryPrice) / entryPrice) * 100;

    const heroRef = useGsapScroll<HTMLDivElement>();
    const calcRef = useGsapScroll<HTMLDivElement>({ from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 } });

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb
                        items={[
                            { label: tc("tools"), href: `/${locale}/tools` },
                            { label: t("title") },
                        ]}
                    />

                    <div ref={heroRef} className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <Calculator className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-[var(--text-tertiary)]">{t("subtitle")}</p>
                    </div>

                    {/* Calculator */}
                    <div ref={calcRef} className="p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] space-y-6">
                        <div>
                            <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("entryPrice")}</label>
                            <input
                                type="number"
                                value={entryPrice}
                                onChange={(e) => setEntryPrice(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-[var(--border-subtle)] text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("stopLoss")}</label>
                                <input
                                    type="number"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-bearish/20 text-white focus:outline-none focus:ring-2 focus:ring-bearish/50 focus:border-bearish/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("takeProfit")}</label>
                                <input
                                    type="number"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-bullish/20 text-white focus:outline-none focus:ring-2 focus:ring-bullish/50 focus:border-bullish/50 transition-all"
                                />
                            </div>
                        </div>

                        <hr className="border-[var(--border-subtle)]" />

                        {/* Results */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {isLong ? (
                                    <TrendingUp className="w-5 h-5 text-bullish" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-bearish" />
                                )}
                                <span className="text-[var(--text-tertiary)]">
                                    {isLong ? t("longPosition") : t("shortPosition")}
                                </span>
                            </div>
                            <div className="text-5xl font-bold text-accent mb-2 font-data">
                                {rr.toFixed(2)}R
                            </div>
                            <p className="text-[var(--text-tertiary)]">{t("rrRatio")}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-lg bg-bearish/10 border border-bearish/20">
                                <p className="text-bearish font-semibold font-data">{risk.toFixed(2)}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {t("risk")} ({Math.abs(stopPercent).toFixed(2)}%)
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-bullish/10 border border-bullish/20">
                                <p className="text-bullish font-semibold font-data">{reward.toFixed(2)}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {t("reward")} ({Math.abs(targetPercent).toFixed(2)}%)
                                </p>
                            </div>
                        </div>

                        {rr < 1 && (
                            <div className="p-3 rounded-lg bg-neutral/10 border border-neutral/30 text-center">
                                <p className="text-sm text-neutral">
                                    {t("warningLowRR")}
                                </p>
                            </div>
                        )}
                        {rr >= 2 && (
                            <div className="p-3 rounded-lg bg-bullish/10 border border-bullish/30 text-center">
                                <p className="text-sm text-bullish">
                                    {t("goodSetup")}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] text-center mt-6">
                        {t("disclaimer")}
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
