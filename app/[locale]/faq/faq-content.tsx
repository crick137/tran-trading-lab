"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden bg-cv-elevated">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-wash)] transition-colors"
            >
                <span className="font-medium text-[var(--text-primary)] pr-4">{item.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 text-[var(--text-tertiary)] text-sm leading-relaxed">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQContent() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = useTranslations("faq");
    const faqItems: FAQItem[] = [];
    let i = 0;
    while (true) {
        try {
            const question = t(`items.${i}.question`);
            const answer = t(`items.${i}.answer`);
            const category = t(`items.${i}.category`);
            if (!question || question.startsWith("faq.items.")) break;
            faqItems.push({ question, answer, category });
            i++;
        } catch {
            break;
        }
    }

    const categories = Array.from(new Set(faqItems.map((item) => item.category)));
    const allCategory = t("allCategory");
    const [activeCategory, setActiveCategory] = useState<string>(allCategory);

    const filteredItems = activeCategory === allCategory
        ? faqItems
        : faqItems.filter((item) => item.category === activeCategory);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <HelpCircle className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-display text-[var(--text-primary)] mb-4">{t("title")}</h1>
                        <p className="text-lg text-[var(--text-tertiary)]">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setActiveCategory(allCategory)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeCategory === allCategory
                                    ? "bg-accent text-[#0a0a0f]"
                                    : "bg-cv-elevated border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/30"
                            }`}
                        >
                            {allCategory}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeCategory === category
                                        ? "bg-accent text-[#0a0a0f]"
                                        : "bg-cv-elevated border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/30"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-3">
                        {filteredItems.map((item, index) => (
                            <FAQAccordion
                                key={`${activeCategory}-${index}`}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 p-8 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] text-center">
                        <h2 className="text-card-title text-[var(--text-primary)] mb-2">
                            {t("contactTitle")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-4">
                            {t("contactDesc")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[#0a0a0f] font-medium transition-all hover:shadow-lg hover:shadow-accent/20"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("contactCta")}
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
