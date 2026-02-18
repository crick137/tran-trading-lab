"use client";

import { motion } from "framer-motion";

interface SectionBlockProps {
    icon: string;
    title: string;
    content: string;
    highlights?: string[];
    delay?: number;
}

export function SectionBlock({ icon, title, content, highlights, delay = 0 }: SectionBlockProps) {
    // Parse bold text in content
    const parseContent = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="mb-8"
        >
            {/* Header */}
            <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white mb-4">
                <span className="text-2xl">{icon}</span>
                {title}
            </h2>

            {/* Content */}
            <p className="text-white/60 leading-relaxed mb-4">
                {parseContent(content)}
            </p>

            {/* Highlights Box */}
            {highlights && highlights.length > 0 && (
                <div className="bg-cv-elevated/30 border-l-4 border-gold rounded-r-lg p-4">
                    <ul className="space-y-2">
                        {highlights.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-white/60">
                                <span className="text-gold mt-1">▸</span>
                                <span>{parseContent(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.section>
    );
}
