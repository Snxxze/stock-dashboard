"use client"

import { User, Search } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Watchlist } from "@/features/watchlist/components/Watchlist";
import { Input } from "@/components/ui/input";
import { MarketIndices } from "@/features/dashboard/components/MarketIndices";
import { PortfolioSnapshot } from "@/features/dashboard/components/PortfolioSnapshot";
import { TrendingMovers } from "@/features/dashboard/components/TrendingMovers";
import { MarketNews } from "@/features/dashboard/components/MarketNews";
import { HeaderStatus } from "@/features/dashboard/components/HeaderStatus";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          
          {/* ชื่อหน้า + ช่องค้นหา */}
          <div className="flex items-center gap-8 flex-1 max-w-3xl">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold whitespace-nowrap">
                Market Overview
              </h1>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search for symbols, news, or companies..."
                className="pl-10 pr-12 h-10 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* สถานะตลาด + โปรไฟล์ */}
          <div className="flex items-center gap-8 text-sm">
            
            <HeaderStatus />

            <div className="w-px h-8 bg-gray-200"></div>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 transition-colors border border-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <MarketIndices />
          <div className="flex gap-8">
            <div className="flex-[7] min-w-0 space-y-8">
              <TrendingMovers />
              <MarketNews />
            </div>

            <div className="flex-[3] flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <Watchlist />
              </div>
              
              <PortfolioSnapshot />
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}