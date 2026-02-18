"use client";

import { useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GsapProviderProps {
    children: ReactNode;
}

export function GsapProvider({ children }: GsapProviderProps) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return <>{children}</>;
}
