"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ArrowRight, Users } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface Platform {
    key: string;
    icon: React.ReactNode;
    name: string;
    lang: string;
    href: string;
    bullets: string[];
    borderHover: string;
}

export function CommunityContent() {
    const locale = useLocale();
    const t = useTranslations("community");
    const tc = useTranslations("common");

    const platforms: Platform[] = [
        {
            key: "x",
            icon: <XIcon className="w-8 h-8" />,
            name: "X (Twitter)",
            lang: "EN",
            href: "https://x.com/TranTradingLab",
            bullets: [
                "Real-time market calls & threads",
                "Analysis breakdowns",
                "Bold predictions & commentary",
            ],
            borderHover: "hover:border-[var(--border-strong)]",
        },
        {
            key: "threads",
            icon: <ThreadsIcon className="w-8 h-8" />,
            name: "Threads",
            lang: "EN",
            href: "https://www.threads.com/@_trantradinglab_",
            bullets: [
                "Market discussions & polls",
                "Community debates",
                "Quick takes on price action",
            ],
            borderHover: "hover:border-[var(--border-strong)]",
        },
        {
            key: "tgEn",
            icon: <TelegramIcon className="w-8 h-8" />,
            name: "Telegram EN",
            lang: "EN",
            href: "https://t.me/TranTradingLabEN",
            bullets: [
                "Daily briefs & deep dives",
                "Battle plans & position updates",
                "Weekly Switchboard signals",
            ],
            borderHover: "hover:border-[#26A5E4]/30",
        },
        {
            key: "tgKr",
            icon: <TelegramIcon className="w-8 h-8" />,
            name: "Telegram KR",
            lang: "KR",
            href: "https://t.me/TranTradingLabKR",
            bullets: [
                "한국어 시장 분석",
                "KOSPI 특화 인사이트",
                "한국 투자자 맞춤 콘텐츠",
            ],
            borderHover: "hover:border-[#26A5E4]/30",
        },
        {
            key: "kakao",
            icon: <KakaoIcon className="w-8 h-8" />,
            name: "KakaoTalk",
            lang: "KR",
            href: "https://invite.kakao.com/tc/luxHFht3xL",
            bullets: [
                "한국 커뮤니티 오픈챗",
                "실시간 소통 & 토론",
                "한국어 전용 채널",
            ],
            borderHover: "hover:border-[#FEE500]/30",
        },
    ];

    // Reorder for Korean locale: KR platforms first
    const orderedPlatforms = locale === "ko"
        ? [...platforms].sort((a, b) => {
            if (a.lang === "KR" && b.lang !== "KR") return -1;
            if (a.lang !== "KR" && b.lang === "KR") return 1;
            return 0;
        })
        : platforms;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <Users className="w-4 h-4" />
                        {t("title")}
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-6">
                        {locale === "ko" ? "800+ 트레이더와 함께" : "Join 800+ Traders"}<br />
                        <span className="text-gradient-gold">{locale === "ko" ? "글로벌 커뮤니티" : "Worldwide"}</span>
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                        {locale === "ko"
                            ? "5개 플랫폼. 2개 언어. 하나의 미션."
                            : "Five platforms. Two languages. One mission."}
                    </p>
                </section>

                {/* Platform Cards */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orderedPlatforms.map((platform) => (
                                <a
                                    key={platform.key}
                                    href={platform.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] ${platform.borderHover} transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] group h-full`}
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="text-[var(--text-primary)]">
                                            {platform.icon}
                                        </div>
                                        <span className="text-overline text-[var(--text-muted)]">
                                            {platform.lang}
                                        </span>
                                    </div>

                                    <h2 className="text-card-title text-[var(--text-primary)] mb-4">
                                        {platform.name}
                                    </h2>

                                    <ul className="space-y-2 mb-6">
                                        {platform.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-tertiary)]">
                                                <span className="text-accent mt-1 shrink-0">•</span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all">
                                        {locale === "ko" ? "참여하기" : "Join Now"}
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </a>
                            ))}
                        </div>

                        <p className="text-center text-sm text-[var(--text-muted)] mt-10">
                            {tc("freeToJoin")} · {locale === "ko" ? "무료 가입" : "Always free"}
                        </p>
                    </section>
                </SectionReveal>
            </main>
            <Footer />
        </>
    );
}
