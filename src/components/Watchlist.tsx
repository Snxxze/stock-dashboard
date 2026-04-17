"use client"

import { useStockData } from "@/hooks/useStockData"
import { formatPrice } from "@/lib/formatters";

const WATCHLIST = ["AAPL", "TSLA", "GOOGL", "MSFT", "AMZN"];

function WatchlistItem({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStockData(symbol, "1D");
  if (isLoading) {
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-50 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-16" />
        <div className="h-4 bg-gray-100 rounded w-20" />
      </div>
    );
  }
  if (!data) return null;
  const isPositive = data.change >= 0;
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="font-semibold text-sm">{data.symbol}</p>
        <p className="text-xs text-gray-400">{data.name?.split(" ")[0]}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatPrice(data.price)}</p>
        <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

// แสดง Watchlist ทั้งหมด
export function Watchlist() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">My Watchlist</p>
        <button className="text-gray-400 hover:text-black text-lg">+</button>
      </div>
      {WATCHLIST.map((symbol) => (
        <WatchlistItem key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}