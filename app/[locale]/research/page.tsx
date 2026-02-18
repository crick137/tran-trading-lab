import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { ResearchContent } from "./research-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/research",
        title: t.research.title,
        description: t.research.subtitle,
    });
}

export default function ResearchPage() {
    return <ResearchContent />;
}
