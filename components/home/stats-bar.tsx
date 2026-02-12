"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export function StatsBar() {
    const t = useTranslations("stats");

    const stats = [
        { value: t("tradersCount"), label: t("tradersLabel"), useCounter: true, counterValue: 5000 },
        { value: t("briefingTime"), label: t("briefingLabel"), useCounter: false },
        { value: t("reportSchedule"), label: t("reportLabel"), useCounter: false },
    ];

    return (
        <section className="relative py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-card to-card/80 border-y border-border/30" />
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-gradient-gold mb-1">
                                {stat.useCounter ? (
                                    <><AnimatedCounter value={stat.counterValue!} />+</>
                                ) : (
                                    stat.value
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
