"use client";
import { FC, lazy, Suspense, useMemo } from "react";
import CardSkeleton from "./CardSkeleton";
import { ITransactions } from "../../transactions/page";
import DateFilter from "./DateFilter";
import { Button } from "@/src/components/ui/button";
import { Search } from "lucide-react";
import { trpc } from "@/src/lib/trpc";
import { useSearchParams } from "next/navigation";
export interface IapiResponse {
  transactions: ITransactions[];
  totalPage?: number;
}
const TotalRevenue = lazy(
  () => import("@/src/app/(root)/(dashboard)/components/TotalRevenue"),
);
const Sales = lazy(
  () => import("@/src/app/(root)/(dashboard)/components/Sales"),
);

interface DashboardDataProps {}

const DashboardData: FC<DashboardDataProps> = () => {
  const searchParams = useSearchParams();
  const currDate = useMemo(() => new Date(), []);
  const defaultFrom = new Date(
    currDate.getFullYear(),
    currDate.getMonth(),
    1,
  ).toISOString();
  const from = searchParams.get("from") || defaultFrom;
  const to = searchParams.get("to") || currDate.toISOString();
  const { data, isFetching, isLoading } =
    trpc.analyticsRouter.getFilteredRevenue.useQuery({
      from,
      to,
    });

  ///////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <DateFilter disabled={isFetching} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-3">
        <Suspense fallback={<CardSkeleton />}>
          <TotalRevenue totalRevenue={data?.totalRevenue} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <Sales transactions={data?.transactions} />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardData;
