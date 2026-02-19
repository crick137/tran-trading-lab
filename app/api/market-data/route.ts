import { NextResponse } from "next/server";
import { fetchCoinPrices } from "@/lib/api/coingecko";
import { fetchFearGreed } from "@/lib/api/alternative-me";
import { fetchVix, fetchTreasuryYield } from "@/lib/api/alpha-vantage";

export const revalidate = 300; // 5 minutes

export async function GET() {
    // Wrap each API call individually so partial failures don't break everything
    const [coins, fearGreed, vix, treasury] = await Promise.all([
        fetchCoinPrices().catch(() => null),
        fetchFearGreed().catch(() => null),
        fetchVix().catch(() => null),
        fetchTreasuryYield().catch(() => null),
    ]);

    return NextResponse.json(
        {
            coins,
            fearGreed,
            vix,
            treasury,
            updatedAt: new Date().toISOString(),
        },
        {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        }
    );
}
