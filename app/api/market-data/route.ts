import { NextResponse } from "next/server";
import { fetchCoinPrices } from "@/lib/api/coingecko";
import { fetchFearGreed } from "@/lib/api/alternative-me";
import { fetchVix, fetchTreasuryYield } from "@/lib/api/alpha-vantage";

export const revalidate = 300; // 5 minutes

export async function GET() {
    const [coins, fearGreed, vix, treasury] = await Promise.all([
        fetchCoinPrices(),
        fetchFearGreed(),
        fetchVix(),
        fetchTreasuryYield(),
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
