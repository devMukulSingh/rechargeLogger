"use client";
import { Skeleton } from "@/src/components/ui/skeleton";

const DashboardDataSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-3">
      <Skeleton className="w-auto h-[135px] bg-slate-200" />
      <Skeleton className="w-auto h-[135px] bg-slate-200" />
    </div>
  );
};

export default DashboardDataSkeleton;
