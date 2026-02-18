"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Menu, X, BarChart3 } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations("common");

    const navItems = [
        { href: `/${locale}`, label: t("home") },
        { href: `/${locale}/dashboard`, label: t("dashboard") },
        { href: `/${locale}/switchboard`, label: t("switchboard") },
        { href: `/${locale}/blog`, label: t("blog") },
        { href: `/${locale}/learn`, label: t("learn") },
        { href: `/${locale}/bold-calls`, label: t("boldCalls") },
        { href: `/${locale}/about`, label: t("about") },
    ];

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
                ? "bg-cv-primary/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/30"
                : "bg-transparent"
                }`}
        >
            <nav className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-cv-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            <span className="text-gradient-gold">TRAN</span>
                            <span className="text-white/90"> TRADING LAB</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors relative group rounded-md hover:bg-white/5"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-3/4 rounded-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right side: Lang + CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            href={`/${locale}/newsletter`}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-cv-primary"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("subscribeFree")}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        <LanguageSwitcher />
                        <button
                            className="text-white/80 p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden py-4 border-t border-white/5"
                    >
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-white/60 hover:text-white transition-colors py-2.5 px-3 rounded-md hover:bg-white/5 text-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <Link
                                    href={`/${locale}/newsletter`}
                                    className="block py-2.5 rounded-lg text-sm font-semibold text-center text-cv-primary"
                                    style={{ background: "var(--gradient-cta)" }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t("subscribeFree")}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    );
}
