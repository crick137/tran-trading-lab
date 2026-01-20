import { siteStats } from "@/lib/site-stats";
import Link from "next/link";
import { Send, Bell } from "lucide-react";

export function ArticleCTA() {
    return (
        <section className="my-16 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-gold/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                        무료 브리핑 구독하기
                    </h3>
                    <p className="text-muted-foreground max-w-lg">
                        매일 아침 08:00, 시장 핵심 요약과 트레이딩 아이디어를 텔레그램으로 받아보세요.
                        가입비 없이 완전 무료입니다.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={siteStats.telegramLink}
                        target="_blank"
                        className="flex-shrink-0 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        텔레그램 입장
                    </Link>
                </div>
            </div>
        </section>
    );
}
