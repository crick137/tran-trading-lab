"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";

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
    const isBullish = type === 'bullish';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={`rounded-xl border p-6 ${isBullish
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-red-500/5 border-red-500/30'
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isBullish ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                    {isBullish
                        ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                        : <AlertTriangle className="w-5 h-5 text-red-400" />
                    }
                </div>
                <h3 className={`text-lg font-bold ${isBullish ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {title}
                </h3>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
                <div>
                    <span className="text-muted-foreground font-medium">조건: </span>
                    <span className="text-foreground">{condition}</span>
                </div>
                {meaning && (
                    <div>
                        <span className="text-muted-foreground font-medium">의미: </span>
                        <span className="text-foreground">{meaning}</span>
                    </div>
                )}
                <div>
                    <span className="text-muted-foreground font-medium">기대 흐름: </span>
                    <span className="text-foreground">{expectedFlow}</span>
                </div>
                {strategy && (
                    <div className={`mt-4 pt-4 border-t ${isBullish ? 'border-emerald-500/20' : 'border-red-500/20'
                        }`}>
                        <span className="text-muted-foreground font-medium">전략: </span>
                        <span className="text-foreground">{strategy}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
