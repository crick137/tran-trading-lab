export interface FearGreedData {
    value: number;
    classification: string;
    timestamp: string;
}

export async function fetchFearGreed(): Promise<FearGreedData | null> {
    try {
        const res = await fetch("https://api.alternative.me/fng/?limit=1", {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const entry = data?.data?.[0];
        if (!entry) return null;

        return {
            value: parseInt(entry.value, 10),
            classification: entry.value_classification,
            timestamp: entry.timestamp,
        };
    } catch {
        return null;
    }
}
