"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-white/5 rounded-lg overflow-hidden bg-cv-elevated">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <span className="font-medium text-white/90 pr-4">{item.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-white/30" />
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
                        <div className="px-4 pb-4 text-white/40 text-sm leading-relaxed">
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
    const heroRef = useGsapScroll<HTMLDivElement>();
    const listRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.06 });
    const ctaRef = useGsapScroll<HTMLDivElement>();

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
                    <div ref={heroRef} className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <HelpCircle className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-lg text-white/40">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setActiveCategory(allCategory)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeCategory === allCategory
                                    ? "bg-gold text-cv-primary"
                                    : "bg-cv-elevated border border-white/5 text-white/50 hover:text-white hover:border-gold/30"
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
                                        ? "bg-gold text-cv-primary"
                                        : "bg-cv-elevated border border-white/5 text-white/50 hover:text-white hover:border-gold/30"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div ref={listRef} className="space-y-3">
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
                    <div ref={ctaRef} className="mt-16 p-8 rounded-xl bg-cv-elevated border border-white/5 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">
                            {t("contactTitle")}
                        </h2>
                        <p className="text-white/40 mb-4">
                            {t("contactDesc")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cv-primary font-medium transition-all hover:shadow-lg hover:shadow-gold/20"
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
