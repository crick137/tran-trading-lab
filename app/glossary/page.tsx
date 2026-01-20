"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BookOpen, Search, ChevronDown } from "lucide-react";

const glossaryTerms = [
    {
        term: "Order Block (OB)",
        korean: "오더 블록",
        category: "SMC",
        definition: "기관 주문이 집중된 가격대. 강한 상승 또는 하락 전 마지막으로 형성된 반대 방향 캔들을 의미합니다.",
        example: "상승 OB: 강한 상승 전 마지막 음봉 영역 → 가격 되돌림 시 매수 구간",
    },
    {
        term: "Fair Value Gap (FVG)",
        korean: "공정가치갭",
        category: "SMC",
        definition: "급격한 가격 변동으로 생긴 가격 공백. 3개 캔들 중 첫 번째와 세 번째 캔들의 위크(꼬리)가 겹치지 않는 구간입니다.",
        example: "FVG 발생 후 가격이 해당 갭을 메우러 돌아올 확률이 높음",
    },
    {
        term: "Liquidity",
        korean: "유동성",
        category: "SMC",
        definition: "스탑로스와 진입 주문이 집중되어 있는 가격대. 고점/저점, 동일 가격대(Equal Highs/Lows)에 주로 형성됩니다.",
        example: "기관은 유동성이 모여있는 곳에서 포지션을 정리하려 함",
    },
    {
        term: "Break of Structure (BOS)",
        korean: "구조 이탈",
        category: "SMC",
        definition: "이전 고점 또는 저점을 돌파하는 가격 움직임. 추세 전환 또는 추세 지속의 신호로 해석됩니다.",
        example: "상승 추세에서 이전 고점 돌파 = 강세 BOS",
    },
    {
        term: "Change of Character (CHOCH)",
        korean: "성격 변화",
        category: "SMC",
        definition: "추세 내에서 반대 방향으로의 첫 번째 구조 이탈. 잠재적 추세 전환 신호입니다.",
        example: "하락 추세에서 처음으로 이전 고점을 돌파하면 CHOCH",
    },
    {
        term: "ORB (Opening Range Breakout)",
        korean: "시가 범위 돌파",
        category: "ORB",
        definition: "장 시작 후 일정 시간(보통 15~30분) 동안 형성된 고점과 저점을 기준으로 돌파 방향에 진입하는 전략입니다.",
        example: "개장 후 30분 고점 2,500 돌파 시 롱 진입, 스탑은 30분 저점",
    },
    {
        term: "R:R (Risk-Reward Ratio)",
        korean: "리스크 리워드 비율",
        category: "리스크 관리",
        definition: "예상 손실(스탑로스까지 거리) 대비 예상 이익(목표가까지 거리)의 비율입니다.",
        example: "진입 100, 스탑 95, 목표 115 → R:R = 3:1",
    },
    {
        term: "Position Sizing",
        korean: "포지션 사이징",
        category: "리스크 관리",
        definition: "계좌 크기와 리스크 허용치에 따라 한 번 거래에 투입할 금액/수량을 결정하는 것입니다.",
        example: "계좌 1000만원, 리스크 2% → 최대 손실 20만원으로 포지션 크기 계산",
    },
];

const categories = Array.from(new Set(glossaryTerms.map((t) => t.category)));

export default function GlossaryPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("전체");
    const [openTerm, setOpenTerm] = useState<string | null>(null);

    const filtered = glossaryTerms.filter((t) => {
        const matchesSearch =
            t.term.toLowerCase().includes(search.toLowerCase()) ||
            t.korean.includes(search) ||
            t.definition.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "전체" || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "용어집" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <BookOpen className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">트레이딩 용어집</h1>
                        <p className="text-lg text-muted-foreground">
                            SMC, ORB, 리스크 관리에서 자주 사용하는 용어를 정리했습니다.
                        </p>
                    </motion.div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="용어 검색..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setActiveCategory("전체")}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === "전체"
                                        ? "bg-gold text-background"
                                        : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                전체
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                            ? "bg-gold text-background"
                                            : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Terms List */}
                    <div className="space-y-3">
                        {filtered.map((term, index) => (
                            <motion.div
                                key={term.term}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="rounded-lg bg-card border border-border/50 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenTerm(openTerm === term.term ? null : term.term)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-card/80 transition-colors"
                                >
                                    <div>
                                        <span className="font-medium text-foreground">{term.term}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">({term.korean})</span>
                                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gold/10 text-gold">{term.category}</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openTerm === term.term ? "rotate-180" : ""}`} />
                                </button>
                                {openTerm === term.term && (
                                    <div className="px-4 pb-4 border-t border-border/30">
                                        <p className="text-muted-foreground mt-3 mb-3">{term.definition}</p>
                                        <div className="p-3 rounded bg-muted/20 text-sm">
                                            <span className="text-gold font-medium">예시:</span>{" "}
                                            <span className="text-muted-foreground">{term.example}</span>
                                        </div>
                                    </div>
                                )}
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
