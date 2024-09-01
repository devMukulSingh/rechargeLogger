"use client";
import { FC, lazy, Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { fetcher, months } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";
import { ITransactions } from "../../transactions/page";
import { useAppDispatch } from "@/redux/hooks";
import {
  setSelectedMonthRevenue,
  setSelectedMonthTransactions,
} from "@/redux/reducers/persistedReducer";

const TotalRevenue = lazy(
  () => import("@/app/(root)/(dashboard)/components/TotalRevenue")
);
const Sales = lazy(() => import("@/app/(root)/(dashboard)/components/Sales"));

interface DashboardDataProps {}

const DashboardData: FC<DashboardDataProps> = () => {
  const dispatch = useAppDispatch();
  const currentMonth = new Date().getMonth().toString();

  const { data } = useSWR<ITransactions[]>(`/api/transaction/get-transactions`);

  const { data: transactions, isLoading } = useSWR<ITransactions[]>(
    !data ? `/api/transaction/get-transactions` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError(err) {
        console.log(`Error in getTransactions`, err);
      },
    }
  );

  //handling month change eveent
  const handleMonthChange = (selectedMonth: string) => {
    const currMonthTransactions =
      (data || transactions)?.filter(
        (tran) => new Date(tran.createdAt).getMonth() === Number(selectedMonth)
      ) || [];
    dispatch(setSelectedMonthTransactions(currMonthTransactions.length));

    if (currMonthTransactions.length > 0) {
      const filteredRevenue =
        currMonthTransactions
          .map((tran) => tran.plan.amount)
          .flat()
          .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
      dispatch(setSelectedMonthRevenue(filteredRevenue));
    } else dispatch(setSelectedMonthRevenue(0));
  };
  useEffect(() => {
    //setting currentmonth transactions in state
    const currMonthTransactions =
      (data || transactions)?.filter(
        (tran) => new Date(tran.createdAt).getMonth() === Number(currentMonth)
      ) || [];
    dispatch(setSelectedMonthTransactions(currMonthTransactions?.length));

    //setting selected month revenue in state
    if (currMonthTransactions.length > 0) {
      const filteredRevenue =
        currMonthTransactions
          .map((tran) => tran.plan.amount)
          .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
      dispatch(setSelectedMonthRevenue(filteredRevenue));
      console.log(filteredRevenue, "filteredRevenue");
    }
  }, [data, transactions]);
  ///////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-5">
      <Select
        defaultValue={currentMonth.toString()}
        onValueChange={(selectedMonth) => handleMonthChange(selectedMonth)}
      >
        <SelectTrigger className="w-full sm:w-1/3 text-black">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="">
          {months.map((month: string, index: number) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
