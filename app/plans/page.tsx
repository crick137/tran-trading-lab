"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const freeFeatures = [
    "매일 아침 시장 브리핑 (텔레그램)",
    "주간 시장 분석 리포트",
    "SMC/ORB 트레이딩 전략 가이드",
    "중국 금융 뉴스 한국어 번역",
    "포지션 사이징 / R:R 계산기",
    "트레이딩 용어집",
    "플레이북 (학습 커리큘럼)",
    "텔레그램 커뮤니티 참여",
];

const roadmapItems = [
    { status: "준비중", title: "실시간 시그널 알림", description: "중요 가격대 돌파 시 자동 알림" },
    { status: "준비중", title: "심화 비디오 강의", description: "SMC/ORB 실전 적용 동영상" },
    { status: "예정", title: "백테스트 라이브러리", description: "전략별 과거 성과 데이터" },
    { status: "예정", title: "커뮤니티 Q&A", description: "회원 간 질문/답변 게시판" },
];

export default function PlansPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            모든 콘텐츠, 완전 무료
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            TranTradingLab의 모든 교육 자료와 분석은 무료로 제공됩니다.<br />
                            가입비, 구독료, 숨겨진 비용 없이 지금 바로 시작하세요.
                        </p>
                    </motion.div>

                    {/* Free Features Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-2xl bg-card border border-gold/30 shadow-lg shadow-gold/5 mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">무료 제공 범위</h2>
                                <p className="text-muted-foreground text-sm">가입 즉시 이용 가능</p>
                            </div>
                        </div>
                        <ul className="grid md:grid-cols-2 gap-3 mb-8">
                            {freeFeatures.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-gold flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            텔레그램 무료 입장
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* Roadmap Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                            기능 로드맵 (예고)
                        </h2>
                        <p className="text-muted-foreground text-center mb-8">
                            더 나은 서비스를 위해 준비 중인 기능들입니다.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {roadmapItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    className="p-4 rounded-lg bg-card/50 border border-border/50"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === "준비중"
                                                ? "bg-gold/20 text-gold"
                                                : "bg-muted text-muted-foreground"
                                            }`}>
                                            {item.status}
                                        </span>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* FAQ CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground mb-4">
                            더 궁금한 점이 있으신가요?
                        </p>
                        <Link
                            href="/faq"
                            className="text-gold hover:underline"
                        >
                            자주 묻는 질문 확인하기
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
