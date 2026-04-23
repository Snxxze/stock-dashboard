"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/features/stock/types";
import { formatPrice, formatChartDate } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StockChartProps {
  data: ChartDataPoint[];
  isPositive: boolean;
}

export function StockChart({ data, isPositive }: StockChartProps) {
  const color = isPositive ? "#22c55e" : "#ef4444";

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <Skeleton className="h-48 mt-4 w-full rounded-xl" />;

  return (
    <div className="w-full min-w-0 mt-4">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="timestamp"
            tickFormatter={formatChartDate}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            minTickGap={60}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as ChartDataPoint;
              return (
                <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-md text-sm">
                  <p className="text-gray-400">{formatChartDate(d.timestamp)}</p>
                  <p className="font-bold">{formatPrice(d.close)}</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            fill="url(#chartGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

