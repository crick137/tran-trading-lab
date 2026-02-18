import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/tools/rr-calculator",
        title: t.tools.rrCalculator,
        description: t.tools.rrCalculatorDesc,
        keywords: ["risk reward", "R:R calculator", "risk to reward ratio"],
    });
}

export default function RRCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
