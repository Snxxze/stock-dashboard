"use client"

import { useStockData, useBatchStockData } from "@/hooks/useStockData"
import { formatPrice } from "@/lib/formatters";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockData } from "@/types/stock";

function WatchlistSkeleton() {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <div className="space-y-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-10 ml-auto" />
      </div>
    </div>
  );
}

function WatchlistItem({ symbol, initialData }: { symbol: string; initialData?: StockData }) {
  const { data, isLoading } = useStockData(symbol, "1D", { enabled: !initialData });

  const displayData = initialData || data;
  const isDataLoading = isLoading && !initialData;

  if (isDataLoading) return <WatchlistSkeleton />;
  if (!displayData) return null;
  
  const isPositive = displayData.change >= 0;

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="font-semibold text-sm">{displayData.symbol}</p>
        <p className="text-xs text-gray-400">{displayData.name?.split(" ")[0]}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatPrice(displayData.price)}</p>
        <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{displayData.changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export function Watchlist() {
  const { symbols, isLoading: isWatchlistLoading } = useWatchlist();
  const { data: batchData, isLoading: isBatchLoading } = useBatchStockData(symbols, "1D");

  const isLoading = isWatchlistLoading || isBatchLoading;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">My Watchlist</p>
        <button className="text-gray-400 hover:text-black text-lg">+</button>
      </div>

      {isLoading ? (
        // แสดง Skeleton 5 แถวไปก่อนขณะโหลดรายชื่อ ที่ไม่รู้ว่ามีกี่ตัว
        <>
          <WatchlistSkeleton />
          <WatchlistSkeleton />
          <WatchlistSkeleton />
          <WatchlistSkeleton />
          <WatchlistSkeleton />
        </>
      ) : (
        // แสดงรายการหุ้นจริง
        symbols.map((symbol) => (
          <WatchlistItem 
            key={symbol} 
            symbol={symbol} 
            initialData={batchData?.[symbol]} 
          />
        ))
      )}
    </div>
  );
}