"use client"

import React from "react";
import { useBatchStockData } from "@/features/stock/hooks/useStockData";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import type { StockData } from "@/features/stock/types";
import type { PortfolioItem } from "@/features/portfolio/types";

export function PortfolioCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44 flex-shrink-0">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-8" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

interface PortfolioCardProps {
  portfolioItem: PortfolioItem;
  stockData: StockData;
}

const PortfolioCard = React.memo(({ portfolioItem, stockData }: PortfolioCardProps) => {
  const isPositive = stockData.change >= 0;
  
  const currentTotalValue = portfolioItem.shares * stockData.price;
  const costBasis = portfolioItem.shares * portfolioItem.avgCost;
  const returnAmount = currentTotalValue - costBasis;
  const returnPercent = costBasis > 0 ? (returnAmount / costBasis) * 100 : 0;
  const isReturnPositive = returnAmount >= 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44 flex-shrink-0 hover:shadow-md hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm truncate max-w-[100px]" title={stockData.name}>
          {stockData.name?.split(" ")[0]}
        </p>
        <span className={`flex items-center gap-1 text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-400">Shares</p>
        <p className="font-bold">{portfolioItem.shares}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-400">Total Return</p>
        <p className={`text-sm font-semibold flex items-center gap-1 ${isReturnPositive ? "text-green-500" : "text-red-500"}`}>
          {isReturnPositive ? "+" : ""}{returnPercent.toFixed(2)}% 
          {isReturnPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </p>
      </div>
    </div>
  );
});

PortfolioCard.displayName = "PortfolioCard";

export function PortfolioCards() {
  const { portfolio = [], symbols = [], isLoading: isPortfolioLoading } = usePortfolio();
  const { data: batchData, isError: isBatchError } = useBatchStockData(symbols, "1D");

  // Error State
  if (isBatchError) {
    return (
      <div className="flex items-center gap-2 p-4 border border-red-100 rounded-2xl bg-red-50 text-red-500 mb-6 text-sm">
        <AlertCircle className="w-4 h-4" />
        Failed to load stock prices. Please try again later.
      </div>
    );
  }

  // Portfolio Loading State
  if (isPortfolioLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PortfolioCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // Empty State
  if (portfolio.length === 0) {
    return (
      <div className="p-6 border border-dashed border-gray-200 rounded-2xl mb-6 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Your portfolio is empty. Add some stocks to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
      {portfolio.map((item) => {
        const stock = batchData?.[item.symbol];
        
        if (!stock) return <PortfolioCardSkeleton key={`skeleton-${item.symbol}`} />;
        
        return (
          <PortfolioCard 
            key={item.symbol} 
            portfolioItem={item} 
            stockData={stock} 
          />
        );
      })}
    </div>
  );
}
