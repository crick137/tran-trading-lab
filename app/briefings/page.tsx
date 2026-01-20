"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Mail, Search, Calendar } from "lucide-react";

const briefings = [
    { date: "2024-01-20", title: "아침 브리핑: 아시아 시장 혼조, KOSPI 상승 출발 예상", time: "08:00" },
    { date: "2024-01-19", title: "아침 브리핑: 미국 증시 신고가, 나스닥 +1.7%", time: "08:00" },
    { date: "2024-01-18", title: "아침 브리핑: 중국 LPR 동결, 위안화 약세", time: "08:00" },
    { date: "2024-01-17", title: "아침 브리핑: 유럽 증시 상승, 독일 DAX +0.8%", time: "08:00" },
    { date: "2024-01-16", title: "아침 브리핑: 중국 GDP 5.2%, 예상 상회", time: "08:00" },
    { date: "2024-01-15", title: "아침 브리핑: 미국 휴장 (MLK Day)", time: "08:00" },
    { date: "2024-01-12", title: "아침 브리핑: 미국 PPI 예상 하회, 금리 인하 기대 상승", time: "08:00" },
    { date: "2024-01-11", title: "아침 브리핑: 미국 CPI 3.4%, 예상 소폭 상회", time: "08:00" },
];

export default function BriefingsPage() {
    const [search, setSearch] = useState("");

    const filtered = briefings.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "브리핑 아카이브" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">브리핑 아카이브</h1>
                                <p className="text-muted-foreground">매일 아침 08:00 KST 발송</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Subscribe CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-lg bg-gold/10 border border-gold/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                        <p className="text-sm text-foreground">
                            📬 매일 아침 브리핑을 받아보세요!
                        </p>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium hover:shadow-lg transition-all"
                        >
                            구독하기
                        </Link>
                    </motion.div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="브리핑 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                    </div>

                    {/* Briefings List */}
                    <div className="space-y-3">
                        {filtered.map((briefing, index) => (
                            <motion.div
                                key={briefing.date}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-lg bg-card border border-border/50"
                            >
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{briefing.date}</span>
                                    <span className="text-gold">{briefing.time}</span>
                                </div>
                                <p className="text-foreground">{briefing.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
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
