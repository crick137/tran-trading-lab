import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { PrivacyContent } from "./privacy-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/privacy",
        title: (t as any).meta.privacyTitle,
        description: (t as any).meta.privacyDescription,
    });
}

export default function PrivacyPage() {
    return <PrivacyContent />;
}
