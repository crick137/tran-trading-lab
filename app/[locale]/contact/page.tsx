import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { ContactContent } from "./contact-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/contact",
        title: t.contact.title,
        description: t.contact.subtitle,
    });
}

export default function ContactPage() {
    return <ContactContent />;
}
