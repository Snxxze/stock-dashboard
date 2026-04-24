"use client";

import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useBatchStockData } from "@/features/stock/hooks/useStockData";
import { formatPrice } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import Link from "next/link"; 

export function PortfolioSnapshot() {
  const { portfolio = [], symbols = [], isLoading: isPortfolioLoading } = usePortfolio();
  const { data: batchData, isLoading: isBatchLoading } = useBatchStockData(symbols, "1D");

  const isLoading = isPortfolioLoading || isBatchLoading;

  // คำนวณมูลค่าพอร์ต
  let totalValue = 0;
  let totalCost = 0;

  if (!isLoading && batchData) {
    portfolio.forEach((item) => {
      const stock = batchData[item.symbol];
      if (stock) {
        totalValue += item.shares * stock.price;
        totalCost += item.shares * item.avgCost;
      }
    });
  }

  const returnAmount = totalValue - totalCost;
  const returnPercent = totalCost > 0 ? (returnAmount / totalCost) * 100 : 0;
  const isPositive = returnAmount >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Portfolio Snapshot</h2>
        {/* ลิงก์สำหรับกดกลับไปหน้า Dashboard หลักที่เราเพิ่งย้ายไป (อนาคต) */}
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
          View Portfolio <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Value</p>
            <p className="text-4xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? "+" : ""}{formatPrice(returnAmount)} ({returnPercent.toFixed(2)}%)
            </div>
          </div>
          
          {/* ข้อมูล Mock-up ไปก่อนนน */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-400 mb-1">Buying Power</p>
              <p className="font-semibold text-gray-700">$8,750.20</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Day's Change</p>
              <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? "+" : ""}{formatPrice(returnAmount * 0.3)} 
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
