"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Calculator, AlertTriangle } from "lucide-react";

export default function PositionSizingPage() {
    const locale = useLocale();
    const t = useTranslations("positionSizingCalc");
    const tc = useTranslations("common");

    const [accountSize, setAccountSize] = useState<number>(10000000);
    const [riskPercent, setRiskPercent] = useState<number>(2);
    const [entryPrice, setEntryPrice] = useState<number>(100);
    const [stopPrice, setStopPrice] = useState<number>(95);

    const riskAmount = accountSize * (riskPercent / 100);
    const priceDiff = Math.abs(entryPrice - stopPrice);
    const positionSize = priceDiff > 0 ? riskAmount / priceDiff : 0;
    const totalValue = positionSize * entryPrice;
    const percentOfAccount = (totalValue / accountSize) * 100;

    const heroRef = useGsapScroll<HTMLDivElement>();
    const calcRef = useGsapScroll<HTMLDivElement>({ from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 } });

    const formatCurrency = (value: number) => value.toLocaleString(locale === "ko" ? "ko-KR" : "en-US");

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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <Calculator className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-white/40">{t("subtitle")}</p>
                    </div>

                    {/* Calculator */}
                    <div ref={calcRef} className="p-6 rounded-xl bg-cv-elevated border border-white/5 space-y-6">
                        <div>
                            <label className="block text-sm text-white/40 mb-2">{t("accountSize")}</label>
                            <input
                                type="number"
                                value={accountSize}
                                onChange={(e) => setAccountSize(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/40 mb-2">{t("riskPercent")}</label>
                            <input
                                type="number"
                                value={riskPercent}
                                onChange={(e) => setRiskPercent(Number(e.target.value))}
                                step="0.5"
                                min="0.1"
                                max="10"
                                className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/40 mb-2">{t("entryPrice")}</label>
                                <input
                                    type="number"
                                    value={entryPrice}
                                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/40 mb-2">{t("stopPrice")}</label>
                                <input
                                    type="number"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                                />
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* Results */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-white/40">{t("maxLoss")}</span>
                                <span className="text-bearish font-semibold">{formatCurrency(riskAmount)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-white/40">{t("positionSize")}</span>
                                <span className="text-gold font-bold text-xl font-data">{positionSize.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">{t("totalValue")}</span>
                                <span className="text-white font-data">{formatCurrency(totalValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">{t("accountPercent")}</span>
                                <span className="text-white font-data">{percentOfAccount.toFixed(1)}%</span>
                            </div>
                        </div>

                        {percentOfAccount > 50 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-neutral/10 border border-neutral/30">
                                <AlertTriangle className="w-4 h-4 text-neutral mt-0.5 shrink-0" />
                                <p className="text-sm text-neutral">{t("warningExceed")}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-white/30 text-center mt-6">
                        {t("disclaimer")}
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
