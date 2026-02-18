"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface NavDropdown {
    label: string;
    items: { href: string; label: string }[];
}

type NavEntry = { href: string; label: string } | NavDropdown;

function isDropdown(entry: NavEntry): entry is NavDropdown {
    return "items" in entry;
}

export function Navbar() {
    const [scrollTier, setScrollTier] = useState<0 | 1 | 2>(0);
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
                { href: `/${locale}/learn`, label: t("learn") },
                { href: `/${locale}/newsletter`, label: t("newsletter") },
            ],
        },
        { href: `/${locale}/about`, label: t("about") },
        { href: `/${locale}/community`, label: t("community") },
    ];

    // Flatten all hrefs for mobile menu
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

            // 3-tier glassmorphism
            if (y > 200) setScrollTier(2);
            else if (y > 50) setScrollTier(1);
            else setScrollTier(0);

            // Smart hide: hide on scroll down (>10px delta), show on scroll up
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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const tierClasses = [
        "bg-transparent",
        "glass-subtle shadow-lg shadow-black/20",
        "glass-strong shadow-xl shadow-black/30",
    ];

    const handleDropdownEnter = (label: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setOpenDropdown(label);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: isHidden && !isMobileMenuOpen ? -100 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${tierClasses[scrollTier]} ${scrollTier > 0 ? "border-b border-white/5" : ""}`}
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
                                        className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors relative rounded-md hover:bg-white/5 ${
                                            isDropdownActive(entry.items) ? "text-gold" : "text-white/60 hover:text-white"
                                        }`}
                                    >
                                        {entry.label}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === entry.label ? "rotate-180" : ""}`} />
                                        {isDropdownActive(entry.items) && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gold rounded-full" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {openDropdown === entry.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 4 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full left-0 mt-1 py-1.5 min-w-[180px] rounded-lg glass-strong border border-white/10"
                                            >
                                                {entry.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`block px-4 py-2 text-sm transition-colors ${
                                                            isActive(item.href)
                                                                ? "text-gold bg-gold/5"
                                                                : "text-white/60 hover:text-white hover:bg-white/5"
                                                        }`}
                                                    >
                                                        {item.label}
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
                                    className={`px-3 py-2 text-sm transition-colors relative group rounded-md hover:bg-white/5 ${
                                        isActive(entry.href) ? "text-gold" : "text-white/60 hover:text-white"
                                    }`}
                                >
                                    {entry.label}
                                    {isActive(entry.href) ? (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gold rounded-full" />
                                    ) : (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-3/4 rounded-full" />
                                    )}
                                </Link>
                            )
                        )}
                    </div>

                    {/* Right side: Lang + CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            href={`/${locale}/newsletter`}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-cv-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("subscribeFree")}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        <LanguageSwitcher />
                        <button
                            className="text-white/80 p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="lg:hidden overflow-hidden border-t border-white/5"
                        >
                            <div className="flex flex-col gap-1 py-4">
                                {mobileItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`py-2.5 px-3 rounded-md text-sm transition-colors ${
                                            isActive(item.href)
                                                ? "text-gold bg-gold/5"
                                                : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-3 pt-3 border-t border-white/5">
                                    <Link
                                        href={`/${locale}/newsletter`}
                                        className="block py-2.5 rounded-lg text-sm font-semibold text-center text-cv-primary"
                                        style={{ background: "var(--gradient-cta)" }}
                                    >
                                        {t("subscribeFree")}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}
