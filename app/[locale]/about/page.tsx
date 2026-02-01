import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BarChart3, Target, Newspaper, Users, Send } from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: BarChart3,
        title: "시장 분석",
        description: "매일 아침 제공되는 전문 시장 분석 리포트. 글로벌 매크로부터 한국 시장 섹터별 분석까지.",
    },
    {
        icon: Target,
        title: "트레이딩 전략",
        description: "SMC, ORB 등 검증된 트레이딩 전략 교육. 실전에서 바로 적용 가능한 체계적인 방법론.",
    },
    {
        icon: Newspaper,
        title: "뉴스 번역",
        description: "중국 금융 뉴스의 신속한 한국어 번역. 한국 시장에 영향을 미치는 중요 뉴스를 빠르게 전달.",
    },
];

const stats = [
    { value: "5,000+", label: "커뮤니티 멤버" },
    { value: "500+", label: "발행 콘텐츠" },
    { value: "2년+", label: "서비스 기간" },
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm text-muted-foreground mb-8">
                        <Users className="w-4 h-4" />
                        About TranTradingLab
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        한국 투자자를 위한
                        <br />
                        <span className="text-gradient-gold">전문 금융 교육 플랫폼</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        TranTradingLab은 한국 개인 투자자들에게 전문적인 시장 분석과
                        트레이딩 전략을 제공하는 교육 플랫폼입니다.
                        2022년 시작 이래로 수천 명의 투자자들과 함께 성장해왔습니다.
                    </p>
                </section>

                {/* Stats Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-3 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Services Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-foreground text-center mb-12">
                        서비스 내용
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="p-6 rounded-xl bg-card border border-border/50 text-center"
                            >
                                <div className="w-12 h-12 mx-auto rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                                    <service.icon className="w-6 h-6 text-gold" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="p-8 rounded-2xl bg-card border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            우리의 미션
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            투자의 세계는 복잡하고 빠르게 변화합니다.
                            TranTradingLab은 정보의 비대칭을 줄이고, 개인 투자자들이
                            전문가 수준의 분석과 전략으로 시장에 참여할 수 있도록 돕습니다.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            우리는 단순한 정보 제공을 넘어, 투자자들이 스스로 시장을
                            분석하고 판단할 수 있는 능력을 기르는 것을 목표로 합니다.
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        함께 성장하세요
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        텔레그램 채널에 가입하고 매일 아침 시장 인사이트를 받아보세요.
                    </p>
                    <Link
                        href="https://t.me/TranTradingLab"
                        target="_blank"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-[#229ED9] to-[#1E88C2] text-white font-semibold transition-all hover:shadow-xl hover:shadow-[#229ED9]/30"
                    >
                        <Send className="w-5 h-5" />
                        텔레그램 채널 가입
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
}
