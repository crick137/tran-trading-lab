"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { GraduationCap, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

const modules = [
    {
        id: "smc-101",
        title: "SMC 기초",
        description: "Smart Money Concept의 핵심 개념 이해",
        lessons: 5,
        duration: "45분",
        free: true,
        topics: ["SMC란?", "시장 구조", "Order Block", "Fair Value Gap", "Liquidity"],
    },
    {
        id: "order-block",
        title: "Order Block 심화",
        description: "OB 식별과 트레이딩 적용",
        lessons: 4,
        duration: "40분",
        free: true,
        topics: ["OB 유형", "유효한 OB 조건", "진입 타이밍", "실전 예시"],
    },
    {
        id: "fvg-mastery",
        title: "FVG 마스터리",
        description: "Fair Value Gap 완벽 활용",
        lessons: 4,
        duration: "35분",
        free: true,
        topics: ["FVG 정의", "되돌림 확률", "FVG + OB 조합", "실전 적용"],
    },
    {
        id: "liquidity",
        title: "Liquidity 사냥",
        description: "유동성 구역 파악과 활용",
        lessons: 5,
        duration: "50분",
        free: false,
        topics: ["유동성이란?", "Sweep vs. Grab", "BSL/SSL", "Stop Hunt 패턴", "진입 전략"],
    },
    {
        id: "orb-strategy",
        title: "ORB 전략",
        description: "시가 범위 돌파 전략 마스터",
        lessons: 6,
        duration: "55분",
        free: true,
        topics: ["ORB 원리", "시간대 설정", "필터링 조건", "진입/청산", "한국 시장 적용", "백테스트"],
    },
    {
        id: "risk-management",
        title: "리스크 관리",
        description: "자본 보존을 위한 필수 스킬",
        lessons: 4,
        duration: "30분",
        free: true,
        topics: ["포지션 사이징", "R:R 계산", "손절 원칙", "드로우다운 관리"],
    },
];

export default function PlaybooksPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "플레이북" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <GraduationCap className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">트레이딩 플레이북</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            SMC, ORB, 리스크 관리까지 - 단계별로 배우는 트레이딩 교육 과정
                        </p>
                    </motion.div>

                    {/* Modules Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-gold/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                                        {module.title}
                                    </h3>
                                    {module.free ? (
                                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500">무료</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> 준비중
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                    <span>{module.lessons}개 레슨</span>
                                    <span>•</span>
                                    <span>{module.duration}</span>
                                </div>
                                <div className="space-y-1 mb-4">
                                    {module.topics.slice(0, 3).map((topic) => (
                                        <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-3 h-3 text-gold" />
                                            {topic}
                                        </div>
                                    ))}
                                    {module.topics.length > 3 && (
                                        <div className="text-sm text-muted-foreground">
                                            +{module.topics.length - 3}개 더...
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href={module.free ? `/playbooks/${module.id}` : "/plans"}
                                    className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-all ${module.free
                                            ? "bg-gold/10 text-gold hover:bg-gold/20"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {module.free ? "시작하기" : "플랜 보기"}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
