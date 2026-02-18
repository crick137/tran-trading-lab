"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Lamp } from "@/components/ui/aceternity/lamp";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

interface SocialPlatform {
    key: string;
    href: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function ThreadsIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.264 1.33-3.03.858-.712 2.042-1.108 3.412-1.142 1.006-.025 1.937.09 2.776.343-.078-1.363-.54-2.392-1.373-3.015-.927-.694-2.2-.974-3.594-.974l-.07.001c-1.724.028-3.09.567-4.06 1.601l-1.418-1.42C6.03 3.754 7.87 3.07 10.15 3.034c1.87-.013 3.497.38 4.84 1.384 1.418 1.06 2.16 2.6 2.307 4.556.797.264 1.522.638 2.158 1.122 1.078.82 1.853 1.913 2.237 3.155.482 1.56.386 4.003-1.64 6.039-1.77 1.778-3.962 2.608-7.1 2.632z" />
            <path d="M14.23 14.508c-.024-.79-.455-1.474-1.212-1.926-.643-.383-1.452-.567-2.352-.534-.9.034-1.64.274-2.137.694-.471.398-.694.89-.663 1.463.029.522.31.962.816 1.277.56.348 1.322.497 2.14.453 1.104-.058 1.942-.432 2.494-1.11.32-.393.569-.871.722-1.41l.18.053.012.04z" />
        </svg>
    );
}

function TelegramIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}

function KakaoIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.664 6.201 3 12 3z" />
        </svg>
    );
}

const platforms: SocialPlatform[] = [
    {
        key: "x",
        href: "https://x.com/TranTradingLab",
        icon: <XIcon />,
        color: "text-white",
        borderColor: "border-white/10 hover:border-white/25",
    },
    {
        key: "threads",
        href: "https://www.threads.com/@_trantradinglab_",
        icon: <ThreadsIcon />,
        color: "text-white",
        borderColor: "border-white/10 hover:border-white/25",
    },
    {
        key: "tgEn",
        href: "https://t.me/TranTradingLabEN",
        icon: <TelegramIcon />,
        color: "text-[#29b6f6]",
        borderColor: "border-[#29b6f6]/10 hover:border-[#29b6f6]/30",
    },
    {
        key: "tgKr",
        href: "https://t.me/TranTradingLabKR",
        icon: <TelegramIcon />,
        color: "text-[#29b6f6]",
        borderColor: "border-[#29b6f6]/10 hover:border-[#29b6f6]/30",
    },
    {
        key: "kakao",
        href: "https://invite.kakao.com/tc/luxHFht3xL",
        icon: <KakaoIcon />,
        color: "text-[#fee500]",
        borderColor: "border-[#fee500]/10 hover:border-[#fee500]/30",
    },
];

export function CommunitySection() {
    const t = useTranslations("home");
    const gridRef = useGsapScroll<HTMLDivElement>({
        children: true,
        stagger: 0.1,
    });

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Lamp>
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
                            {t("communityTitle")}
                        </h2>
                    </Lamp>
                    <p className="text-sm text-white/30 mt-2">
                        {t("communitySubtitle")}
                    </p>
                </div>

                {/* Platform Cards */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                >
                    {platforms.map((platform) => (
                        <TiltCard key={platform.key}>
                            <a
                                href={platform.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block p-4 rounded-xl bg-cv-elevated border ${platform.borderColor} card-hover h-full transition-colors group`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`${platform.color}`}>
                                        {platform.icon}
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                                </div>

                                <h3 className="text-sm font-semibold text-white/90 mb-1">
                                    {t(`community${platform.key.charAt(0).toUpperCase() + platform.key.slice(1)}Name`)}
                                </h3>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    {t(`community${platform.key.charAt(0).toUpperCase() + platform.key.slice(1)}Desc`)}
                                </p>
                            </a>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
