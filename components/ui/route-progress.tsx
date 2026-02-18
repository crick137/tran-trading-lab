"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function RouteProgress() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "70%" }}
                    exit={{ width: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed top-0 left-0 h-[2px] z-[100]"
                    style={{ background: "var(--gradient-cta)" }}
                />
            )}
        </AnimatePresence>
    );
}
