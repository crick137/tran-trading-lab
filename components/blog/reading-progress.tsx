"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const article = document.querySelector("article");
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            const start = articleTop - 100;
            const end = articleTop + articleHeight - windowHeight;
            const current = scrollY - start;
            const total = end - start;

            const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
            setProgress(percentage);
        };

        window.addEventListener("scroll", updateProgress);
        updateProgress();

        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <motion.div
            className="reading-progress"
            style={{ width: `${progress}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        />
    );
}
