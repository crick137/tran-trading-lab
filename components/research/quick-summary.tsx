"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface QuickSummaryProps {
    items: {
        icon: string;
        text: string;
    }[];
}

export function QuickSummary({ items }: QuickSummaryProps) {
    const t = useTranslations("researchPost");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-cv-elevated/50 border border-[var(--border-default)] rounded-2xl p-6 mb-8"
        >
            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">{t("quickSummary")}</h2>
                    <p className="text-xs text-[var(--text-secondary)]">{t("tldr")}</p>
                </div>
            </div>

            {/* Items */}
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="text-[var(--text-secondary)] leading-relaxed">{item.text}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
