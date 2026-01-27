"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse headings from content
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const matches: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].replace(/\*\*/g, "").trim();
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9가-힣]+/g, "-")
                .replace(/(^-|-$)/g, "");
            matches.push({ id, text, level });
        }

        setHeadings(matches);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -66% 0px" }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden xl:block fixed right-4 top-32 w-56 max-h-[70vh] overflow-y-auto"
        >
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gold rounded-full" />
                    목차
                </h4>
                <ul className="space-y-2">
                    <AnimatePresence>
                        {headings.map((heading) => (
                            <motion.li
                                key={heading.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`${heading.level === 3 ? "pl-4" : ""}`}
                            >
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(heading.id)?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }}
                                    className={`block text-sm py-1 transition-all duration-200 hover:text-gold ${activeId === heading.id
                                        ? "text-gold font-medium"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {heading.text}
                                </a>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
        </motion.nav>
    );
}
