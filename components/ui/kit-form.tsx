"use client";

import { useEffect, useRef } from "react";

const KIT_FORM_UID = "6dd65de515";
const KIT_FORM_SRC = `https://trantradinglab.kit.com/${KIT_FORM_UID}/index.js`;

export function KitForm() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Avoid duplicate scripts
        if (el.querySelector("script")) return;

        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-uid", KIT_FORM_UID);
        script.src = KIT_FORM_SRC;
        el.appendChild(script);

        return () => {
            // Clean up on unmount
            if (el.querySelector("script")) {
                el.innerHTML = "";
            }
        };
    }, []);

    return <div ref={containerRef} className="kit-form-embed w-full min-h-[240px]" />;
}
