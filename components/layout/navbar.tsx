"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const locale = useLocale();
    const pathname = usePathname();
    const t = useTranslations("common");

    const navItems = [
        { href: `/${locale}`, label: t("home") },
        { href: `/${locale}/briefings`, label: t("briefings") },
        { href: `/${locale}/blog`, label: t("blog") },
        { href: `/${locale}/research`, label: t("research") },
        { href: `/${locale}/switchboard`, label: t("switchboard") },
        { href: `/${locale}/bold-calls`, label: t("boldCalls") },
        { href: `/${locale}/academy`, label: t("learn") },
        { href: `/${locale}/about`, label: t("about") },
    ];

    const isActive = useCallback(
        (href: string) => {
            if (href === `/${locale}`) return pathname === `/${locale}`;
            return pathname.startsWith(href);
        },
        [locale, pathname]
    );

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 60);

            if (y > 100) {
                const delta = y - lastScrollY.current;
                if (delta > 10) setIsHidden(true);
                else if (delta < -10) setIsHidden(false);
            } else {
                setIsHidden(false);
            }
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileMenuOpen) setIsMobileMenuOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: isHidden && !isMobileMenuOpen ? -100 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
                    ? "bg-[var(--bg-void)]/85 backdrop-blur-2xl border-b border-[var(--border-subtle)]"
                    : "bg-transparent"
                    }`}
            >
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href={`/${locale}`} className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-lg bg-[#111] flex items-center justify-center overflow-hidden flex-shrink-0">
                                <Image
                                    src="/tiger-logo.png"
                                    alt="TTL"
                                    width={36}
                                    height={36}
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                                <span className="text-gradient-gold text-glow-gold">TRAN</span>
                                <span className="text-[var(--text-primary)] hidden sm:inline"> TRADING LAB</span>
                                <span className="text-[var(--text-primary)] sm:hidden"> TL</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation — flat links */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 text-sm font-medium transition-colors relative group rounded-md hover:bg-[var(--bg-wash)] ${isActive(item.href) ? "text-accent" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    {item.label}
                                    {isActive(item.href) ? (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-accent rounded-full" />
                                    ) : (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-3/4 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right side: Theme + Lang + CTA */}
                        <div className="hidden lg:flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                            <Link
                                href={`/${locale}/subscribe`}
                                className="h-9 px-4 rounded-xl text-sm font-semibold transition-all duration-200 text-[#0a0a0f] hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] flex items-center cta-pulse"
                                style={{ background: "var(--gradient-cta)" }}
                            >
                                {t("subscribeFree")}
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex lg:hidden items-center gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                            <button
                                className="text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-wash)] transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay + Slide-in Panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Panel — slide from right */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-cv-primary border-l border-[var(--border-default)] lg:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                                <span className="text-sm font-semibold text-[var(--text-primary)]">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-wash)] transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 p-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`py-3 px-3 rounded-xl text-base transition-colors ${isActive(item.href)
                                            ? "text-accent bg-accent/5 font-medium"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-wash)]"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                                    <Link
                                        href={`/${locale}/subscribe`}
                                        className="block py-3 rounded-xl text-sm font-semibold text-center text-[#0a0a0f]"
                                        style={{ background: "var(--gradient-cta)" }}
                                    >
                                        {t("subscribeFree")}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
