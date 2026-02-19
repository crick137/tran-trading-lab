"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
    className?: string;
    size?: number;
}

export function Spotlight({ className, size = 400 }: SpotlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        },
        []
    );

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            className={cn("pointer-events-auto absolute inset-0 z-[1]", className)}
        >
            <div
                className="pointer-events-none absolute transition-opacity duration-500"
                style={{
                    left: position.x - size / 2,
                    top: position.y - size / 2,
                    width: size,
                    height: size,
                    opacity: isVisible ? 1 : 0,
                    background: `radial-gradient(circle at center, rgba(255, 165, 0, 0.04) 0%, rgba(255, 165, 0, 0.01) 30%, transparent 70%)`,
                    borderRadius: "50%",
                }}
            />
        </div>
    );
}
