import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { StartContent } from "./start-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/start",
        title: t.start.title,
        description: t.start.subtitle,
    });
}

export default function StartPage() {
    return <StartContent />;
}
