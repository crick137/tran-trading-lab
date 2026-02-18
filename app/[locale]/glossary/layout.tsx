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
        path: "/glossary",
        title: t.glossary.title,
        description: (t as any).meta.glossaryDescription,
        keywords: ["trading glossary", "SMC terms", "trading terminology", "order block", "fair value gap"],
    });
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
