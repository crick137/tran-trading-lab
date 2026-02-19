"use client";

import { useRef, useEffect, ReactNode } from "react";

export function SectionReveal({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`opacity-0 translate-y-6 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 ${className}`}
        >
            {children}
        </div>
    );
}
