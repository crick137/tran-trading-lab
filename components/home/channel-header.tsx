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

function ThreadsIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.17.408-2.253 1.332-3.05.862-.743 2.063-1.175 3.573-1.285 1.098-.08 2.125-.026 3.064.16-.075-.424-.205-.808-.394-1.15-.505-.918-1.396-1.404-2.646-1.445h-.035c-.92 0-1.753.293-2.34.825l-1.39-1.56C9.27 5.835 10.505 5.4 11.85 5.387h.063c1.833.06 3.217.793 4.005 2.12.364.612.611 1.32.735 2.093.481.118.933.27 1.35.46 1.178.536 2.105 1.39 2.677 2.468.815 1.536.876 4.197-1.17 6.2-1.79 1.753-4.04 2.52-7.084 2.545h-.02l.004-.004-.003.003zm-.186-8.674c-1.097.08-1.96.365-2.496.823-.463.398-.672.883-.643 1.48.043.824.673 1.673 2.408 1.673.061 0 .123-.002.187-.005 1.822-.098 2.918-1.122 3.283-3.063-.88-.21-1.8-.33-2.739-.308v-.6z" />
        </svg>
    );
}

const socialLinks = [
    { href: "https://x.com/TranTradingLab", icon: XIcon, label: "X" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: ThreadsIcon, label: "Threads" },
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
