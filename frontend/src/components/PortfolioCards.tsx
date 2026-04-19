"use client"

import { useStockData, useBatchStockData } from "@/hooks/useStockData"
import { formatPrice } from "@/lib/formatters"
import { usePortfolio } from "@/hooks/usePortfolio";
import { Skeleton } from "@/components/ui/skeleton"
import type { StockData } from "@/types/stock";

function PortfolioCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44">
      <Skeleton className="h-4 w-16 mb-3" />
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function PortfolioCard({ symbol, initialData }: { symbol: string; initialData?: StockData }) {
  const { data, isLoading } = useStockData(symbol, "1D", { enabled: !initialData });
  
  const displayData = initialData || data;
  const isDataLoading = isLoading && !initialData;

  if (isDataLoading) return <PortfolioCardSkeleton />;
  if (!displayData) return null;
  
  const isPositive = displayData.change >= 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm">{displayData.name?.split(" ")[0]}</p>
        <span className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "↗" : "↘"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-400">Total Shares</p>
        <p className="font-bold">{formatPrice(displayData.price)}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-400">Total Return</p>
        <p className={`text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{displayData.changePercent.toFixed(2)}% {isPositive ? "↑" : "↓"}
        </p>
      </div>
    </div>
  );
}

export function PortfolioCards() {
  const { symbols, isLoading: isPortfolioLoading } = usePortfolio();
  const { data: batchData, isLoading: isBatchLoading } = useBatchStockData(symbols, "1D");

  const isLoading = isPortfolioLoading || isBatchLoading;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
      {isLoading ? (
        <>
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
          <PortfolioCardSkeleton />
        </>
      ) : (
        symbols.map((symbol) => (
          <PortfolioCard 
            key={symbol} 
            symbol={symbol} 
            initialData={batchData?.[symbol]} 
          />
        ))
      )}
    </div>
  );
}