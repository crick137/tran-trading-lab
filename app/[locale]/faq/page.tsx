import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { FAQContent } from "./faq-content";

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
    });
}

export default function FAQPage() {
    return <FAQContent />;
}
