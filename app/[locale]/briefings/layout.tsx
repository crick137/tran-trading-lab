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
        path: "/briefings",
        title: t.briefings.title,
        description: t.briefings.subtitle,
    });
}

export default function BriefingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
