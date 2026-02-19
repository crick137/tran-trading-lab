"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface SocialPlatform {
    key: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    borderHover: string;
}

const platforms: SocialPlatform[] = [
    {
        key: "x",
        href: "https://x.com/TranTradingLab",
        icon: <XIcon className="w-5 h-5" />,
        color: "text-[var(--text-primary)]",
        borderHover: "hover:border-[var(--border-strong)]",
    },
    {
        key: "threads",
        href: "https://www.threads.com/@_trantradinglab_",
        icon: <ThreadsIcon className="w-5 h-5" />,
        color: "text-[var(--text-primary)]",
        borderHover: "hover:border-[var(--border-strong)]",
    },
    {
        key: "tgEn",
        href: "https://t.me/TranTradingLabEN",
        icon: <TelegramIcon className="w-5 h-5" />,
        color: "text-[#29b6f6]",
        borderHover: "hover:border-[#29b6f6]/30",
    },
    {
        key: "tgKr",
        href: "https://t.me/TranTradingLabKR",
        icon: <TelegramIcon className="w-5 h-5" />,
        color: "text-[#29b6f6]",
        borderHover: "hover:border-[#29b6f6]/30",
    },
    {
        key: "kakao",
        href: "https://invite.kakao.com/tc/luxHFht3xL",
        icon: <KakaoIcon className="w-5 h-5" />,
        color: "text-[#fee500]",
        borderHover: "hover:border-[#fee500]/30",
    },
];

export function CommunitySection() {
    const t = useTranslations("home");
    return (
        <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-section text-[var(--text-primary)] mb-4">
                        {t("communityTitle")}
                    </h2>
                    <p className="text-sm text-[var(--text-tertiary)] max-w-[680px] mx-auto">
                        {t("communitySubtitle")}
                    </p>
                </div>

                {/* Platform Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {platforms.map((platform) => (
                        <a
                            key={platform.key}
                            href={platform.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-6 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] ${platform.borderHover} transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-full group`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${platform.color}`}>
                                    {platform.icon}
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-ghost)] group-hover:text-[var(--text-secondary)] transition-colors" />
                            </div>

                            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                {t(`community${platform.key.charAt(0).toUpperCase() + platform.key.slice(1)}Name`)}
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                                {t(`community${platform.key.charAt(0).toUpperCase() + platform.key.slice(1)}Desc`)}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
