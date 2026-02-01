import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/src/config/site.config";
import { Send, FileText, TrendingUp, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "구독하기 | " + siteConfig.name,
    description: "프리미엄 시장 리서치와 트레이딩 인사이트를 받아보세요.",
};

const benefits = [
    { icon: FileText, text: "매일 핵심 레벨 및 시나리오 브리핑" },
    { icon: TrendingUp, text: "SMC 기반 실시간 시장 분석" },
    { icon: Shield, text: "리스크 관리 체크리스트" },
];

const includedFeatures = [
    "데일리 마켓 브리핑",
    "주요 레벨 알림",
    "SMC 분석 리포트",
    "커뮤니티 Q&A 접근",
    "플레이북 자료",
    "경제 캘린더 분석",
];

export default function SubscribePage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            시장을 <span className="text-gradient-gold">구조</span>로 읽으세요
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {siteConfig.tagline} 기반의 리서치를 받아보세요.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all"
                            >
                                <benefit.icon className="w-8 h-8 text-gold mb-4" />
                                <p className="text-foreground font-medium">{benefit.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main CTA Card */}
                    <div className="bg-gradient-to-br from-card to-background border border-border/50 rounded-2xl p-8 mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-2">무료 구독</h2>
                            <p className="text-muted-foreground">
                                텔레그램 채널에서 실시간 업데이트를 받아보세요
                            </p>
                        </div>

                        {/* Feature List */}
                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                            {includedFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={siteConfig.social.telegram}
                                target="_blank"
                                className="group px-8 py-4 rounded-lg bg-[#229ED9] hover:bg-[#1c8ac2] text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                텔레그램 채널 가입
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href={siteConfig.cta.secondary.href}
                                className="px-8 py-4 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 font-semibold transition-all text-center"
                            >
                                샘플 리포트 먼저 보기
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center">
                        <p className="text-sm text-amber-400/80 font-medium">
                            {siteConfig.riskDisclaimer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            본 서비스는 교육 목적으로만 제공됩니다. 투자 결정은 본인의 책임입니다.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
