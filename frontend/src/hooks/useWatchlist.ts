"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/storage.provider";

// ใช้จัดการรายการหุ้นที่ติดตาม
export function useWatchlist() {
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => storage.getWatchlist(),
  });

  const addMutation = useMutation({
    mutationFn: (symbol: string) => storage.addToWatchlist(symbol),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (symbol: string) => storage.removeFromWatchlist(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    watchlist,
    isLoading,
    symbols: watchlist.map((w) => w.symbol),
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
  }
}