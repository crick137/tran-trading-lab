import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { RRCalculatorContent } from "./rr-calculator-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/tools/rr-calculator",
        title: t.rrCalc.title,
        description: t.rrCalc.subtitle,
    });
}

export default function RRCalculatorPage() {
    return <RRCalculatorContent />;
}
