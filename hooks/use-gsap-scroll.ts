"use client";

import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface UseGsapScrollOptions {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    trigger?: RefObject<HTMLElement | null>;
    start?: string;
    stagger?: number;
    children?: boolean;
}

export function useGsapScroll<T extends HTMLElement>(
    options: UseGsapScrollOptions = {}
) {
    const ref = useRef<T>(null);
    const {
        from = { opacity: 0, y: 20 },
        to = { opacity: 1, y: 0 },
        trigger,
        start = "top 85%",
        stagger = 0,
        children = false,
    } = options;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const el = ref.current;
        if (!el) return;

        // Respect reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (children) {
                gsap.set(el.children, to);
            } else {
                gsap.set(el, to);
            }
            return;
        }

        const triggerEl = trigger?.current || el;
        const targets = children ? el.children : el;

        const tween = gsap.fromTo(targets, from, {
            ...to,
            duration: 0.6,
            ease: "power2.out",
            stagger: stagger,
            scrollTrigger: {
                trigger: triggerEl,
                start,
                toggleActions: "play none none none",
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [from, to, trigger, start, stagger, children]);

    return ref;
}
