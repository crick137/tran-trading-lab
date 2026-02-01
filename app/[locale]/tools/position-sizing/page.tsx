"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Calculator, AlertTriangle } from "lucide-react";

export default function PositionSizingPage() {
    const [accountSize, setAccountSize] = useState<number>(10000000);
    const [riskPercent, setRiskPercent] = useState<number>(2);
    const [entryPrice, setEntryPrice] = useState<number>(100);
    const [stopPrice, setStopPrice] = useState<number>(95);

    const riskAmount = accountSize * (riskPercent / 100);
    const priceDiff = Math.abs(entryPrice - stopPrice);
    const positionSize = priceDiff > 0 ? riskAmount / priceDiff : 0;
    const totalValue = positionSize * entryPrice;
    const percentOfAccount = (totalValue / accountSize) * 100;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "도구", href: "/tools" }, { label: "포지션 사이징" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <Calculator className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">포지션 사이징 계산기</h1>
                        <p className="text-muted-foreground">
                            리스크 비율에 맞는 포지션 크기를 계산합니다
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
                            <label className="block text-sm text-muted-foreground mb-2">계좌 크기 (₩)</label>
                            <input
                                type="number"
                                value={accountSize}
                                onChange={(e) => setAccountSize(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">리스크 비율 (%)</label>
                            <input
                                type="number"
                                value={riskPercent}
                                onChange={(e) => setRiskPercent(Number(e.target.value))}
                                step="0.5"
                                min="0.1"
                                max="10"
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">진입가</label>
                                <input
                                    type="number"
                                    value={entryPrice}
                                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">손절가</label>
                                <input
                                    type="number"
                                    value={stopPrice}
                                    onChange={(e) => setStopPrice(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                                />
                            </div>
                        </div>

                        <hr className="border-border/50" />

                        {/* Results */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">최대 손실 금액</span>
                                <span className="text-red-500 font-semibold">₩{riskAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">포지션 크기 (수량)</span>
                                <span className="text-gold font-bold text-xl">{positionSize.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">포지션 총 가치</span>
                                <span className="text-foreground">₩{totalValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">계좌 대비 비율</span>
                                <span className="text-foreground">{percentOfAccount.toFixed(1)}%</span>
                            </div>
                        </div>

                        {percentOfAccount > 50 && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                <p className="text-sm text-yellow-500">
                                    포지션이 계좌의 50%를 초과합니다. 레버리지 사용에 주의하세요.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                        * 이 계산기는 참고용이며, 실제 투자 결정은 본인의 판단에 따라야 합니다.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
