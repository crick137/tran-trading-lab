"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg text-white/50" aria-label="Toggle theme">
                <Moon className="w-4 h-4" />
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative p-2 rounded-lg text-white/50 hover:text-gold hover:bg-gold/5 transition-all duration-200"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <div className="relative w-4 h-4">
                {/* Sun icon */}
                <Sun
                    className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${isDark
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-90 scale-0"
                        }`}
                />
                {/* Moon icon */}
                <Moon
                    className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${isDark
                            ? "opacity-0 rotate-90 scale-0"
                            : "opacity-100 rotate-0 scale-100"
                        }`}
                />
            </div>
        </button>
    );
}
