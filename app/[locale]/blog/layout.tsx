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
        path: "/blog",
        title: t.blog.title,
        description: t.blog.subtitle,
        keywords: ["trading blog", "market analysis", "trading strategy", "financial education"],
    });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
