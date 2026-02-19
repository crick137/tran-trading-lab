"use client";

import { useRef } from "react";

interface UseGsapScrollOptions {
    from?: Record<string, unknown>;
    to?: Record<string, unknown>;
    trigger?: unknown;
    start?: string;
    stagger?: number;
    children?: boolean;
}

export function useGsapScroll<T extends HTMLElement>(
    _options: UseGsapScrollOptions = {}
) {
    return useRef<T>(null);
}
