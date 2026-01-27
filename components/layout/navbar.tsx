"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, BarChart3, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
    { href: "/", label: "홈" },
    { href: "/start", label: "시작하기" },
    {
        label: "콘텐츠",
        children: [
            { href: "/research", label: "리서치" },
            { href: "/blog", label: "블로그" },
            { href: "/reports", label: "리포트" },
            { href: "/briefings", label: "브리핑" },
        ]
    },
    {
        label: "학습",
        children: [
            { href: "/playbooks", label: "플레이북" },
            { href: "/glossary", label: "용어집" },
            { href: "/tools", label: "도구" },
        ]
    },
    { href: "/community", label: "커뮤니티" },
    { href: "/faq", label: "FAQ" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-background/90 backdrop-blur-xl border-b border-gold/10 shadow-lg shadow-black/20"
                : "bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-background" />
                        </div>
                        <span className="font-bold text-lg text-gradient-gold">
                            TranTradingLab
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            item.children ? (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(item.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {openDropdown === item.label && (
                                        <div className="absolute top-full left-0 pt-2">
                                            <div className="py-2 bg-card border border-border/50 rounded-lg shadow-xl min-w-[160px]">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    className="text-muted-foreground hover:text-foreground transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                                </Link>
                            )
                        ))}
                    </div>

                    {/* CTA Button + Theme Toggle */}
                    <div className="hidden lg:flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium transition-all hover:shadow-lg hover:shadow-gold/30 glow-gold-hover"
                        >
                            텔레그램 가입
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-foreground p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden py-4 border-t border-border/50"
                    >
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                item.children ? (
                                    <div key={item.label}>
                                        <div className="px-2 py-2 text-sm text-muted-foreground font-medium">{item.label}</div>
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className="block pl-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href!}
                                        className="text-muted-foreground hover:text-foreground transition-colors py-2 px-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}
                            <div className="flex items-center gap-3 mt-4 px-2">
                                <ThemeToggle />
                                <Link
                                    href="https://t.me/TranTradingLab"
                                    target="_blank"
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium text-center"
                                >
                                    텔레그램 가입
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    );
}
