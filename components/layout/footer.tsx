"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3, Send, Twitter, Youtube } from "lucide-react";

const socialLinks = [
    { href: "https://t.me/TranTradingLab", icon: Send, label: "Telegram" },
    { href: "https://twitter.com/TranTradingLab", icon: Twitter, label: "Twitter" },
    { href: "https://youtube.com/@TranTradingLab", icon: Youtube, label: "YouTube" },
];

export function Footer() {
    const locale = useLocale();
    const t = useTranslations("common");
    const tf = useTranslations("footer");

    const footerLinks = [
        {
            title: t("content"),
            links: [
                { href: `/${locale}/blog`, label: t("blog") },
                { href: `/${locale}/research`, label: t("research") },
                { href: `/${locale}/reports`, label: t("reports") },
            ],
        },
        {
            title: t("learning"),
            links: [
                { href: `/${locale}/briefings`, label: t("briefings") },
                { href: `/${locale}/playbooks`, label: t("playbooks") },
                { href: `/${locale}/glossary`, label: t("glossary") },
            ],
        },
        {
            title: t("tools"),
            links: [
                { href: `/${locale}/tools`, label: t("tools") },
                { href: `/${locale}/tools/position-sizing`, label: "Position Sizing" },
                { href: `/${locale}/tools/rr-calculator`, label: "R:R Calculator" },
            ],
        },
        {
            title: t("about"),
            links: [
                { href: `/${locale}/about`, label: t("about") },
                { href: `/${locale}/faq`, label: t("faq") },
                { href: `/${locale}/contact`, label: tf("contact") },
            ],
        },
    ];

    return (
        <footer className="border-t border-border/50 bg-card/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-background" />
                            </div>
                            <span className="font-bold text-lg text-gradient-gold">
                                TranTradingLab
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-4">
                            {tf("riskDisclaimer")}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-foreground mb-3 text-sm">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} TranTradingLab. {t("allRightsReserved")}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
                            {tf("privacy")}
                        </Link>
                        <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
                            {tf("terms")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
