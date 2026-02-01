"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BookOpen, Search, ChevronDown, ExternalLink, AlertTriangle } from "lucide-react";
import { glossaryTerms, glossaryCategories, type GlossaryTerm } from "@/lib/glossary-data";
import type { Metadata } from "next";

// Virtualization: Only render visible items for performance
const ITEMS_PER_PAGE = 20;

export default function GlossaryPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("전체");
    const [openTermId, setOpenTermId] = useState<string | null>(null);
    const [highlightedTermId, setHighlightedTermId] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const termRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Filter terms based on search and category
    const filteredTerms = useMemo(() => {
        return glossaryTerms.filter((t) => {
            const searchLower = search.toLowerCase();
            const matchesSearch = search === "" ||
                t.term_en.toLowerCase().includes(searchLower) ||
                t.term_kr.includes(search) ||
                (t.abbreviation && t.abbreviation.toLowerCase().includes(searchLower)) ||
                t.one_liner.includes(search) ||
                t.definition.toLowerCase().includes(searchLower);
            const matchesCategory = activeCategory === "전체" || t.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, activeCategory]);

    // Displayed terms (virtualized)
    const displayedTerms = useMemo(() => {
        return filteredTerms.slice(0, displayCount);
    }, [filteredTerms, displayCount]);

    // Load more handler
    const loadMore = useCallback(() => {
        setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredTerms.length));
    }, [filteredTerms.length]);

    // Navigate to related term
    const scrollToTerm = useCallback((termId: string) => {
        // First, find and show this term if it's filtered out
        const term = glossaryTerms.find(t => t.id === termId);
        if (!term) return;

        // Reset filters to show the term
        if (activeCategory !== "전체" && term.category !== activeCategory) {
            setActiveCategory("전체");
        }
        setSearch("");
        setDisplayCount(ITEMS_PER_PAGE);

        // Wait for re-render then scroll
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

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "전체": glossaryTerms.length };
        glossaryTerms.forEach(t => {
            counts[t.category] = (counts[t.category] || 0) + 1;
        });
        return counts;
    }, []);

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "용어집" }]} />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <BookOpen className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">트레이딩 용어집</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            SMC, ORB, 리스크 관리, 시장 구조, 주문 흐름에서 필수적인 {glossaryTerms.length}개 용어를 정리했습니다.
                        </p>
                    </motion.div>

                    {/* Search & Filter */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="용어 검색 (영문, 한글, 축약어 모두 가능)..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setDisplayCount(ITEMS_PER_PAGE);
                                }}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
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
                                        ? "bg-gold text-background"
                                        : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50"
                                        }`}
                                >
                                    {cat} <span className="text-xs opacity-70">({categoryCounts[cat] || 0})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-muted-foreground mb-4">
                        {filteredTerms.length}개 용어 {displayedTerms.length < filteredTerms.length && `(${displayedTerms.length}개 표시 중)`}
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
                                ref={(el) => { termRefs.current[term.id] = el; }}
                            />
                        ))}
                    </div>

                    {/* Load More */}
                    {displayedTerms.length < filteredTerms.length && (
                        <div className="text-center mt-6">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 rounded-lg bg-card border border-border/50 text-foreground hover:border-gold/50 transition-all"
                            >
                                더 보기 ({filteredTerms.length - displayedTerms.length}개 남음)
                            </button>
                        </div>
                    )}

                    {filteredTerms.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
                        </div>
                    )}

                    {/* NFA Disclaimer */}
                    <div className="mt-16 p-4 rounded-lg bg-card/50 border border-border/50 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                            <strong>면책 고지:</strong> 이 용어집은 교육 목적으로만 제공됩니다.
                            투자 결정은 본인의 책임이며, 어떤 전략도 수익을 보장하지 않습니다.
                            실제 거래 전 충분한 학습과 연습을 권장합니다.
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
}

const TermAccordion = ({ term, isOpen, isHighlighted, onToggle, onRelatedClick }: TermAccordionProps & { ref?: React.Ref<HTMLDivElement> }) => {
    return (
        <div
            className={`rounded-lg border overflow-hidden transition-all duration-300 ${isHighlighted
                    ? "bg-gold/10 border-gold shadow-lg shadow-gold/20"
                    : "bg-card border-border/50"
                }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/80 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{term.term_kr}</span>
                        <span className="text-sm text-muted-foreground">({term.term_en})</span>
                        {term.abbreviation && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-gold/20 text-gold font-mono">
                                {term.abbreviation}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{term.one_liner}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground hidden sm:inline">
                        {term.category}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
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
                        <div className="px-4 pb-4 border-t border-border/30 pt-4 space-y-4">
                            {/* Definition */}
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">정의</h4>
                                <div className="text-muted-foreground text-sm whitespace-pre-line">
                                    {term.definition}
                                </div>
                            </div>

                            {/* How to Use */}
                            <div>
                                <h4 className="text-sm font-semibold text-gold mb-2">활용 방법</h4>
                                <ul className="space-y-1">
                                    {term.how_to_use.map((item, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-gold mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Common Mistakes */}
                            <div>
                                <h4 className="text-sm font-semibold text-red-400 mb-2">주의사항</h4>
                                <ul className="space-y-1">
                                    {term.common_mistakes.map((item, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-red-400 mt-1">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Examples */}
                            {term.examples.length > 0 && (
                                <div className="p-3 rounded bg-muted/20">
                                    <h4 className="text-sm font-semibold text-foreground mb-2">예시</h4>
                                    {term.examples.map((ex, i) => (
                                        <p key={i} className="text-sm text-muted-foreground">{ex}</p>
                                    ))}
                                </div>
                            )}

                            {/* Related Terms */}
                            {term.related_terms.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">관련 용어</h4>
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
                                                    className="px-2 py-1 rounded text-xs bg-card border border-border/50 text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors flex items-center gap-1"
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
