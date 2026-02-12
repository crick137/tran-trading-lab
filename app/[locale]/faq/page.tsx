"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/50 rounded-lg overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
            >
                <span className="font-medium text-foreground pr-4">{item.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
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
                        <div className="px-4 pb-4 text-muted-foreground">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = useTranslations("faq");

    // Get FAQ items from i18n
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
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <Breadcrumb items={[{ label: "FAQ" }]} />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <HelpCircle className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
                        <p className="text-lg text-muted-foreground">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-2 mb-8"
                    >
                        <button
                            onClick={() => setActiveCategory(allCategory)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === allCategory
                                ? "bg-gold text-background"
                                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50"
                                }`}
                        >
                            {allCategory}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? "bg-gold text-background"
                                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>

                    {/* FAQ List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-3"
                    >
                        {filteredItems.map((item, index) => (
                            <FAQAccordion
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </motion.div>

                    {/* Contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-16 p-8 rounded-xl bg-card/50 border border-border/50 text-center"
                    >
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            {t("contactTitle")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("contactDesc")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium hover:shadow-lg hover:shadow-gold/30 transition-all"
                        >
                            {t("contactCta")}
                        </a>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
