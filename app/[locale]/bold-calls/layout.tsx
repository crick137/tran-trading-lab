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
        path: "/bold-calls",
        title: t.boldCalls.title,
        description: t.boldCalls.subtitle,
        keywords: ["bold calls", "market predictions", "trading accountability", "win rate"],
    });
}

export default function BoldCallsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
