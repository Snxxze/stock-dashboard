"use client"

import type { StockData, Timeframe } from "@/types/stock";
import { formatPrice, formatChange, formatVolume } from "@/lib/formatters";
import { StockChart } from "./StockChart";
import { Skeleton } from "./ui/skeleton";

interface StockCardProps {
  data: StockData;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y"];

export function StockCard({ data, timeframe, onTimeframeChange }: StockCardProps) {
  const isPositive = data.change >= 0;
  return (
    <div>
      {/* ชื่อหุ้น + ราคา */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <p className="text-gray-400 text-sm">{data.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{formatPrice(data.price)}</p>
          <p className={`text-sm font-medium mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "▲" : "▼"} {formatChange(data.change, data.changePercent)}
          </p>
        </div>
      </div>

      {/* เลือก Timeframe */}
      <div className="flex gap-1 mb-4">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf
                ? "bg-black text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* กราฟ */}
      <StockChart data={data.chart} isPositive={isPositive} />

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">

        <p className="text-xs text-gray-400 mb-2">
          Today's Range {new Date().toLocaleDateString("en-US", { 
            weekday: "short", month: "short", day: "numeric" 
          })}
          <span className="text-gray-300 ml-2">
            Updated {new Date().toLocaleTimeString("en-US", { 
              hour: "2-digit", minute: "2-digit" 
            })}
          </span>
        </p>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-400">High</p>
            <p className="font-semibold">{formatPrice(data.high)}</p>
          </div>
          <div>
            <p className="text-gray-400">Low</p>
            <p className="font-semibold">{formatPrice(data.low)}</p>
          </div>
          <div>
            <p className="text-gray-400">Volume</p>
            <p className="font-semibold">{formatVolume(data.volume)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export function StockCardSkeleton() {
  return (
    <div>
      {/* ชื่อหุ้น + ราคา */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" /> 
          <Skeleton className="h-4 w-20" /> 
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-10 w-32 ml-auto" />
          <Skeleton className="h-4 w-24 ml-auto" /> 
        </div>
      </div>

      {/* ปุ่ม Timeframe */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-12 rounded-lg" />
        ))}
      </div>

      {/* พื้นที่กราฟ */}
      <Skeleton className="h-64 w-full rounded-xl mb-6" />

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Skeleton className="h-3 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2"><Skeleton className="h-3 w-10" /><Skeleton className="h-5 w-20" /></div>
          <div className="space-y-2"><Skeleton className="h-3 w-10" /><Skeleton className="h-5 w-20" /></div>
          <div className="space-y-2"><Skeleton className="h-3 w-10" /><Skeleton className="h-5 w-20" /></div>
        </div>
      </div>
    </div>
  );
}