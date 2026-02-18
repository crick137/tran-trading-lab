"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
    words: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

export function TextGenerateEffect({
    words,
    className,
    delay = 0,
    staggerDelay = 0.08,
}: TextGenerateEffectProps) {
    const [started, setStarted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const wordArray = words.split(" ");

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);

        const timer = setTimeout(() => setStarted(true), delay * 1000);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <span className={cn("inline", className)}>
            {wordArray.map((word, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: reducedMotion ? 1 : 0, y: 0 }}
                    animate={
                        started || reducedMotion
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                    }
                    transition={
                        reducedMotion
                            ? { duration: 0 }
                            : {
                                  duration: 0.4,
                                  delay: i * staggerDelay,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                              }
                    }
                    className="inline-block mr-[0.25em] last:mr-0"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}
