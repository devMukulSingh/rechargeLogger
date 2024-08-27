"use client";
import { FC, lazy, Suspense, useState } from "react";
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
import dynamic from "next/dynamic";
import { ITransactions } from "../../transactions/page";

const TotalRevenue = lazy(
  () => import("@/app/(root)/(dashboard)/components/TotalRevenue"),
);
const Sales = lazy(() => import("@/app/(root)/(dashboard)/components/Sales"));
const ProductInStock = lazy(() => import("./ProductInStock"));

interface DashboardDataProps {}

const DashboardData: FC<DashboardDataProps> = () => {
  const currentMonth = new Date().getMonth().toString();

  const [selectedMonthTransactions, setSelectedMonthTransactions] =
    useState<number>(0);
  const [selectedMonthRevenue, setSelectedMonthRevenue] = useState<number>(0);

  const { data: transactions, isLoading } = useSWR<ITransactions[]>(
    `/api/transaction/get-transactions`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError(err) {
        console.log(`Error in getTransactions`, err);
      },
      onSuccess(data) {
        //setting currentmonth transactions in state
        const currMonthTransactions =
          data
            ?.filter(
              (tran) =>
                new Date(tran.createdAt).getMonth() === Number(currentMonth),
            )
            .flat() || [];
        setSelectedMonthTransactions(currMonthTransactions?.length);
        console.log(currMonthTransactions, "currMonthTransactions");

        //setting selected month revenue in state
        if (currMonthTransactions.length > 0) {
          const filteredRevenue =
            currMonthTransactions
              .map((tran) => tran.plan.amount)
              .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
          setSelectedMonthRevenue(filteredRevenue);
          console.log(filteredRevenue, "filteredRevenue");
        }
      },
    },
  );

  //handling month change eveent
  const handleMonthChange = (selectedMonth: string) => {
    const currMonthTransactions =
      transactions?.filter(
        (tran) => new Date(tran.createdAt).getMonth() === Number(selectedMonth),
      ) || [];
    setSelectedMonthTransactions(currMonthTransactions.length);

    if (currMonthTransactions.length > 0) {
      const filteredRevenue =
        currMonthTransactions
          .map((tran) => tran.plan.amount)
          .flat()
          .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
      setSelectedMonthRevenue(filteredRevenue);
    } else setSelectedMonthRevenue(0);
  };

  ///////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-5">
      <Select
        defaultValue={currentMonth.toString()}
        onValueChange={(selectedMonth) => handleMonthChange(selectedMonth)}
      >
        <SelectTrigger
          disabled={isLoading}
          className="w-full sm:w-1/3 text-black"
        >
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
      <section className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-3">
        <Suspense fallback={<CardSkeleton />}>
          <TotalRevenue selectedMonthRevenue={selectedMonthRevenue} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <Sales selectedMonthTransactions={selectedMonthTransactions} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          {/* <ProductInStock  /> */}
        </Suspense>
      </section>
    </div>
  );
};

export default DashboardData;
