"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface SocialLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X (Twitter)" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR" },
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk" },
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

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 hover:shadow-md hover:shadow-gold/10 transition-all"
                                    aria-label={social.label}
                                >
                                    {social.icon}
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
