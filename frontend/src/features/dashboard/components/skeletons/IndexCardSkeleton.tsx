import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function IndexCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-full mt-4" />
    </div>
  );
}
