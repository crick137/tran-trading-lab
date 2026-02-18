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
        path: "/academy",
        title: t.academy.title,
        description: t.academy.subtitle,
        keywords: ["trading academy", "SMC education", "trading course", "market structure"],
    });
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
