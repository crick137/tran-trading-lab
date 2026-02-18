"use client";

import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    borderColor?: string;
    duration?: number;
}

export function MovingBorder({
    children,
    className,
    containerClassName,
    borderColor = "rgba(255, 165, 0, 0.4)",
    duration = 4,
}: MovingBorderProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={cn("relative rounded-xl p-[1px] overflow-hidden", containerClassName)}
        >
            {/* Animated border gradient */}
            <div
                className="absolute inset-0 rounded-xl"
                aria-hidden="true"
                style={{
                    background: `conic-gradient(from var(--border-angle, 0deg), transparent 60%, ${borderColor} 80%, transparent 100%)`,
                    animation: `moving-border-spin ${duration}s linear infinite`,
                }}
            />
            {/* Inner content with solid bg */}
            <div className={cn("relative rounded-xl bg-cv-elevated", className)}>
                {children}
            </div>
        </div>
    );
}
