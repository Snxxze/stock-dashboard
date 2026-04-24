import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  count?: number;
}

export function TrendingMoversSkeleton({ count = 10 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="min-w-[240px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0 snap-start"
        >
          
          <Skeleton className="h-6 w-16 mb-4" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </>
  );
}
