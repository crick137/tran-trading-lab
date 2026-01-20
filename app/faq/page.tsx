"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqItems: FAQItem[] = [
    {
        category: "서비스 일반",
        question: "TranTradingLab은 어떤 서비스인가요?",
        answer: "TranTradingLab은 한국 투자자를 위한 전문 금융 교육 플랫폼입니다. 시장 분석, SMC/ORB 트레이딩 전략, 중국 금융 뉴스 번역 등을 제공합니다.",
    },
    {
        category: "서비스 일반",
        question: "서비스 이용료가 있나요?",
        answer: "블로그의 모든 콘텐츠는 무료로 이용 가능합니다. 텔레그램 채널도 무료로 가입하실 수 있으며, 프리미엄 서비스는 추후 공지될 예정입니다.",
    },
    {
        category: "텔레그램",
        question: "텔레그램 채널에서는 어떤 정보를 받을 수 있나요?",
        answer: "매일 아침 08:00 KST에 시장 브리핑, 실시간 트레이딩 시그널, 주간 종합 리포트 등을 제공합니다. 5,000명 이상의 투자자가 함께하고 있습니다.",
    },
    {
        category: "트레이딩 전략",
        question: "SMC(Smart Money Concept)란 무엇인가요?",
        answer: "SMC는 대형 기관 투자자들의 트레이딩 패턴을 분석하여 개인 투자자도 동일한 방향으로 포지션을 잡을 수 있도록 돕는 기술적 분석 방법론입니다. Order Block, Fair Value Gap 등의 개념을 활용합니다.",
    },
    {
        category: "트레이딩 전략",
        question: "ORB 전략은 어떻게 사용하나요?",
        answer: "ORB(Opening Range Breakout)는 장 시작 후 첫 15~30분간의 고점과 저점을 기준으로 돌파 방향에 진입하는 전략입니다. 블로그에서 상세한 가이드를 확인하실 수 있습니다.",
    },
    {
        category: "콘텐츠",
        question: "중국 뉴스 번역은 어떤 내용인가요?",
        answer: "중국 주요 금융 매체의 시장 분석, 정책 변화, 기업 뉴스 등을 한국어로 번역하여 제공합니다. 중국 시장이 한국 증시에 미치는 영향을 빠르게 파악할 수 있습니다.",
    },
    {
        category: "콘텐츠",
        question: "콘텐츠는 얼마나 자주 업데이트되나요?",
        answer: "시장 분석은 평일 매일, 전략 가이드는 주 1-2회, 뉴스 번역은 중요 이벤트 발생 시 수시로 업데이트됩니다.",
    },
    {
        category: "문의",
        question: "개인적인 투자 상담도 가능한가요?",
        answer: "현재는 1:1 투자 상담 서비스를 제공하지 않습니다. 블로그와 텔레그램 채널의 콘텐츠를 통해 투자에 필요한 인사이트를 얻으시기 바랍니다.",
    },
];

const categories = Array.from(new Set(faqItems.map((item) => item.category)));

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
    const [activeCategory, setActiveCategory] = useState<string>("전체");

    const filteredItems = activeCategory === "전체"
        ? faqItems
        : faqItems.filter((item) => item.category === activeCategory);

    return (
        <>
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
                        <h1 className="text-4xl font-bold text-foreground mb-4">자주 묻는 질문</h1>
                        <p className="text-lg text-muted-foreground">
                            TranTradingLab 서비스에 대한 궁금증을 해결해 드립니다.
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
                            onClick={() => setActiveCategory("전체")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "전체"
                                ? "bg-gold text-background"
                                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/50"
                                }`}
                        >
                            전체
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
                            찾으시는 답변이 없으신가요?
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            텔레그램 채널에서 직접 문의해 주세요.
                        </p>
                        <a
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-medium hover:shadow-lg hover:shadow-gold/30 transition-all"
                        >
                            텔레그램 문의하기
                        </a>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
