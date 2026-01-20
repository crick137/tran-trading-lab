"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("light", savedTheme === "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("light", newTheme === "light");
    };

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-card border border-border/50" />
        );
    }

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors overflow-hidden"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            <motion.div
                initial={false}
                animate={{
                    y: theme === "dark" ? 0 : -40,
                    opacity: theme === "dark" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Moon className="w-5 h-5" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    y: theme === "light" ? 0 : 40,
                    opacity: theme === "light" ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Sun className="w-5 h-5" />
            </motion.div>
        </motion.button>
    );
}
