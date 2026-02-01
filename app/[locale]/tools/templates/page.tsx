"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";

const templates = [
    {
        id: "trading-journal",
        title: "트레이딩 저널",
        description: "거래 기록, 스크린샷, 복기 노트를 체계적으로 정리하는 템플릿",
        format: "Notion / Excel",
        includes: ["거래 입력 양식", "수익/손실 추적", "월별 통계", "복기 섹션"],
    },
    {
        id: "weekly-review",
        title: "주간 리뷰 템플릿",
        description: "매주 트레이딩 성과를 돌아보고 개선점을 찾는 템플릿",
        format: "Notion / Markdown",
        includes: ["금주 거래 요약", "잘한 점 / 개선점", "다음 주 계획", "심리 체크"],
    },
    {
        id: "pre-trade-checklist",
        title: "거래 전 체크리스트",
        description: "진입 전 확인해야 할 조건들을 점검하는 체크리스트",
        format: "PDF / Notion",
        includes: ["일봉 추세 확인", "OB/FVG 체크", "R:R 계산", "리스크 확인"],
    },
];

export default function TemplatesPage() {
    const handleDownload = (templateId: string) => {
        // In production, this would trigger actual file download
        alert(`${templateId} 템플릿 다운로드가 곧 제공됩니다. 텔레그램에서 요청해 주세요!`);
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "도구", href: "/tools" }, { label: "템플릿" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <FileSpreadsheet className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">트레이딩 템플릿</h1>
                        <p className="text-muted-foreground">
                            체계적인 트레이딩을 위한 무료 템플릿
                        </p>
                    </motion.div>

                    {/* Templates Grid */}
                    <div className="grid gap-6">
                        {templates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-xl bg-card border border-border/50"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-foreground">{template.title}</h3>
                                            <span className="px-2 py-0.5 rounded text-xs bg-gold/10 text-gold">{template.format}</span>
                                        </div>
                                        <p className="text-muted-foreground mb-4">{template.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {template.includes.map((item) => (
                                                <span key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CheckCircle2 className="w-3 h-3 text-gold" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(template.id)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gold/10 text-gold font-medium hover:bg-gold/20 transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        다운로드
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 p-6 rounded-xl bg-card/50 border border-border/50 text-center"
                    >
                        <p className="text-muted-foreground mb-4">
                            원하는 템플릿이 없으신가요?
                        </p>
                        <a
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="text-gold hover:underline"
                        >
                            텔레그램에서 요청하기 →
                        </a>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
