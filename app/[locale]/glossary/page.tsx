import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { GlossaryContent } from "./glossary-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/glossary",
        title: t.glossary.title,
        description: t.meta.glossaryDescription,
    });
}

export default function GlossaryPage() {
    return <GlossaryContent />;
}
