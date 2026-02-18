import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { BoldCallsContent } from "./bold-calls-content";

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
    });
}

export default function BoldCallsPage() {
    return <BoldCallsContent />;
}
