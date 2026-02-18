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
        path: "/community",
        title: t.community.title,
        description: t.community.subtitle,
    });
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return children;
}
