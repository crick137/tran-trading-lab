"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Send, Link2, Check } from "lucide-react";

interface SocialShareProps {
    title: string;
    url?: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState(url || "");
    const t = useTranslations("blogPost");

    useEffect(() => {
        if (!url) {
            setShareUrl(window.location.href);
        }
    }, [url]);

    const shareLinks = [
        {
            name: "Twitter",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
            color: "hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50",
        },
        {
            name: "Telegram",
            icon: Send,
            href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
            color: "hover:bg-[#229ED9]/20 hover:text-[#229ED9] hover:border-[#229ED9]/50",
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)] mr-2">{t("share")}</span>
            {shareLinks.map((link) => (
                <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] transition-all ${link.color}`}
                    title={`${t("shareOn")} ${link.name}`}
                >
                    <link.icon className="w-4 h-4" />
                </motion.a>
            ))}
            <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg border transition-all ${copied
                        ? "bg-green-500/20 text-green-500 border-green-500/50"
                        : "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-accent/20 hover:text-accent hover:border-accent/50"
                    }`}
                title={t("copyLink")}
            >
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check className="w-4 h-4" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="link"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Link2 className="w-4 h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
