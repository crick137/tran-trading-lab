"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Calendar, FileText, Search, ArrowRight } from "lucide-react";

const reports = [
    { date: "2024-01-19", title: "주간 시장 리뷰: 반도체 랠리와 원화 약세", type: "weekly", slug: "weekly-2024-01-19" },
    { date: "2024-01-18", title: "일간 브리핑: KOSPI 2,500 돌파 시도", type: "daily", slug: "daily-2024-01-18" },
    { date: "2024-01-17", title: "일간 브리핑: 외국인 매수세 지속", type: "daily", slug: "daily-2024-01-17" },
    { date: "2024-01-16", title: "일간 브리핑: 중국 GDP 발표 영향", type: "daily", slug: "daily-2024-01-16" },
    { date: "2024-01-15", title: "일간 브리핑: 삼성전자 실적 프리뷰", type: "daily", slug: "daily-2024-01-15" },
    { date: "2024-01-12", title: "주간 시장 리뷰: 미국 CPI와 금리 전망", type: "weekly", slug: "weekly-2024-01-12" },
    { date: "2024-01-11", title: "일간 브리핑: 코스닥 강세", type: "daily", slug: "daily-2024-01-11" },
    { date: "2024-01-10", title: "일간 브리핑: 2차전지 반등", type: "daily", slug: "daily-2024-01-10" },
];

export default function ReportsPage() {
    const [filter, setFilter] = useState<"all" | "daily" | "weekly">("all");
    const [search, setSearch] = useState("");

    const filteredReports = reports.filter((r) => {
        const matchesFilter = filter === "all" || r.type === filter;
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "리포트 아카이브" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">리포트 아카이브</h1>
                                <p className="text-muted-foreground">일간/주간 시장 분석 리포트</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="검색..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { id: "all", label: "전체" },
                                { id: "daily", label: "일간" },
                                { id: "weekly", label: "주간" },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id as typeof filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.id
                                            ? "bg-gold text-background"
                                            : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="space-y-3">
                        {filteredReports.map((report, index) => (
                            <motion.div
                                key={report.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/blog/${report.slug}`}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-gold/50 transition-all group"
                                >
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                                        <Calendar className="w-4 h-4" />
                                        {report.date}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.type === "weekly"
                                            ? "bg-gold/20 text-gold"
                                            : "bg-muted text-muted-foreground"
                                        }`}>
                                        {report.type === "weekly" ? "주간" : "일간"}
                                    </span>
                                    <span className="flex-1 text-foreground group-hover:text-gold transition-colors">
                                        {report.title}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredReports.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
