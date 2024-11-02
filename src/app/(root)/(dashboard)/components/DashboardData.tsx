"use client";
import { FC, lazy, Suspense } from "react";
import CardSkeleton from "./CardSkeleton";
import { ITransactions } from "../../transactions/page";
import DateFilter from "./DateFilter";

export interface IapiResponse {
  transactions: ITransactions[];
  totalPage?: number;
}

const TotalRevenue = lazy(
  () => import("@/src/app/(root)/(dashboard)/components/TotalRevenue")
);
const Sales = lazy(
  () => import("@/src/app/(root)/(dashboard)/components/Sales")
);

interface DashboardDataProps {}

const DashboardData: FC<DashboardDataProps> = () => {
  ///////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-5">
      <DateFilter />
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-3">
        <Suspense fallback={<CardSkeleton />}>
          <TotalRevenue />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <Sales />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardData;
