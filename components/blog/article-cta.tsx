"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Send } from "lucide-react";

export function ArticleCTA() {
    return (
        <section className="my-16 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-gold/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                        매일 아침, 시장의 흐름을 놓치지 마세요
                    </h3>
                    <p className="text-muted-foreground max-w-lg">
                        5,000명 이상의 투자자가 선택한 TranTradingLab 텔레그램 채널에서
                        실시간 시그널과 심층 분석을 받아보세요.
                    </p>
                </div>
                <Link
                    href="https://t.me/TranTradingLab"
                    target="_blank"
                    className="flex-shrink-0 px-8 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    텔레그램 무료 입장
                </Link>
            </div>
        </section>
    );
}
