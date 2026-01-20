"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Crown, Check, X, Mail } from "lucide-react";

const features = [
    { name: "일간 시장 브리핑", free: true, pro: true },
    { name: "주간 종합 리포트", free: true, pro: true },
    { name: "블로그 아티클", free: true, pro: true },
    { name: "용어집 & 플레이북", free: true, pro: true },
    { name: "트레이딩 도구", free: true, pro: true },
    { name: "텔레그램 커뮤니티", free: true, pro: true },
    { name: "실시간 시그널 알림", free: false, pro: true },
    { name: "우선 Q&A 응답", free: false, pro: true },
    { name: "프리미엄 플레이북", free: false, pro: true },
    { name: "월간 라이브 세션", free: false, pro: true },
    { name: "1:1 피드백", free: false, pro: true },
];

export default function PlansPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "플랜" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-4">플랜 선택</h1>
                        <p className="text-lg text-muted-foreground">
                            무료로 시작하고, 필요하면 업그레이드하세요
                        </p>
                    </motion.div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Free Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-xl bg-card border border-border/50"
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-2">Free</h2>
                            <p className="text-muted-foreground mb-6">모든 핵심 기능 무료 이용</p>
                            <div className="text-4xl font-bold text-foreground mb-6">
                                ₩0 <span className="text-lg text-muted-foreground font-normal">/월</span>
                            </div>
                            <Link
                                href="https://t.me/TranTradingLab"
                                target="_blank"
                                className="block w-full py-3 rounded-lg bg-card border border-gold/50 text-gold font-medium text-center hover:bg-gold/10 transition-all mb-8"
                            >
                                무료 시작하기
                            </Link>
                            <ul className="space-y-3">
                                {features.map((feature) => (
                                    <li key={feature.name} className="flex items-center gap-3">
                                        {feature.free ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <X className="w-4 h-4 text-muted-foreground/50" />
                                        )}
                                        <span className={feature.free ? "text-foreground" : "text-muted-foreground/50"}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-xl bg-gradient-to-b from-gold/10 to-transparent border border-gold/30 relative"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-background text-sm font-medium flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Pro
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Pro</h2>
                            <p className="text-muted-foreground mb-6">모든 프리미엄 기능 포함</p>
                            <div className="text-4xl font-bold text-foreground mb-2">
                                Coming Soon
                            </div>
                            <p className="text-sm text-muted-foreground mb-6">출시 알림을 받으세요</p>
                            <button
                                className="block w-full py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium text-center hover:shadow-lg hover:shadow-gold/30 transition-all mb-8 flex items-center justify-center gap-2"
                                onClick={() => {
                                    const email = prompt("알림 받을 이메일을 입력하세요:");
                                    if (email) {
                                        const subscribers = JSON.parse(localStorage.getItem("pro_waitlist") || "[]");
                                        if (!subscribers.includes(email)) {
                                            subscribers.push(email);
                                            localStorage.setItem("pro_waitlist", JSON.stringify(subscribers));
                                        }
                                        alert("감사합니다! Pro 출시 시 알림을 보내드리겠습니다.");
                                    }
                                }}
                            >
                                <Mail className="w-4 h-4" />
                                대기자 등록
                            </button>
                            <ul className="space-y-3">
                                {features.map((feature) => (
                                    <li key={feature.name} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-gold" />
                                        <span className="text-foreground">{feature.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* FAQ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <p className="text-muted-foreground">
                            질문이 있으신가요?{" "}
                            <Link href="/faq" className="text-gold hover:underline">
                                FAQ 확인하기
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
