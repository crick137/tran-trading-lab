"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowRight, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/src/config/site.config";

const communities = [
    {
        name: "Telegram",
        nameKr: "텔레그램",
        description: "실시간 시장 분석과 트레이딩 아이디어를 공유하는 메인 채널입니다.",
        features: ["실시간 시장 알림", "트레이딩 아이디어", "커뮤니티 토론", "무료 가입"],
        icon: Send,
        href: siteConfig.social.telegram,
        color: "from-blue-500 to-cyan-400",
    },
    {
        name: "KakaoTalk",
        nameKr: "카카오톡",
        description: "한국 투자자를 위한 카카오톡 오픈채팅방입니다.",
        features: ["한국어 전용", "실시간 질의응답", "시장 정보 공유", "무료 가입"],
        icon: MessageCircle,
        href: siteConfig.social.kakao,
        color: "from-yellow-400 to-amber-500",
    },
];

export default function CommunityPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-20">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm mb-6">
                                <Users className="w-4 h-4" />
                                커뮤니티
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                                    TRAN Trading Lab
                                </span>
                                <br />
                                <span className="text-foreground">커뮤니티에 참여하세요</span>
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8">
                                실시간 시장 분석, 트레이딩 아이디어, 그리고 같은 목표를 가진 투자자들과 함께하세요.
                                <br className="hidden md:block" />
                                모든 채널은 <span className="text-gold font-semibold">무료</span>로 참여할 수 있습니다.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Community Cards */}
                <section className="py-12 pb-24">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {communities.map((community, index) => (
                                <motion.div
                                    key={community.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link
                                        href={community.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <div className="relative p-8 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.1)] hover:-translate-y-2">
                                            {/* Gradient Header */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${community.color}`} />

                                            {/* Icon & Name */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center shadow-lg`}>
                                                    <community.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-gold transition-colors">
                                                        {community.name}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">{community.nameKr}</p>
                                                </div>

                                            </div>

                                            {/* Description */}
                                            <p className="text-muted-foreground mb-6">
                                                {community.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {community.features.map((feature) => (
                                                    <span
                                                        key={feature}
                                                        className="px-3 py-1 text-xs rounded-full bg-background border border-border/50 text-muted-foreground"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-gold font-medium group-hover:gap-3 transition-all">
                                                <Sparkles className="w-4 h-4" />
                                                지금 참여하기
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-16 text-center"
                        >
                            <p className="text-muted-foreground">
                                더 많은 채널이 곧 추가될 예정입니다.
                                <br />
                                문의사항은{" "}
                                <a
                                    href={`mailto:${siteConfig.social.email}`}
                                    className="text-gold hover:underline"
                                >
                                    {siteConfig.social.email}
                                </a>
                                으로 연락주세요.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
