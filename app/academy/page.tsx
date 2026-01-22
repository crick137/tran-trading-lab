import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/src/config/site.config";
import { BookOpen, GraduationCap, Target, ArrowRight, Layers, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "아카데미 | " + siteConfig.name,
    description: "체계적인 트레이딩 교육 - SMC, Liquidity, Timing의 핵심을 배우세요.",
};

const learningModules = [
    {
        id: "foundations",
        title: "기초 과정",
        description: "시장 구조와 가격 행동의 기본 원리를 이해합니다.",
        icon: Layers,
        lessons: 8,
        duration: "2주",
        topics: ["시장 구조 이해", "캔들스틱 패턴", "지지/저항 개념", "추세 분석"],
    },
    {
        id: "smc",
        title: "SMC 심화",
        description: "Smart Money Concepts의 핵심 개념과 적용법을 배웁니다.",
        icon: Target,
        lessons: 12,
        duration: "4주",
        topics: ["Order Block", "Fair Value Gap", "Liquidity Sweep", "Break of Structure"],
    },
    {
        id: "advanced",
        title: "고급 전략",
        description: "실전 트레이딩을 위한 종합 전략과 리스크 관리.",
        icon: TrendingUp,
        lessons: 10,
        duration: "3주",
        topics: ["멀티 타임프레임 분석", "엔트리 전략", "포지션 사이징", "심리 관리"],
    },
];

const quickLinks = [
    { href: "/playbooks", label: "플레이북", description: "트레이딩 시스템 가이드" },
    { href: "/glossary", label: "용어집", description: "SMC 핵심 용어 정리" },
    { href: "/tools", label: "도구", description: "분석 도구 모음" },
];

export default function AcademyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
                            <GraduationCap className="w-4 h-4" />
                            체계적인 트레이딩 교육
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            아카데미
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {siteConfig.tagline}의 핵심 원리를 체계적으로 학습하세요.
                        </p>
                    </div>

                    {/* Learning Path */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-gold" />
                            학습 경로
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {learningModules.map((module, index) => (
                                <div
                                    key={module.id}
                                    className="relative p-6 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all group"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold text-background font-bold flex items-center justify-center text-sm">
                                        {index + 1}
                                    </div>

                                    <module.icon className="w-10 h-10 text-gold mb-4" />
                                    <h3 className="text-xl font-bold text-foreground mb-2">{module.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4">{module.description}</p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {module.lessons} 레슨
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {module.duration}
                                        </span>
                                    </div>

                                    {/* Topics */}
                                    <div className="space-y-1">
                                        {module.topics.map((topic) => (
                                            <div key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-gold/50" />
                                                {topic}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Links */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-foreground mb-8">빠른 링크</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="p-4 rounded-lg bg-card border border-border/50 hover:border-gold/30 transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                                            {link.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{link.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center bg-gradient-to-br from-card to-background border border-border/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            학습을 시작하세요
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            텔레그램 채널에서 실시간 교육 자료와 시장 분석을 받아보세요.
                        </p>
                        <Link
                            href={siteConfig.social.telegram}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-semibold transition-all hover:shadow-xl hover:shadow-gold/30"
                        >
                            커뮤니티 참여하기
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="text-xs text-amber-400/80 font-medium mt-6">
                            {siteConfig.riskDisclaimer}
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
