import { useQuery } from "@tanstack/react-query";
import type { StockData, Timeframe, MarketNewsItem } from "@/features/stock/types";
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

// ดึงข้อมูลหุ้นที่กำลังมาแรง
export function useTrendingStocks() {
  return useQuery({
    queryKey: ["stocks", "trending", "v2"],
    queryFn: () => apiClient.get<Record<string, StockData>>("/trending"),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

// ดึงข้อมูลข่าวสารตลาด
type MarketNewsParams = {
  query?: string;      
  limit?: number;      
  category?: string;   
};

export function useMarketNews(params?: MarketNewsParams) {
  return useQuery({
    queryKey: ["news", "market", params],
    queryFn: () => {
      const queryParams: Record<string, string> = {};
      if (params?.query) queryParams.q = params.query;
      if (params?.limit) queryParams.limit = params.limit.toString();
      else queryParams.limit = "10";
      if (params?.category) queryParams.category = params.category;
      
      return apiClient.get<MarketNewsItem[]>("/news", queryParams);
    },
    staleTime: 15 * 60_000, // ข่าวไม่ต้องอัปเดตบ่อยมาก เก็บไว้ 15 นาที
  });
}

export function useIndexNews() {
  return useMarketNews({
    query: "S&P 500 Nasdaq Dow Jones",
    limit: 10,
  });
}
