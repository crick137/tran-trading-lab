"use client";

import { Clock, Zap } from "lucide-react";
import { siteConfig } from "@/src/config/site.config";

interface HardSignalBarProps {
    className?: string;
}

export function HardSignalBar({ className = "" }: HardSignalBarProps) {
    // Parse the lastUpdated date from config
    const lastUpdated = new Date(siteConfig.lastUpdated);
    const year = lastUpdated.getFullYear();
    const month = lastUpdated.getMonth() + 1;
    const day = lastUpdated.getDate();
    const hours = lastUpdated.getHours().toString().padStart(2, "0");
    const minutes = lastUpdated.getMinutes().toString().padStart(2, "0");

    return (
        <div className={`bg-card/80 border-y border-border/50 backdrop-blur-sm ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-2">
                    {/* Last Update Time */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gold" />
                        <span className="text-muted-foreground">마지막 업데이트:</span>
                        <span className="text-foreground font-medium">
                            {year}년 {month}월 {day}일 {hours}:{minutes} KST
                        </span>
                    </div>

                    {/* Methodology Keywords */}
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-gold hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                SMC
                            </span>
                            <span className="text-muted-foreground/50">·</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                Liquidity
                            </span>
                            <span className="text-muted-foreground/50">·</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                                Timing
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
