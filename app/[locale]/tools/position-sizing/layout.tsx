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
        path: "/tools/position-sizing",
        title: t.tools.positionSizing,
        description: t.tools.positionSizingDesc,
        keywords: ["position sizing", "position size calculator", "risk management"],
    });
}

export default function PositionSizingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
