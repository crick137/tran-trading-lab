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
        path: "/switchboard",
        title: t.switchboard.title,
        description: t.switchboard.subtitle,
        keywords: ["switchboard", "weekly signals", "risk-on", "risk-off", "market signals"],
    });
}

export default function SwitchboardLayout({ children }: { children: React.ReactNode }) {
    return children;
}
