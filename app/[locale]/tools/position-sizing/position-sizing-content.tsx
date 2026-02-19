"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Calculator, AlertTriangle } from "lucide-react";

export function PositionSizingContent() {
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

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <Calculator className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{t("title")}</h1>
                        <p className="text-[var(--text-tertiary)]">{t("subtitle")}</p>
                    </div>

                    {/* Calculator */}
                    <div className="p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] space-y-6">
                        <div>
                            <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("accountSize")}</label>
                            <input
                                type="number"
                                value={accountSize}
                                onChange={(e) => setAccountSize(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("riskPercent")}</label>
                            <input
                                type="number"
                                value={riskPercent}
                                onChange={(e) => setRiskPercent(Number(e.target.value))}
                                step="0.5"
                                min="0.1"
                                max="10"
                                className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("entryPrice")}</label>
                                <input
                                    type="number"
                                    value={entryPrice}
                                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("stopPrice")}</label>
                                <input
                                    type="number"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-primary border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                                />
                            </div>
                        </div>

                        <hr className="border-[var(--border-subtle)]" />

                        {/* Results */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-tertiary)]">{t("maxLoss")}</span>
                                <span className="text-bearish font-semibold">{formatCurrency(riskAmount)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[var(--text-tertiary)]">{t("positionSize")}</span>
                                <span className="text-accent font-bold text-xl font-data">{positionSize.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-tertiary)]">{t("totalValue")}</span>
                                <span className="text-[var(--text-primary)] font-data">{formatCurrency(totalValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-tertiary)]">{t("accountPercent")}</span>
                                <span className="text-[var(--text-primary)] font-data">{percentOfAccount.toFixed(1)}%</span>
                            </div>
                        </div>

                        {percentOfAccount > 50 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-neutral/10 border border-neutral/30">
                                <AlertTriangle className="w-4 h-4 text-neutral mt-0.5 shrink-0" />
                                <p className="text-sm text-neutral">{t("warningExceed")}</p>
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
