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
        path: "/tools/trading-checklist",
        title: t.tools.tradingChecklist,
        description: t.tools.tradingChecklistDesc,
        keywords: ["trading checklist", "매매 체크리스트", "trade process", "risk management"],
    });
}

export default function TradingChecklistLayout({ children }: { children: React.ReactNode }) {
    return children;
}
