"use client"

import React from "react";
import { useBatchStockData } from "@/features/stock/hooks/useStockData"
import { formatPrice } from "@/lib/formatters";
import { useWatchlist } from "@/features/watchlist/hooks/useWatchlist";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import type { StockData } from "@/features/stock/types";

export function WatchlistSkeleton() {
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

interface WatchlistItemProps {
  stockData: StockData;
}

const WatchlistItem = React.memo(({ stockData }: WatchlistItemProps) => {
  const isPositive = stockData.change >= 0;

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors cursor-pointer">
      <div>
        <p className="font-semibold text-sm">{stockData.symbol}</p>
        <p className="text-xs text-gray-400 truncate max-w-[120px]" title={stockData.name}>
          {stockData.name?.split(" ")[0]}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatPrice(stockData.price)}</p>
        <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{stockData.changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
});

WatchlistItem.displayName = "WatchlistItem";

export function Watchlist() {
  const { symbols = [], isLoading: isWatchlistLoading } = useWatchlist();
  const { data: batchData, isError: isBatchError } = useBatchStockData(symbols, "1D");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">My Watchlist</p>
        <button className="text-gray-400 hover:text-black text-lg transition-colors">+</button>
      </div>

      {/* Error State */}
      {isBatchError && (
        <div className="flex items-center gap-2 p-3 border border-red-100 rounded-lg bg-red-50 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>Failed to load watchlist data.</p>
        </div>
      )}

      {/* Loading Watchlist */}
      {isWatchlistLoading && (
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <WatchlistSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isWatchlistLoading && symbols.length === 0 && (
        <div className="p-4 text-center border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 text-sm">Your watchlist is empty.</p>
        </div>
      )}

      {!isWatchlistLoading && symbols.length > 0 && (
        <div className="flex flex-col">
          {symbols.map((symbol) => {
            const stock = batchData?.[symbol];
            
            // Loading
            if (!stock) return <WatchlistSkeleton key={`skeleton-${symbol}`} />;
            
            return <WatchlistItem key={symbol} stockData={stock} />;
          })}
        </div>
      )}
    </div>
  );
}
