"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BookOpen, Search, ChevronDown, ExternalLink, AlertTriangle } from "lucide-react";
import { glossaryTerms, glossaryCategories, type GlossaryTerm } from "@/lib/glossary-data";

const ITEMS_PER_PAGE = 20;

// Map data categories to i18n keys
const categoryI18nKeys: Record<string, string> = {
    "전체": "catAll",
    "SMC": "catSMC",
    "ORB": "catORB",
    "리스크 관리": "catRisk",
    "시장 구조": "catStructure",
    "주문/유동성": "catOrderFlow",
    "기초/차트": "catBasics",
};

export function GlossaryContent() {
    const t = useTranslations("glossary");
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("전체");
    const [openTermId, setOpenTermId] = useState<string | null>(null);
    const [highlightedTermId, setHighlightedTermId] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const termRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const heroRef = useGsapScroll<HTMLDivElement>();

    const filteredTerms = useMemo(() => {
        return glossaryTerms.filter((term) => {
            const searchLower = search.toLowerCase();
            const matchesSearch = search === "" ||
                term.term_en.toLowerCase().includes(searchLower) ||
                term.term_kr.includes(search) ||
                (term.abbreviation && term.abbreviation.toLowerCase().includes(searchLower)) ||
                term.one_liner.includes(search) ||
                term.definition.toLowerCase().includes(searchLower);
            const matchesCategory = activeCategory === "전체" || term.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategory]);

    const displayedTerms = useMemo(() => {
        return filteredTerms.slice(0, displayCount);
    }, [filteredTerms, displayCount]);

    const loadMore = useCallback(() => {
        setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredTerms.length));
    }, [filteredTerms.length]);

    const scrollToTerm = useCallback((termId: string) => {
        const term = glossaryTerms.find(t => t.id === termId);
        if (!term) return;

        if (activeCategory !== "전체" && term.category !== activeCategory) {
            setActiveCategory("전체");
        }
        setSearch("");
        setDisplayCount(ITEMS_PER_PAGE);

        setTimeout(() => {
            const termIndex = glossaryTerms.findIndex(t => t.id === termId);
            if (termIndex >= displayCount) {
                setDisplayCount(termIndex + 5);
            }

            setTimeout(() => {
                const element = termRefs.current[termId];
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    setOpenTermId(termId);
                    setHighlightedTermId(termId);
                    setTimeout(() => setHighlightedTermId(null), 1500);
                }
            }, 100);
        }, 50);
    }, [activeCategory, displayCount]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "전체": glossaryTerms.length };
        glossaryTerms.forEach(t => {
            counts[t.category] = (counts[t.category] || 0) + 1;
        });
        return counts;
    }, []);

    const getCategoryLabel = (cat: string) => {
        const key = categoryI18nKeys[cat];
        return key ? t(key) : cat;
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div ref={heroRef} className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <BookOpen className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto">
                            {t("subtitle", { count: glossaryTerms.length })}
                        </p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setDisplayCount(ITEMS_PER_PAGE);
                                }}
                                aria-label={t("searchPlaceholder")}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-cv-elevated border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {glossaryCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setDisplayCount(ITEMS_PER_PAGE);
                                    }}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                        ? "bg-gold text-cv-primary"
                                        : "bg-cv-elevated border border-white/5 text-white/40 hover:text-white/70 hover:border-gold/30"
                                        }`}
                                >
                                    {getCategoryLabel(cat)} <span className="text-xs opacity-70">({categoryCounts[cat] || 0})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-white/30 mb-4">
                        {t("termsCount", { count: filteredTerms.length })} {displayedTerms.length < filteredTerms.length && `(${t("showing", { count: displayedTerms.length })})`}
                    </p>

                    {/* Terms List */}
                    <div className="space-y-3">
                        {displayedTerms.map((term) => (
                            <TermAccordion
                                key={term.id}
                                term={term}
                                isOpen={openTermId === term.id}
                                isHighlighted={highlightedTermId === term.id}
                                onToggle={() => setOpenTermId(openTermId === term.id ? null : term.id)}
                                onRelatedClick={scrollToTerm}
                                getCategoryLabel={getCategoryLabel}
                                ref={(el) => { termRefs.current[term.id] = el; }}
                            />
                        ))}
                    </div>

                    {/* Load More */}
                    {displayedTerms.length < filteredTerms.length && (
                        <div className="text-center mt-6">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 rounded-lg bg-cv-elevated border border-white/5 text-white/70 hover:border-gold/30 transition-all"
                            >
                                {t("loadMore")} ({t("remaining", { count: filteredTerms.length - displayedTerms.length })})
                            </button>
                        </div>
                    )}

                    {filteredTerms.length === 0 && (
                        <div className="text-center py-12 text-white/40">
                            {t("noResults")}
                        </div>
                    )}

                    {/* NFA Disclaimer */}
                    <div className="mt-16 p-4 rounded-lg bg-cv-elevated/50 border border-white/5 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-neutral flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-white/40">
                            <strong>{t("disclaimerTitle")}</strong> {t("disclaimerText")}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

// Term Accordion Component
interface TermAccordionProps {
    term: GlossaryTerm;
    isOpen: boolean;
    isHighlighted: boolean;
    onToggle: () => void;
    onRelatedClick: (termId: string) => void;
    getCategoryLabel: (cat: string) => string;
}

const TermAccordion = ({ term, isOpen, isHighlighted, onToggle, onRelatedClick, getCategoryLabel }: TermAccordionProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const t = useTranslations("glossary");

    return (
        <div
            className={`rounded-lg border overflow-hidden transition-all duration-300 ${isHighlighted
                    ? "bg-gold/10 border-gold shadow-lg shadow-gold/20"
                    : "bg-cv-elevated border-white/5"
                }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white/90">{term.term_kr}</span>
                        <span className="text-sm text-white/40">({term.term_en})</span>
                        {term.abbreviation && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-gold/20 text-gold font-mono">
                                {term.abbreviation}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-white/40 mt-1 line-clamp-1">{term.one_liner}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/30 hidden sm:inline">
                        {getCategoryLabel(term.category)}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-white/30 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                            {/* Definition */}
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">{t("definition")}</h4>
                                <div className="text-white/40 text-sm whitespace-pre-line">
                                    {term.definition}
                                </div>
                            </div>

                            {/* How to Use */}
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">{t("howToUse")}</h4>
                                <ul className="space-y-1">
                                    {term.how_to_use.map((item, i) => (
                                        <li key={i} className="text-sm text-white/40 flex items-start gap-2">
                                            <span className="text-gold mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Common Mistakes */}
                            <div>
                                <h4 className="text-sm font-semibold text-bearish mb-2">{t("commonMistakes")}</h4>
                                <ul className="space-y-1">
                                    {term.common_mistakes.map((item, i) => (
                                        <li key={i} className="text-sm text-white/40 flex items-start gap-2">
                                            <span className="text-bearish mt-1">{"\u2717"}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Examples */}
                            {term.examples.length > 0 && (
                                <div className="p-3 rounded bg-white/[0.03]">
                                    <h4 className="text-sm font-semibold text-white/70 mb-2">{t("examples")}</h4>
                                    {term.examples.map((ex, i) => (
                                        <p key={i} className="text-sm text-white/40">{ex}</p>
                                    ))}
                                </div>
                            )}

                            {/* Related Terms */}
                            {term.related_terms.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-white/30 mb-2">{t("relatedTerms")}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {term.related_terms.map((relatedId) => {
                                            const relatedTerm = glossaryTerms.find(t => t.id === relatedId);
                                            if (!relatedTerm) return null;
                                            return (
                                                <button
                                                    key={relatedId}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRelatedClick(relatedId);
                                                    }}
                                                    className="px-2 py-1 rounded text-xs bg-cv-surface border border-white/5 text-white/40 hover:text-gold hover:border-gold/30 transition-colors flex items-center gap-1"
                                                >
                                                    {relatedTerm.term_kr}
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
