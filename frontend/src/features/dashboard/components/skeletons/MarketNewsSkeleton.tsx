import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  count?: number;
}

export function MarketNewsSkeleton({ count = 3 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
          <Skeleton className="w-24 h-16 rounded-lg shrink-0" />
          
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </>
  );
}
