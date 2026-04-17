import { useQuery } from "@tanstack/react-query";
import type { StockData, Timeframe } from "@/types/stock";

// ดึงข้อมูลจาก API
async function fetchStock(symbol: string, timeframe: Timeframe):Promise<StockData> {
  const res = await fetch(`/api/stock?symbol=${symbol}&timeframe=${timeframe}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch");
  }

  return res.json()
}

export function useStockData(symbol: string, timeframe: Timeframe) {
  const refetchInterval = (timeframe === "1D" || timeframe === "1W")
    ? 5 * 60_000   // 5 นาที
    : 60 * 60_000; // 1 ชั่วโมง
  return useQuery({
    queryKey: ["stock", symbol, timeframe],
    queryFn: () => fetchStock(symbol, timeframe),
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    enabled: !!symbol,
  });
}