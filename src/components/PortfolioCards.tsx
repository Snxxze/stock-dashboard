"use client"

import { useStockData } from "@/hooks/useStockData"
import { formatPrice } from "@/lib/formatters"

const PORTFOLIO = ["AAPL", "META", "MSFT", "GOOGL"];

function PortfolioCard({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStockData(symbol, "1D");
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-16 mb-3" />
        <div className="h-6 bg-gray-100 rounded w-24 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-16" />
      </div>
    );
  }
  if (!data) return null;
  const isPositive = data.change >= 0;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 min-w-44 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm">{data.name?.split(" ")[0]}</p>
    
        <span className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "↗" : "↘"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
      <p className="text-sm text-gray-400">Total Shares</p>
      <p className="font-bold">{formatPrice(data.price)}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-400">Total Return</p>

        <p
          className={`text-sm font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.changePercent.toFixed(2)}%
          {" "}
          {isPositive ? "↑" : "↓"}
        </p>
      </div>

    </div>
  );
}

export function PortfolioCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
      {PORTFOLIO.map((symbol) => (
        <PortfolioCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}