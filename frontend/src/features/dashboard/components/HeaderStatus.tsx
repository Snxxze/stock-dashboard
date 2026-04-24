"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function HeaderStatus() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [region, setRegion] = useState<"NYSE" | "BKK">("BKK");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // ปิด dropdown เมื่อคลิกที่อื่น (อนาคต)
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return <div className="w-[300px] h-12"></div>;
  }

  // แปลงเวลาให้เป็น Timezone ของนิวยอร์ก (EDT/EST)
  const nyTimeStr = time.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });

  // แปลงเวลาให้เป็น Timezone ของกรุงเทพฯ (BKK)
  const bkkTimeStr = time.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) + " THA";

  const nyDateStr = time.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const nyWeekdayStr = time.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long"
  });

  // คำนวณสถานะการเปิด/ปิดตลาด
  const nyDate = new Date(time.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = nyDate.getDay();
  const hours = nyDate.getHours();
  const minutes = nyDate.getMinutes();
  const seconds = nyDate.getSeconds();
  const totalMinutes = hours * 60 + minutes;

  const isWeekend = day === 0 || day === 6; // 0=Sunday, 6=Saturday
  const isMarketOpen = !isWeekend && totalMinutes >= 9 * 60 + 30 && totalMinutes < 16 * 60;

  let statusText = "";
  if (isMarketOpen) {
    const closeTimeMins = 16 * 60;
    const diffMins = closeTimeMins - totalMinutes - 1;
    const diffSecs = 60 - seconds;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    statusText = `Closes in 0${hrs}:${mins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
  } else {
    statusText = isWeekend ? "Market Closed (Weekend)" : "Market Closed";
  }

  return (
    <div className="flex items-center gap-8 text-sm">
      {/* Market Status */}
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
          <span className="font-semibold text-gray-900">{isMarketOpen ? "Market Open" : "Market Closed"}</span>
        </div>
        <span className="text-xs text-gray-500 mt-0.5">{statusText}</span>
      </div>

      <div className="w-px h-8 bg-gray-200"></div>

      {/* Region / Time Dropdown */}
      <div className="flex flex-col relative" ref={dropdownRef}>
        <div 
          className="flex items-center gap-1 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {region === "NYSE" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          )}
          {region}
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
        <span className="text-xs text-gray-500 mt-0.5 w-full text-left">
          {region === "NYSE" ? nyTimeStr : bkkTimeStr}
        </span>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
            <button 
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${region === "NYSE" ? "font-bold text-blue-600" : "text-gray-700"}`}
              onClick={() => { setRegion("NYSE"); setIsDropdownOpen(false); }}
            >
              NYSE (EST)
            </button>
            <button 
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${region === "BKK" ? "font-bold text-blue-600" : "text-gray-700"}`}
              onClick={() => { setRegion("BKK"); setIsDropdownOpen(false); }}
            >
              BKK (THA)
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-8 bg-gray-200"></div>

      {/* Date */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          {nyDateStr}
        </div>
        <span className="text-xs text-gray-500 mt-0.5">{nyWeekdayStr}</span>
      </div>
    </div>
  );
}
