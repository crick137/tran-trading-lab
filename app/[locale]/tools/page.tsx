"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Wrench, Calculator, FileSpreadsheet, Download, ArrowRight } from "lucide-react";

const tools = [
    {
        id: "position-sizing",
        title: "포지션 사이징 계산기",
        description: "계좌 크기와 리스크 비율에 맞는 적정 포지션 사이즈를 계산합니다.",
        icon: Calculator,
        href: "/tools/position-sizing",
        color: "from-emerald-500/20 to-emerald-500/5",
    },
    {
        id: "rr-calculator",
        title: "R:R 계산기",
        description: "진입가, 손절가, 목표가로 리스크 리워드 비율을 계산합니다.",
        icon: Calculator,
        href: "/tools/rr-calculator",
        color: "from-blue-500/20 to-blue-500/5",
    },
    {
        id: "templates",
        title: "트레이딩 템플릿",
        description: "트레이딩 저널, 주간 리뷰, 체크리스트 템플릿을 다운로드하세요.",
        icon: FileSpreadsheet,
        href: "/tools/templates",
        color: "from-gold/20 to-gold/5",
    },
];

export default function ToolsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "도구" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <Wrench className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">트레이딩 도구</h1>
                        <p className="text-lg text-muted-foreground">
                            리스크 관리와 트레이딩 기록을 위한 무료 도구
                        </p>
                    </motion.div>

                    {/* Tools Grid */}
                    <div className="grid gap-6">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={tool.href}
                                    className={`flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r ${tool.color} border border-border/50 hover:border-gold/50 transition-all group`}
                                >
                                    <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                                        <tool.icon className="w-8 h-8 text-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors mb-1">
                                            {tool.title}
                                        </h3>
                                        <p className="text-muted-foreground">{tool.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
