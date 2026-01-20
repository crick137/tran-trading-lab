"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function BriefingsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <h1 className="text-4xl font-bold text-foreground mb-4">일일 브리핑</h1>
                    <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                        매일 아침 배달되는 시장 핵심 브리핑 아카이브입니다.
                    </p>
                    <div className="bg-card/30 border border-border/50 rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-muted-foreground text-lg mb-6">
                            현재 공개된 브리핑이 없습니다.<br />
                            텔레그램에서 실시간 브리핑을 받아보세요.
                        </p>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            텔레그램 채널 입장
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
