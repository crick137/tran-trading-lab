export interface CoinPrice {
    id: string;
    symbol: string;
    usd: number;
    usd_24h_change: number;
}

export async function fetchCoinPrices(): Promise<CoinPrice[] | null> {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return null;
        const data = await res.json();

        return [
            {
                id: "bitcoin",
                symbol: "BTC",
                usd: data.bitcoin?.usd ?? 0,
                usd_24h_change: data.bitcoin?.usd_24h_change ?? 0,
            },
            {
                id: "ethereum",
                symbol: "ETH",
                usd: data.ethereum?.usd ?? 0,
                usd_24h_change: data.ethereum?.usd_24h_change ?? 0,
            },
        ];
    } catch {
        return null;
    }
}
