"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ScenarioCardProps {
    type: 'bullish' | 'bearish';
    title: string;
    condition: string;
    meaning?: string;
    expectedFlow: string;
    strategy?: string;
    delay?: number;
}

export function ScenarioCard({
    type,
    title,
    condition,
    meaning,
    expectedFlow,
    strategy,
    delay = 0
}: ScenarioCardProps) {
    const t = useTranslations("researchPost");
    const isBullish = type === 'bullish';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={`rounded-xl border p-6 ${isBullish
                    ? 'bg-bullish/5 border-bullish/30'
                    : 'bg-bearish/5 border-bearish/30'
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isBullish ? 'bg-bullish/20' : 'bg-bearish/20'
                    }`}>
                    {isBullish
                        ? <TrendingUp className="w-5 h-5 text-bullish" />
                        : <AlertTriangle className="w-5 h-5 text-bearish" />
                    }
                </div>
                <h3 className={`text-lg font-bold ${isBullish ? 'text-bullish' : 'text-bearish'
                    }`}>
                    {title}
                </h3>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
                <div>
                    <span className="text-white/50 font-medium">{t("conditionLabel")}: </span>
                    <span className="text-white">{condition}</span>
                </div>
                {meaning && (
                    <div>
                        <span className="text-white/50 font-medium">{t("meaningLabel")}: </span>
                        <span className="text-white">{meaning}</span>
                    </div>
                )}
                <div>
                    <span className="text-white/50 font-medium">{t("expectedFlowLabel")}: </span>
                    <span className="text-white">{expectedFlow}</span>
                </div>
                {strategy && (
                    <div className={`mt-4 pt-4 border-t ${isBullish ? 'border-bullish/20' : 'border-bearish/20'
                        }`}>
                        <span className="text-white/50 font-medium">{t("strategyLabel")}: </span>
                        <span className="text-white">{strategy}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
