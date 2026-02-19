"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavDropdown {
    label: string;
    items: { href: string; label: string }[];
}

type NavEntry = { href: string; label: string } | NavDropdown;

function isDropdown(entry: NavEntry): entry is NavDropdown {
    return "items" in entry;
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const lastScrollY = useRef(0);
    const locale = useLocale();
    const pathname = usePathname();
    const t = useTranslations("common");
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const navEntries: NavEntry[] = [
        { href: `/${locale}`, label: t("home") },
        {
            label: t("products"),
            items: [
                { href: `/${locale}/dashboard`, label: t("dashboard") },
                { href: `/${locale}/switchboard`, label: t("switchboard") },
                { href: `/${locale}/bold-calls`, label: t("boldCalls") },
            ],
        },
        {
            label: t("content"),
            items: [
                { href: `/${locale}/blog`, label: t("blog") },
                { href: `/${locale}/academy`, label: t("learn") },
                { href: `/${locale}/subscribe`, label: t("newsletter") },
            ],
        },
        { href: `/${locale}/about`, label: t("about") },
        { href: `/${locale}/community`, label: t("community") },
    ];

    const mobileItems = navEntries.flatMap((entry) =>
        isDropdown(entry) ? entry.items : [entry]
    );

    const isActive = useCallback(
        (href: string) => {
            if (href === `/${locale}`) return pathname === `/${locale}`;
            return pathname.startsWith(href);
        },
        [locale, pathname]
    );

    const isDropdownActive = useCallback(
        (items: { href: string }[]) => items.some((item) => isActive(item.href)),
        [isActive]
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
            if (e.key === "Escape") {
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                if (openDropdown) setOpenDropdown(null);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen, openDropdown]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const handleDropdownEnter = (label: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setOpenDropdown(label);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
    };

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
                <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-cv-primary" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                <span className="text-gradient-gold">TRAN</span>
                                <span className="text-[var(--text-primary)]"> TRADING LAB</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navEntries.map((entry) =>
                                isDropdown(entry) ? (
                                    <div
                                        key={entry.label}
                                        className="relative"
                                        onMouseEnter={() => handleDropdownEnter(entry.label)}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <button
                                            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors relative rounded-md hover:bg-[var(--bg-wash)] ${isDropdownActive(entry.items) ? "text-accent" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                }`}
                                        >
                                            {entry.label}
                                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === entry.label ? "rotate-180" : ""}`} />
                                            {isDropdownActive(entry.items) && (
                                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-accent rounded-full" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === entry.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 4 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-1 py-1.5 min-w-[180px] rounded-xl bg-[var(--bg-overlay)] border border-[var(--border-default)] shadow-lg"
                                                >
                                                    {entry.items.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`group/dd block px-4 py-2 text-sm transition-colors relative ${isActive(item.href)
                                                                ? "text-accent bg-accent/5"
                                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-wash)]"
                                                                }`}
                                                        >
                                                            {item.label}
                                                            {!isActive(item.href) && (
                                                                <span className="absolute bottom-1 left-4 right-4 h-px bg-accent/40 scale-x-0 group-hover/dd:scale-x-100 transition-transform duration-200 origin-left" />
                                                            )}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={entry.href}
                                        href={entry.href}
                                        className={`px-3 py-2 text-sm font-medium transition-colors relative group rounded-md hover:bg-[var(--bg-wash)] ${isActive(entry.href) ? "text-accent" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            }`}
                                    >
                                        {entry.label}
                                        {isActive(entry.href) ? (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-accent rounded-full" />
                                        ) : (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-3/4 rounded-full" />
                                        )}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Right side: Theme + Lang + CTA */}
                        <div className="hidden lg:flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                            <Link
                                href={`/${locale}/subscribe`}
                                className="h-9 px-4 rounded-xl text-sm font-semibold transition-all duration-200 text-[#0a0a0f] hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] flex items-center"
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
                                {mobileItems.map((item) => (
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
