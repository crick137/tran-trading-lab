"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LampProps {
    children: React.ReactNode;
    className?: string;
}

export function Lamp({ children, className }: LampProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Glow cone above text */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-8 w-[200px] h-[60px]" aria-hidden="true">
                <motion.div
                    initial={{ opacity: 0, scaleX: 0.5 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full"
                    style={{
                        background:
                            "conic-gradient(from 90deg at 50% 0%, rgba(255, 165, 0, 0) 0deg, rgba(255, 165, 0, 0.12) 160deg, rgba(255, 165, 0, 0.12) 200deg, rgba(255, 165, 0, 0) 360deg)",
                        filter: "blur(16px)",
                    }}
                />
            </div>
            {/* Glow line */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-px w-[120px] h-[1px]" aria-hidden="true">
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="w-full h-full"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, rgba(255, 165, 0, 0.6), transparent)",
                    }}
                />
            </div>
            {children}
        </div>
    );
}
