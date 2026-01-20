"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Rocket, TrendingUp, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

const paths = [
    {
        id: "beginner",
        icon: Rocket,
        title: "초보 투자자",
        subtitle: "처음 시작하시는 분",
        color: "from-emerald-500/20 to-emerald-500/5",
        borderColor: "border-emerald-500/30",
        steps: [
            { label: "Sample 리포트 읽기", href: "/sample" },
            { label: "용어집 확인", href: "/glossary" },
            { label: "SMC 기초 배우기", href: "/playbooks" },
            { label: "Telegram 가입", href: "https://t.me/TranTradingLab" },
        ],
    },
    {
        id: "trader",
        icon: TrendingUp,
        title: "단타/스윙 트레이더",
        subtitle: "기술적 분석에 관심 있는 분",
        color: "from-gold/20 to-gold/5",
        borderColor: "border-gold/30",
        steps: [
            { label: "SMC/ORB 전략 학습", href: "/playbooks" },
            { label: "도구 활용하기", href: "/tools" },
            { label: "매일 브리핑 받기", href: "/briefings" },
            { label: "실시간 알림 설정", href: "https://t.me/TranTradingLab" },
        ],
    },
    {
        id: "macro",
        icon: Globe,
        title: "거시 경제 관심",
        subtitle: "글로벌 시장 분석이 필요한 분",
        color: "from-blue-500/20 to-blue-500/5",
        borderColor: "border-blue-500/30",
        steps: [
            { label: "주간 리포트 구독", href: "/reports" },
            { label: "중국 뉴스 번역", href: "/blog?category=news" },
            { label: "경제 캘린더 확인", href: "/briefings" },
            { label: "뉴스레터 구독", href: "/#subscribe" },
        ],
    },
];

export default function StartPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "시작하기" }]} />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            <span className="text-gradient-gold">시작하기</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            투자 스타일에 맞는 경로를 선택하세요.
                            TranTradingLab이 단계별로 안내해 드립니다.
                        </p>
                    </motion.div>

                    {/* Paths */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {paths.map((path, index) => (
                            <motion.div
                                key={path.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl bg-gradient-to-b ${path.color} border ${path.borderColor}`}
                            >
                                <div className="w-14 h-14 rounded-lg bg-card flex items-center justify-center mb-4">
                                    <path.icon className="w-7 h-7 text-gold" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-1">{path.title}</h2>
                                <p className="text-sm text-muted-foreground mb-6">{path.subtitle}</p>

                                <div className="space-y-3">
                                    {path.steps.map((step, i) => (
                                        <Link
                                            key={i}
                                            href={step.href}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-card border border-border/50 flex items-center justify-center text-xs font-medium group-hover:border-gold/50 group-hover:text-gold transition-colors">
                                                {i + 1}
                                            </span>
                                            {step.label}
                                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* What We Provide */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <div className="p-6 rounded-xl bg-card/50 border border-border/50">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                제공하는 것
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>✓ 매일 시장 분석 및 브리핑</li>
                                <li>✓ SMC/ORB 트레이딩 전략 교육</li>
                                <li>✓ 중국 금융 뉴스 한국어 번역</li>
                                <li>✓ 포지션 사이징, R:R 계산 도구</li>
                                <li>✓ 주간 종합 리포트</li>
                                <li>✓ 텔레그램 커뮤니티 접근</li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-card/50 border border-red-500/20">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="text-red-500">✕</span>
                                제공하지 않는 것
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>✕ 매수/매도 추천 (투자 권유 아님)</li>
                                <li>✕ 수익 보장</li>
                                <li>✕ 1:1 투자 상담</li>
                                <li>✕ 자동매매 시그널</li>
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground/70">
                                ⚠️ 모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-muted-foreground mb-4">첫 번째 리포트를 읽어보세요</p>
                        <Link
                            href="/sample"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all"
                        >
                            Sample 리포트 보기
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
