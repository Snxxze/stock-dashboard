"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/storage.provider";
import type { PortfolioItem } from "@/types/portfolio";

// usePortfolio — จัดการ portfolio ของ user
// ตอนนี้ใช้ localStorage อนาคต swap เป็น backend ที่ storage.provider.ts

export function usePortfolio() {
  const queryClient = useQueryClient();

  // ดึงรายการ portfolio
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => storage.getPortfolio(),
  });

  // เพิ่มหุ้นเข้า portfolio
  const addMutation = useMutation({
    mutationFn: (item: PortfolioItem) => storage.addToPortfolio(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  // อัปเดตข้อมูลหุ้น (เช่น เปลี่ยนจำนวน shares)
  const updateMutation = useMutation({
    mutationFn: ({ symbol, updates }: { symbol: string; updates: Partial<PortfolioItem> }) =>
      storage.updatePortfolioItem(symbol, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  // ลบหุ้นออกจาก portfolio
  const removeMutation = useMutation({
    mutationFn: (symbol: string) => storage.removeFromPortfolio(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  return {
    portfolio,
    isLoading,

    symbols: portfolio.map((p) => p.symbol),
    addStock: addMutation.mutate,
    updateStock: updateMutation.mutate,
    removeStock: removeMutation.mutate,
  };
}
