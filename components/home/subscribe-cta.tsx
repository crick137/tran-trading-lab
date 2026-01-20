"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Send } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export function SubscribeCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
            <div className="absolute inset-0 bg-grid opacity-50" />

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        매일 아침, 시장 인사이트를 받아보세요
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        텔레그램 채널과 이메일 뉴스레터로 매일 아침 시장 분석 리포트와
                        트레이딩 아이디어를 무료로 제공합니다.
                    </p>

                    {/* Newsletter Form */}
                    <div className="mb-8">
                        <NewsletterForm />
                    </div>

                    {/* Or divider */}
                    <div className="flex items-center gap-4 max-w-md mx-auto mb-8">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-muted-foreground text-sm">또는</span>
                        <div className="flex-1 h-px bg-border/50" />
                    </div>

                    {/* Telegram Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="group px-8 py-4 rounded-lg bg-gradient-to-r from-[#229ED9] to-[#1E88C2] text-white font-semibold transition-all hover:shadow-xl hover:shadow-[#229ED9]/30 flex items-center gap-3"
                        >
                            <Send className="w-5 h-5" />
                            텔레그램 채널 가입
                        </Link>

                        <span className="text-muted-foreground text-sm">
                            <AnimatedCounter value={5000} suffix="+" /> 투자자가 함께합니다
                        </span>
                    </div>
                </motion.div>

                {/* Feature highlights with animated counters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
                >
                    {[
                        { label: "매일 아침 시장 브리핑", value: "08:00 KST" },
                        { label: "실시간 트레이딩 시그널", value: "즉시 알림" },
                        { label: "주간 종합 리포트", value: "매주 일요일" },
                    ].map((item) => (
                        <div key={item.label} className="text-center">
                            <p className="text-2xl font-bold text-gradient-gold mb-1">
                                {item.value}
                            </p>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
