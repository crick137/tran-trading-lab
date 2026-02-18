import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { PlaybooksContent } from "./playbooks-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/playbooks",
        title: t.playbooks.title,
        description: t.playbooks.subtitle,
    });
}

export default function PlaybooksPage() {
    return <PlaybooksContent />;
}
