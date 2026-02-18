// Alpha Vantage API wrapper
// Requires ALPHA_VANTAGE_API_KEY in .env.local (free: 25 calls/day)

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export interface VixData {
    value: number;
    change: number;
}

export interface TreasuryYieldData {
    value: number;
    date: string;
}

export async function fetchVix(): Promise<VixData | null> {
    if (!API_KEY) return null;
    try {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIX&apikey=${API_KEY}`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const quote = data["Global Quote"];
        if (!quote || !quote["05. price"]) return null;

        return {
            value: parseFloat(quote["05. price"]),
            change: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
        };
    } catch {
        return null;
    }
}

export async function fetchTreasuryYield(): Promise<TreasuryYieldData | null> {
    if (!API_KEY) return null;
    try {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${API_KEY}`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const latest = data?.data?.[0];
        if (!latest) return null;

        return {
            value: parseFloat(latest.value),
            date: latest.date,
        };
    } catch {
        return null;
    }
}
