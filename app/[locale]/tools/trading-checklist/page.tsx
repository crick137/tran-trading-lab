import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { TradingChecklistContent } from "./trading-checklist-content";

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
    });
}

export default function TradingChecklistPage() {
    return <TradingChecklistContent />;
}
