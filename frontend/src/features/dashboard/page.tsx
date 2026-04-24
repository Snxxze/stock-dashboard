"use client";

import { User } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { useStockData } from "@/features/stock/hooks/useStockData";
import type { Timeframe } from "@/features/stock/types";
import { StockCard, StockCardSkeleton } from "@/features/stock/components/StockCard";
import { Watchlist } from "@/features/watchlist/components/Watchlist";
import { PortfolioCards } from "@/features/portfolio/components/PortfolioCards";

export default function Dashboard() {
  const [symbol, setSymbol] = useState("AAPL");
  const [timeframe, setTimeframe] = useState<Timeframe>("1W");
  const { data, isLoading, isError, refetch } = useStockData(symbol, timeframe);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search stocks (e.g. AAPL, TSLA)"
            defaultValue={symbol}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSymbol((e.target as HTMLInputElement).value.toUpperCase());
              }
            }}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4 text-gray-500" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Portfolio</h1>

          <PortfolioCards />

          <div className="flex gap-6">
            {/* Chart */}
            <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 min-h-96">
              {isLoading ? (
                <StockCardSkeleton />

              ) : isError ? (
                <div>
                  <p className="text-red-500">Something went wrong</p>
                  <button onClick={() => refetch()} className="text-sm text-blue-500 mt-2 underline">Retry</button>
                </div>

              ) : data ? (
                <StockCard
                  data={data}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              ) : null}

            </div>

            {/* Watchlist */}
            <div className="w-72 bg-white rounded-2xl p-6 border border-gray-100">
              <Watchlist />
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

