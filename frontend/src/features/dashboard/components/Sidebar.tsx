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
  Construction,
} from "lucide-react";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useBatchStockData } from "@/features/stock/hooks/useStockData";
import { formatPrice } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/", isImplemented: true },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", isImplemented: true },
  { icon: Wallet, label: "Wallet", href: "/wallet", isImplemented: false },
  { icon: Newspaper, label: "News", href: "/news", isImplemented: false },
  { icon: TrendingUp, label: "Stocks", href: "/stocks", isImplemented: false },
];

export function Sidebar() {
  const { portfolio = [], symbols = [], isLoading: isPortfolioLoading } = usePortfolio();
  const { data: batchData, isLoading: isBatchLoading } = useBatchStockData(symbols, "1D");
  const pathname = usePathname();
  const router = useRouter();

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

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.isImplemented) {
      router.push(item.href);

    } else {
      toast("ยังไม่เปิดให้ใช้งาน", {
        description: `ฟีเจอร์ ${item.label} กำลังอยู่ระหว่างการพัฒนา`,
        icon: <Construction className="w-4 h-4 text-amber-500" />,
      });
      
    }
  };

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
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <span>{item.label}</span>

            </button>
          )
        })}
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

