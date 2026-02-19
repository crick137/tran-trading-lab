"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

interface SocialLink {
    href: string;
    label: string;
    icon: React.ReactNode;
    hoverColor: string;
}

const socialLinks: SocialLink[] = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X", hoverColor: "hover:text-[var(--text-primary)]" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads", hoverColor: "hover:text-[var(--text-primary)]" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "TG EN", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "TG KR", hoverColor: "hover:text-[#26A5E4]" },
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
        <footer className="relative bg-cv-primary border-t border-[var(--border-subtle)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-[#0a0a0f]" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                <span className="text-gradient-gold">TRAN</span>
                                <span className="text-[var(--text-primary)]"> TRADING LAB</span>
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--text-tertiary)] leading-relaxed max-w-sm mb-5">
                            {tf("tagline")}
                        </p>
                        <p className="text-[10px] text-[var(--text-ghost)] leading-relaxed max-w-sm mb-6">
                            {tf("riskDisclaimer")}
                        </p>

                        {/* Social Icons — 20px, hover: brand color + scale + tooltip */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] ${social.hoverColor} hover:scale-110 transition-all duration-200`}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cv-surface text-[10px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {social.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-overline text-[var(--text-secondary)] mb-4">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
                <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-overline text-[var(--text-muted)]" style={{ textTransform: "none", letterSpacing: "normal", fontSize: "11px" }}>
                        &copy; {new Date().getFullYear()} TranTradingLab. {t("allRightsReserved")}
                    </p>
                    <div className="flex gap-6 text-[11px] text-[var(--text-muted)]">
                        <Link href={`/${locale}/privacy`} prefetch={false} className="hover:text-[var(--text-secondary)] transition-colors">
                            {tf("privacy")}
                        </Link>
                        <Link href={`/${locale}/terms`} prefetch={false} className="hover:text-[var(--text-secondary)] transition-colors">
                            {tf("terms")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
