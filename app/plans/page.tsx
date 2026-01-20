"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "트레이딩 입문자를 위한 필수 리소스",
        features: [
            { name: "일일 시장 브리핑 (요약)", included: true },
            { name: "지난 리포트 열람 (최근 3일)", included: true },
            { name: "트레이딩 기초 가이드", included: true },
            { name: "기본 포지션 계산기", included: true },
            { name: "전체 리포트 열람", included: false },
            { name: "실시간 시그널 알림", included: false },
            { name: "SMC/ORB 심화 강의", included: false },
        ],
        cta: "시작하기",
        href: "/start",
        popular: false,
    },
    {
        name: "Pro",
        price: "Coming Soon",
        description: "본격적인 트레이딩을 위한 프리미엄 솔루션",
        features: [
            { name: "일일 시장 브리핑 (전체)", included: true },
            { name: "모든 리포트 및 아카이브 열람", included: true },
            { name: "실전 트레이딩 전략 (SMC, ORB)", included: true },
            { name: "실시간 트레이딩 시그널 (텔레그램)", included: true },
            { name: "고급 도구 및 템플릿", included: true },
            { name: "회원 전용 커뮤니티", included: true },
            { name: "1:1 멘토링 기회", included: false }, // Future feature
        ],
        cta: "대기 명단 등록",
        href: "https://t.me/TranTradingLab",
        popular: true,
    },
];

export default function PlansPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            투자 여정에 맞는 플랜을 선택하세요
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            무료로 시작하고, 준비가 되었을 때 프로 기능으로 업그레이드하세요.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? "bg-card border-gold shadow-lg shadow-gold/10"
                                    : "bg-card/50 border-border/50"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-background text-sm font-bold">
                                        기다리는 중
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="text-4xl font-bold text-gradient-gold mb-2">
                                        {plan.price === "0" ? "무료" : plan.price}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature.name} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-gold flex-shrink-0" />
                                            ) : (
                                                <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0" />
                                            )}
                                            <span
                                                className={`text-sm ${feature.included
                                                    ? "text-foreground"
                                                    : "text-muted-foreground/50"
                                                    }`}
                                            >
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.href}
                                    className={`block w-full py-3 rounded-lg text-center font-bold transition-all ${plan.popular
                                        ? "bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-lg hover:shadow-gold/20"
                                        : "bg-background border border-border hover:border-gold/50 text-foreground"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground mb-4">
                            더 궁금한 점이 있으신가요?
                        </p>
                        <Link
                            href="/faq"
                            className="text-gold hover:underline"
                        >
                            자주 묻는 질문 확인하기
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
