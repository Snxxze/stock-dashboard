"use client"

import {
  Home,
  LayoutDashboard,
  Wallet,
  Newspaper,
  TrendingUp,
  Settings,
  Phone,
  Users,
} from "lucide-react";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useBatchStockData } from "@/features/stock/hooks/useStockData";
import { formatPrice } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const NAV_ITEMS = [
  { icon: Home,            label: "Home",       active: false },
  { icon: LayoutDashboard, label: "Dashboard",  active: true  },
  { icon: Wallet,          label: "Wallet",     active: false },
  { icon: Newspaper,       label: "News",       active: false },
  { icon: TrendingUp,      label: "Stocks",     active: false },
];

export function Sidebar() {
  const { portfolio = [], symbols = [], isLoading: isPortfolioLoading } = usePortfolio();
  const { data: batchData, isLoading: isBatchLoading } = useBatchStockData(symbols, "1D");

  const isLoading = isPortfolioLoading || isBatchLoading;

  // Calculate real total investment
  let totalValue = 0;
  let totalCost = 0;

  if (!isLoading && batchData) {
    portfolio.forEach(item => {
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
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col p-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <span className="font-bold text-lg">Stock Dash</span>
      </div>

      {/* Total Investment Card */}
      <div className="bg-black text-white rounded-2xl p-4 mb-8 flex-shrink-0">
        <p className="text-xs text-gray-400 mb-1">Total Investment</p>
        
        {isLoading ? (
          <div className="space-y-2 mt-2">
            <Skeleton className="h-6 w-24 bg-gray-800" />
            <Skeleton className="h-4 w-16 bg-gray-800" />
          </div>
        ) : (
          <>
            <p className="text-xl font-bold">{formatPrice(totalValue)}</p>
            <p className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? "+" : ""}{returnPercent.toFixed(2)}% 
              {isPositive ? "↑" : "↓"}
            </p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-sm">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              active
                ? "bg-gray-100 font-medium text-black"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1 text-sm mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Users size={16} /> Community
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Settings size={16} /> Settings
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Phone size={16} /> Contact
        </a>
      </nav>
    </aside>
  );
}

