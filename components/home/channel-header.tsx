"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Bell, FileText, Users } from "lucide-react";

// Custom SVG icons
function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function TelegramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}

const socialLinks = [
    { href: "https://x.com/TranTradingLab", icon: XIcon, label: "X" },
    { href: "https://t.me/TranTradingLabEN", icon: TelegramIcon, label: "TG EN" },
    { href: "https://t.me/TranTradingLabKR", icon: TelegramIcon, label: "TG KR" },
];

interface ChannelHeaderProps {
    stats: { total: number; briefings: number; blogs: number; research: number };
}

export function ChannelHeader({ stats }: ChannelHeaderProps) {
    const locale = useLocale() as "en" | "ko";
    const t = useTranslations("home");

    return (
        <section className="relative">
            {/* ── Banner Image ── */}
            <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden">
                <Image
                    src="/banner.jpg"
                    alt="Tran Trading Lab Banner"
                    fill
                    priority
                    className="object-cover object-center"
                />
                {/* Bottom gradient fade into page bg */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                {/* Subtle darkening overlay for contrast */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* ── Profile Card (overlaps banner) ── */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#111] border-[3px] border-[var(--bg-primary)] shadow-xl ring-1 ring-[var(--border-subtle)]">
                        <Image
                            src="/tiger-logo.png"
                            alt="Tran Trading Lab"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2 pb-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                                Tran Trading Lab
                            </h1>
                            {/* Social links inline */}
                            <div className="flex items-center gap-1">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                                        aria-label={link.label}
                                    >
                                        <link.icon className="w-3.5 h-3.5" />
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-cv-surface text-[9px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {link.label}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
                            {t("channelBio")}
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                                <Bell className="w-3 h-3" />
                                {t("updateFrequency")}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                                <FileText className="w-3 h-3" />
                                {stats.total} {locale === "ko" ? "개 콘텐츠" : "posts"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20">
                                <Users className="w-3 h-3" />
                                {locale === "ko" ? "EN · KR 이중 언어" : "EN · KR Bilingual"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom border */}
            <div className="border-b border-[var(--border-subtle)]" />
        </section>
    );
}
