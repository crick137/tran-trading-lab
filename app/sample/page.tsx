"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowRight, Send, Mail } from "lucide-react";

export default function SamplePage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "Sample 리포트" }]} />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold mb-4">
                            Sample 리포트
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            KOSPI 일간 시장 분석
                        </h1>
                        <p className="text-muted-foreground">
                            2024년 1월 20일 | 이런 형식으로 매일 브리핑을 받아보실 수 있습니다.
                        </p>
                    </motion.div>

                    {/* TL;DR */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-card border border-border/50 mb-8"
                    >
                        <h2 className="text-lg font-semibold text-gold mb-4">📌 TL;DR (핵심 요약)</h2>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                반도체 섹터 강세 지속, SK하이닉스 HBM 기대감 반영
                            </li>
                            <li className="flex items-start gap-2">
                                <Minus className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                                외국인 선물 매도 우위, 관망세 필요
                            </li>
                            <li className="flex items-start gap-2">
                                <TrendingDown className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                USDKRW 1,330원 저항 테스트 중
                            </li>
                        </ul>
                    </motion.div>

                    {/* Key Levels Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-lg font-semibold text-foreground mb-4">📊 주요 레벨</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">자산</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">지지</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">현재가</th>
                                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">저항</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/30">
                                        <td className="py-3 px-4 text-foreground">KOSPI</td>
                                        <td className="py-3 px-4 text-right text-green-500">2,480</td>
                                        <td className="py-3 px-4 text-right text-foreground font-medium">2,512</td>
                                        <td className="py-3 px-4 text-right text-red-500">2,540</td>
                                    </tr>
                                    <tr className="border-b border-border/30">
                                        <td className="py-3 px-4 text-foreground">삼성전자</td>
                                        <td className="py-3 px-4 text-right text-green-500">72,000</td>
                                        <td className="py-3 px-4 text-right text-foreground font-medium">74,500</td>
                                        <td className="py-3 px-4 text-right text-red-500">76,000</td>
                                    </tr>
                                    <tr className="border-b border-border/30">
                                        <td className="py-3 px-4 text-foreground">USDKRW</td>
                                        <td className="py-3 px-4 text-right text-green-500">1,310</td>
                                        <td className="py-3 px-4 text-right text-foreground font-medium">1,325</td>
                                        <td className="py-3 px-4 text-right text-red-500">1,330</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* 3 Scenarios */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-lg font-semibold text-foreground mb-4">🎯 시나리오 분석</h2>
                        <div className="grid gap-4">
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                <h3 className="font-medium text-green-500 mb-2">🟢 상승 시나리오</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    KOSPI 2,520 돌파 시 → 2,540~2,560 타겟
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    트리거: 외국인 선물 순매수 전환, 반도체 섹터 추가 강세
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <h3 className="font-medium text-yellow-500 mb-2">🟡 횡보 시나리오</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    2,490~2,520 박스권 등락
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    트리거: 주요 이벤트 앞두고 관망세, 거래량 감소
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <h3 className="font-medium text-red-500 mb-2">🔴 하락 시나리오</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    2,480 이탈 시 → 2,450~2,460 지지 테스트
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    트리거: 원화 약세 가속, 외국인 현선물 동반 매도
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Risk */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 rounded-lg bg-card border border-yellow-500/30 mb-12"
                    >
                        <h3 className="font-medium text-foreground flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            리스크 요인 및 무효화 조건
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• 중국 경기 지표 예상 하회 시 시나리오 무효화</li>
                            <li>• FOMC 서프라이즈 발언 시 급변동 주의</li>
                            <li>• 삼성전자 실적 발표 (1/25) 전후 변동성 확대 예상</li>
                        </ul>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-8 rounded-xl bg-gradient-to-b from-gold/10 to-transparent border border-gold/30 text-center"
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            매일 이런 분석을 받아보세요
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            텔레그램 또는 이메일로 매일 아침 인사이트를 전달해 드립니다.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="https://t.me/TranTradingLab"
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#229ED9] text-white font-medium hover:shadow-lg transition-all"
                            >
                                <Send className="w-4 h-4" />
                                텔레그램에서 받기
                            </Link>
                            <Link
                                href="/#subscribe"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium hover:shadow-lg hover:shadow-gold/30 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                이메일로 받기
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
