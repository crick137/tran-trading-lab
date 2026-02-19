"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { ArrowRight, Globe, Rocket } from "lucide-react";
import { TelegramIcon, KakaoIcon } from "@/lib/social-icons";

export function CommunityContent() {
    const locale = useLocale();
    const t = useTranslations("community");
    const tc = useTranslations("common");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const cardsRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });

    const links = [
        {
            name: t("tgEnName"),
            label: t("tgEnLabel"),
            description: t("tgEnDesc"),
            descriptionKr: t("tgEnDescKr"),
            icon: TelegramIcon,
            href: "https://t.me/TranTradingLabEN",
            iconColor: "text-[#29b6f6]",
            borderHover: "hover:border-[#29b6f6]/30",
        },
        {
            name: t("tgKrName"),
            label: t("tgKrLabel"),
            description: t("tgKrDesc"),
            descriptionKr: t("tgKrDescKr"),
            icon: TelegramIcon,
            href: "https://t.me/TranTradingLabKR",
            iconColor: "text-[#29b6f6]",
            borderHover: "hover:border-[#29b6f6]/30",
        },
        {
            name: t("kakaoName"),
            label: t("kakaoLabel"),
            description: t("kakaoDesc"),
            descriptionKr: t("kakaoDescKr"),
            icon: KakaoIcon,
            href: "https://invite.kakao.com/tc/luxHFht3xL",
            iconColor: "text-[#fee500]",
            borderHover: "hover:border-[#fee500]/30",
        },
        {
            name: t("startName"),
            label: t("startLabel"),
            description: t("startDesc"),
            descriptionKr: t("startDescKr"),
            icon: Rocket,
            href: `/${locale}/start`,
            iconColor: "text-gold",
            borderHover: "hover:border-gold/30",
            isInternal: true,
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div ref={heroRef} className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold/10 mb-6">
                            <Globe className="w-10 h-10 text-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-gradient-gold">TRAN Trading Lab</span>
                        </h1>
                        <p className="text-lg text-white/40 mb-2">
                            {t("title")} · {t("subtitle")}
                        </p>
                        <p className="text-sm text-white/30">
                            {t("joinOurCommunity")}
                        </p>
                    </div>

                    {/* Link Cards */}
                    <div ref={cardsRef} className="flex flex-col gap-4 max-w-lg mx-auto mb-12">
                        {links.map((link) => (
                            <TiltCard key={link.name}>
                                <Link
                                    href={link.href}
                                    target={link.isInternal ? "_self" : "_blank"}
                                    rel={link.isInternal ? undefined : "noopener noreferrer"}
                                    className={`block p-5 rounded-xl bg-cv-elevated border border-white/5 ${link.borderHover} card-hover transition-colors group`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-white/90 group-hover:text-gold transition-colors">
                                                    {link.name}
                                                </h2>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                                                    {link.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/40 truncate">
                                                {link.description} — {link.descriptionKr}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-gold transition-all group-hover:translate-x-1 shrink-0" />
                                    </div>
                                </Link>
                            </TiltCard>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gold mb-4">
                            {tc("freeToJoin")} · 免费加入 · 무료 가입
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
