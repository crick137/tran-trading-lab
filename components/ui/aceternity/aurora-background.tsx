"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
    children?: ReactNode;
    className?: string;
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Aurora gradient layers */}
            <div className="pointer-events-none absolute inset-0">
                {/* Base gradient */}
                <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-hero)" }}
                />
                {/* Animated aurora layer 1 — gold */}
                <div
                    className="absolute -inset-[100px] opacity-[0.015] animate-[aurora-drift-1_30s_ease-in-out_infinite]"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 165, 0, 0.6), transparent)",
                    }}
                />
                {/* Animated aurora layer 2 — green */}
                <div
                    className="absolute -inset-[100px] opacity-[0.012] animate-[aurora-drift-2_35s_ease-in-out_infinite]"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 40% at 60% 40%, rgba(0, 200, 81, 0.5), transparent)",
                    }}
                />
                {/* Animated aurora layer 3 — red accent */}
                <div
                    className="absolute -inset-[100px] opacity-[0.01] animate-[aurora-drift-3_28s_ease-in-out_infinite]"
                    style={{
                        background:
                            "radial-gradient(ellipse 50% 60% at 40% 60%, rgba(255, 59, 59, 0.4), transparent)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
