import { useQuery } from "@tanstack/react-query";
import type { StockData, Timeframe } from "@/types/stock";
import { apiClient } from "@/lib/api-client";

// ดึงข้อมูลจาก API
async function fetchStock(symbol: string, timeframe: Timeframe):Promise<StockData> {
  return apiClient.get<StockData>("/stock", { symbol, timeframe });
}

export function useStockData(symbol: string, timeframe: Timeframe, options: { enabled?: boolean } = {}) {
  const refetchInterval = (timeframe === "1D" || timeframe === "1W")
    ? 5 * 60_000   // 5 นาที
    : 60 * 60_000; // 1 ชั่วโมง

  return useQuery({
    queryKey: ["stock", symbol, timeframe],
    queryFn: () => fetchStock(symbol, timeframe),
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    enabled: options.enabled !== false && !!symbol,
  });
}

// ดึงข้อมูลหุ้นหลายตัวพร้อมกัน ลดการขอหลาย req กับ API
export function useBatchStockData(symbols: string[], timeframe: Timeframe) {
  const refetchInterval = (timeframe === "1D" || timeframe === "1W")
    ? 5 * 60_000
    : 60 * 60_000;

  return useQuery({
    queryKey: ["stocks", "batch", symbols.sort().join(","), timeframe],
    queryFn: () => apiClient.get<Record<string, StockData>>("/stock", { 
      symbols: symbols.join(","), 
      timeframe 
    }),
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    enabled: symbols.length > 0,
  });
}
