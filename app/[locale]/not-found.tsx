"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { BarChart3, Home, LayoutDashboard } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

export default function NotFound() {
    const locale = useLocale();
    const t = useTranslations("notFound");

    const socialLinks = locale === "ko"
        ? [
            { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk" },
            { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR" },
            { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X" },
        ]
        : [
            { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X" },
            { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads" },
            { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN" },
        ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-cv-void flex items-center justify-center px-4 pt-16">
                <div className="text-center max-w-lg">
                    {/* Large 404 */}
                    <div className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter mb-2 select-none">
                        <span className="text-gradient-gold opacity-20">{t("code")}</span>
                    </div>

                    {/* Brand logo */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                            <BarChart3 className="w-3.5 h-3.5 text-cv-primary" />
                        </div>
                        <span className="text-sm font-semibold text-white/40">TRAN TRADING LAB</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                        {t("title")}
                    </h1>
                    <p className="text-white/40 mb-10 leading-relaxed max-w-md mx-auto">
                        {t("description")}
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] text-cv-void"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            <Home className="w-4 h-4" />
                            {t("backHome")}
                        </Link>
                        <Link
                            href={`/${locale}/dashboard`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 hover:text-white transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            {t("viewDashboard")}
                        </Link>
                    </div>

                    {/* Social links */}
                    <div className="flex justify-center gap-2">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:text-gold hover:border-gold/30 transition-all"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
