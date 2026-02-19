"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface SocialPlatform {
    key: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
}

const platforms: SocialPlatform[] = [
    {
        key: "x",
        href: "https://x.com/TranTradingLab",
        icon: <XIcon className="w-5 h-5" />,
        color: "text-white",
        borderColor: "border-[var(--border-default)] hover:border-[var(--border-strong)]",
    },
    {
        key: "threads",
        href: "https://www.threads.com/@_trantradinglab_",
        icon: <ThreadsIcon className="w-5 h-5" />,
        color: "text-white",
        borderColor: "border-[var(--border-default)] hover:border-[var(--border-strong)]",
    },
    {
        key: "tgEn",
        href: "https://t.me/TranTradingLabEN",
        icon: <TelegramIcon className="w-5 h-5" />,
        color: "text-[#29b6f6]",
        borderColor: "border-[#29b6f6]/10 hover:border-[#29b6f6]/30",
    },
    {
        key: "tgKr",
        href: "https://t.me/TranTradingLabKR",
        icon: <TelegramIcon className="w-5 h-5" />,
        color: "text-[#29b6f6]",
        borderColor: "border-[#29b6f6]/10 hover:border-[#29b6f6]/30",
    },
    {
        key: "kakao",
        href: "https://invite.kakao.com/tc/luxHFht3xL",
        icon: <KakaoIcon className="w-5 h-5" />,
        color: "text-[#fee500]",
        borderColor: "border-[#fee500]/10 hover:border-[#fee500]/30",
    },
];

export function CommunitySection() {
    const t = useTranslations("home");
    return (
        <section className="py-section-mobile lg:py-section px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-label text-[var(--text-tertiary)]">
                        {t("communityTitle")}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-3">
                        {t("communitySubtitle")}
                    </p>
                </div>

                {/* Platform Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {platforms.map((platform) => (
                        <a
                            key={platform.key}
                            href={platform.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-4 rounded-xl bg-cv-elevated border ${platform.borderColor} card-hover h-full transition-colors group`}
                        >
                            <div className="flex items-center justify-between mb-3">
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
