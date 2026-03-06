"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, TrendingUp, BookOpen, FileText } from "lucide-react";

export type ContentTab = "all" | "briefings" | "blog" | "research";

const tabs: { id: ContentTab; icon: typeof LayoutGrid; labelKey: string }[] = [
    { id: "all", icon: LayoutGrid, labelKey: "tabAll" },
    { id: "briefings", icon: TrendingUp, labelKey: "tabBriefings" },
    { id: "blog", icon: BookOpen, labelKey: "tabBlog" },
    { id: "research", icon: FileText, labelKey: "tabResearch" },
];

interface TabNavigationProps {
    activeTab: ContentTab;
    onTabChange: (tab: ContentTab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const t = useTranslations("home");
    const [isSticky, setIsSticky] = useState(false);
    const tabRef = useRef<HTMLDivElement>(null);
    const naturalTop = useRef(0);

    useEffect(() => {
        // Record the tab's natural position once rendered
        if (tabRef.current) {
            naturalTop.current = tabRef.current.offsetTop;
        }
        const handleScroll = () => {
            // Sticky when scrolled past the tab's natural position minus navbar
            setIsSticky(window.scrollY > naturalTop.current - 64 - 4);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={tabRef}
            className={`${isSticky ? "sticky top-[64px] z-30 backdrop-blur-2xl bg-[var(--bg-primary)]/90 border-b border-[var(--border-subtle)] shadow-sm" : "border-b border-[var(--border-subtle)]"} transition-all duration-200`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px" aria-label="Content tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    onTabChange(tab.id);
                                    // Scroll content into view after tab switch
                                    const el = document.getElementById("content-feed-anchor");
                                    if (el) {
                                        const navH = 64;
                                        const tabH = 48;
                                        const y = el.getBoundingClientRect().top + window.scrollY - navH - tabH - 8;
                                        window.scrollTo({ top: y, behavior: "smooth" });
                                    }
                                }}
                                className={`
                                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200
                                    ${isActive
                                        ? "border-[var(--accent)] text-[var(--accent)]"
                                        : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                                    }
                                `}
                                aria-selected={isActive}
                                role="tab"
                            >
                                <Icon className="w-4 h-4" />
                                {t(tab.labelKey)}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
