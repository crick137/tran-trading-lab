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
        path: "/faq",
        title: t.faq.title,
        description: t.faq.subtitle,
        keywords: ["FAQ", "frequently asked questions", "trading help"],
    });
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return children;
}
