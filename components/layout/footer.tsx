"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface SocialLink {
    href: string;
    label: string;
    icon: React.ReactNode;
    hoverColor: string; // platform-specific hover color
}

const socialLinks: SocialLink[] = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X (Twitter)", hoverColor: "hover:text-white" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads", hoverColor: "hover:text-white" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk", hoverColor: "hover:text-[#FEE500]" },
];

export function Footer() {
    const locale = useLocale();
    const t = useTranslations("common");
    const tf = useTranslations("footer");

    const footerLinks = [
        {
            title: t("products"),
            links: [
                { href: `/${locale}/dashboard`, label: t("dashboard") },
                { href: `/${locale}/switchboard`, label: t("switchboard") },
                { href: `/${locale}/bold-calls`, label: t("boldCalls") },
            ],
        },
        {
            title: t("content"),
            links: [
                { href: `/${locale}/blog`, label: t("blog") },
                { href: `/${locale}/academy`, label: t("learn") },
                { href: `/${locale}/subscribe`, label: t("newsletter") },
            ],
        },
        {
            title: t("company"),
            links: [
                { href: `/${locale}/about`, label: t("about") },
                { href: `/${locale}/community`, label: t("community") },
                { href: `/${locale}/faq`, label: t("faq") },
            ],
        },
    ];

    return (
        <footer className="relative bg-cv-primary">
            {/* Gold gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />

            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-cv-primary" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                <span className="text-gradient-gold">TRAN</span>
                                <span className="text-white/90"> TRADING LAB</span>
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-5">
                            {tf("tagline")}
                        </p>
                        <p className="text-white/30 text-xs leading-relaxed max-w-sm mb-6">
                            {tf("riskDisclaimer")}
                        </p>

                        {/* Social Links with platform-specific hover colors + tooltip */}
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 ${social.hoverColor} hover:border-white/20 hover:bg-white/10 hover:scale-110 hover:shadow-md transition-all duration-200`}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                    {/* Tooltip */}
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cv-surface text-[10px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {social.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-white/80 mb-4 text-sm">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/40 hover:text-white/80 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/30">
                        &copy; {new Date().getFullYear()} TranTradingLab. {t("allRightsReserved")}
                    </p>
                    <div className="flex gap-6 text-xs text-white/30">
                        <Link href={`/${locale}/privacy`} className="hover:text-white/60 transition-colors">
                            {tf("privacy")}
                        </Link>
                        <Link href={`/${locale}/terms`} className="hover:text-white/60 transition-colors">
                            {tf("terms")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
