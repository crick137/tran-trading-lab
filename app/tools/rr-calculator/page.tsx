"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

export default function RRCalculatorPage() {
    const [entryPrice, setEntryPrice] = useState<number>(100);
    const [stopPrice, setStopPrice] = useState<number>(95);
    const [targetPrice, setTargetPrice] = useState<number>(115);

    const isLong = targetPrice > entryPrice;
    const risk = Math.abs(entryPrice - stopPrice);
    const reward = Math.abs(targetPrice - entryPrice);
    const rr = risk > 0 ? reward / risk : 0;
    const stopPercent = ((entryPrice - stopPrice) / entryPrice) * 100;
    const targetPercent = ((targetPrice - entryPrice) / entryPrice) * 100;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "도구", href: "/tools" }, { label: "R:R 계산기" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <Calculator className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">R:R 계산기</h1>
                        <p className="text-muted-foreground">
                            리스크 리워드 비율을 계산합니다
                        </p>
                    </motion.div>

                    {/* Calculator */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-card border border-border/50 space-y-6"
                    >
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">진입가</label>
                            <input
                                type="number"
                                value={entryPrice}
                                onChange={(e) => setEntryPrice(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">손절가 (Stop Loss)</label>
                                <input
                                    type="number"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-red-500/30 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">목표가 (Take Profit)</label>
                                <input
                                    type="number"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-green-500/30 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                        </div>

                        <hr className="border-border/50" />

                        {/* Results */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {isLong ? (
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                )}
                                <span className="text-muted-foreground">{isLong ? "롱 포지션" : "숏 포지션"}</span>
                            </div>
                            <div className="text-5xl font-bold text-gold mb-2">
                                {rr.toFixed(2)}R
                            </div>
                            <p className="text-muted-foreground">리스크 리워드 비율</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <p className="text-red-500 font-semibold">{risk.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">리스크 ({Math.abs(stopPercent).toFixed(2)}%)</p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                <p className="text-green-500 font-semibold">{reward.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">리워드 ({Math.abs(targetPercent).toFixed(2)}%)</p>
                            </div>
                        </div>

                        {rr < 1 && (
                            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                                <p className="text-sm text-yellow-500">
                                    ⚠️ R:R이 1 미만입니다. 더 좋은 진입점을 찾아보세요.
                                </p>
                            </div>
                        )}
                        {rr >= 2 && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                                <p className="text-sm text-green-500">
                                    ✓ 2R 이상의 좋은 셋업입니다!
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                        * 일반적으로 최소 1.5R 이상의 거래를 권장합니다.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
