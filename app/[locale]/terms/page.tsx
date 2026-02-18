import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { TermsContent } from "./terms-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/terms",
        title: (t as any).meta.termsTitle,
        description: (t as any).meta.termsDescription,
    });
}

export default function TermsPage() {
    return <TermsContent />;
}
