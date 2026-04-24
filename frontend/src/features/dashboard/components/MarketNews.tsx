"use client";

import React from "react";
import { useMarketNews } from "@/features/stock/hooks/useStockData";
import { Clock, Newspaper } from "lucide-react";
import { MarketNewsSkeleton } from "./skeletons/MarketNewsSkeleton";
import type { MarketNewsItem } from "@/features/stock/types";

export function MarketNews() {
  const { data: news, isLoading, isError } = useMarketNews();

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600" />
          Market News
        </h2>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {isLoading ? (
          // Skeletons
          <MarketNewsSkeleton count={3} />

        ) : isError ? (
          // Error State
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
            <p className="font-semibold">ไม่สามารถเชื่อมต่อข้อมูลข่าวได้</p>
            <p className="text-red-400 mt-1">กรุณารอสักครู่แล้วลองใหม่อีกครั้ง</p>
          </div>

        ) : news?.length === 0 ? (
          // Empty State 
          <div className="p-4 bg-gray-50 text-gray-500 rounded-xl text-center text-sm">
            ไม่มีข่าวสารที่เกี่ยวข้องในขณะนี้
          </div>

        ) : (
          news?.slice(0, 10).map((item: MarketNewsItem, index: number) => {
            const date = new Date(item.time);
            const dateString = isNaN(date.getTime()) ? "" : date.toLocaleDateString();

            return (
              <a 
                key={item.url || index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0 hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-24 h-16 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-24 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium text-blue-600">{item.source}</span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateString}
                    </span>
                  </div>
                </div>
              </a>
              
            );
          })
        )}
      </div>
    </div>
  );
}
