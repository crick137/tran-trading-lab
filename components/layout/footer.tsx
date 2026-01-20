import Link from "next/link";
import { BarChart3, Send, Twitter, Youtube, Mail } from "lucide-react";

const socialLinks = [
    { href: "https://t.me/TranTradingLab", icon: Send, label: "Telegram" },
    { href: "https://twitter.com/TranTradingLab", icon: Twitter, label: "Twitter" },
    { href: "https://youtube.com/@TranTradingLab", icon: Youtube, label: "YouTube" },
];

const footerLinks = [
    {
        title: "콘텐츠",
        links: [
            { href: "/blog", label: "블로그" },
            { href: "/blog?category=analysis", label: "시장 분석" },
            { href: "/blog?category=strategy", label: "트레이딩 전략" },
            { href: "/blog?category=news", label: "뉴스 번역" },
        ],
    },
    {
        title: "정보",
        links: [
            { href: "/about", label: "소개" },
            { href: "https://t.me/TranTradingLab", label: "커뮤니티" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-background" />
                            </div>
                            <span className="font-bold text-lg text-gradient-gold">
                                TranTradingLab
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            한국 개인 투자자를 위한 전문 금융 교육 플랫폼.
                            시장 분석, SMC/ORB 트레이딩 전략, 중국 금융 뉴스 한국어 번역을 제공합니다.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
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
                        © {new Date().getFullYear()} TranTradingLab. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            개인정보 처리방침
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            이용약관
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
