"use client";

import { useBatchStockData } from "@/features/stock/hooks/useStockData";
import { formatPrice } from "@/lib/formatters";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const INDICES = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "Nasdaq" },
  { symbol: "^DJI", name: "Dow Jones" },
];

export function MarketIndices() {
  const { data, isLoading, isError } = useBatchStockData(
    INDICES.map((i) => i.symbol),
    "1D"
  );

  if (isError) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {INDICES.map((index) => {
        const stock = data?.[index.symbol];

        if (isLoading || !stock) {
          return <IndexCardSkeleton key={index.symbol} />;
        }

        return (
          <IndexCard 
            key={index.symbol} 
            name={index.name} 
            stock={stock} 
            symbol={index.symbol}
          />
        );
      })}
    </div>
  );
}

function IndexCard({ name, stock, symbol }: any) {
  const isPositive = stock.change >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";
  const gradientId = `gradient-${symbol.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-5 flex flex-col justify-between overflow-hidden transition-all duration-300",
        "bg-white border-gray-200 hover:shadow-md hover:-translate-y-1"
      )}
    >
      {/* Top Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-500">{name}</p>

        <p className="text-2xl font-bold mt-1 text-gray-900">
          {formatPrice(stock.price)}
        </p>

        <p
          className={cn(
            "text-sm mt-2 flex items-center gap-1 font-semibold",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          {isPositive ? (
            <TrendingUp className="w-4 h-4 ml-0.5" />
          ) : (
            <TrendingDown className="w-4 h-4 ml-0.5" />
          )}
        </p>
      </div>

      {/* Chart */}
      <div className="h-24 w-full mt-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.chart || []}>

            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.12} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <YAxis hide domain={["auto", "auto"]} />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;

                return (
                  <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-md text-xs">
                    <p className="text-gray-400">
                      {new Date(d.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="font-bold">{formatPrice(d.close)}</p>
                  </div>
                );
              }}
            />

            <Area
              type="monotoneX"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function IndexCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-full mt-4" />
    </div>
  );
}