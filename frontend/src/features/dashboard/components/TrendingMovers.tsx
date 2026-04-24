"use client";

import React, { useRef } from "react";
import { useTrendingStocks } from "@/features/stock/hooks/useStockData";
import { formatPrice } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export function TrendingMovers() {
  const { data, isLoading, isError } = useTrendingStocks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-lg font-bold text-gray-900">
          Trending & Top Movers
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1.5">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-4 px-1 snap-x snap-mandatory" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />

        {isLoading || isError ? (
          // Skeletons
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="min-w-[240px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0 snap-start">
              <Skeleton className="h-6 w-16 mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : (
          Object.values(data || {}).map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div 
                key={stock.symbol} 
                className="min-w-[240px] md:min-w-[260px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer shrink-0 snap-start group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-gray-900 text-lg">{stock.symbol}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(stock.price)}</p>
                    <p className={`text-sm mt-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? "+" : ""}{formatPrice(stock.change)}
                    </p>
                  </div>
                </div>
                
                {/* Mini-chart */}
                <div className="h-12 mt-6 -mx-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stock.chart || []} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="close" 
                        stroke={isPositive ? "#16a34a" : "#dc2626"} 
                        strokeWidth={1.5} 
                        dot={false}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
