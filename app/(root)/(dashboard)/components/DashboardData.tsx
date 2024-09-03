"use client";
import { FC, lazy, Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import { cn, fetcher, months } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";
import { ITransactions } from "../../transactions/page";
import { useAppDispatch } from "@/redux/hooks";
import {
  setSelectedMonthRevenue,
  setSelectedMonthTransactions,
} from "@/redux/reducers/persistedReducer";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

const TotalRevenue = lazy(
  () => import("@/app/(root)/(dashboard)/components/TotalRevenue")
);
const Sales = lazy(() => import("@/app/(root)/(dashboard)/components/Sales"));

interface DashboardDataProps {}

const DashboardData: FC<DashboardDataProps> = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(currentYear, currentMonth, 1),
    to: addDays(new Date(currentYear, currentMonth, 30), 0),
  });
  const dispatch = useAppDispatch();

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
  const handleMonthChange = (date: DateRange | undefined) => {
    setSelectedDateRange(date);
    let selectedDateTransactions: ITransactions[] = [];
    const from = date?.from?.setHours(0, 0, 0, 0) || Date.now();
    const to = date?.to?.setHours(0, 0, 0, 0) || Date.now();
    if (date && date?.from && date?.to) {
      selectedDateTransactions =
        (data || transactions)?.filter((tran) => {
          const createdAt = new Date(tran.createdAt).setHours(0, 0, 0, 0);
          if (createdAt >= from && createdAt <= to) {
            return tran;
          }
        }) || [];
      // console.log(selectedDateTransactions);
    } else if (!date?.from || !date?.to) {
      selectedDateTransactions =
        (data || transactions)?.filter((tran) => {
          const createdAt = new Date(tran.createdAt).setHours(0, 0, 0, 0);
          if (
            createdAt === from ||
            createdAt === to
          ) {
            return tran;
          }
        }) || [];
    }
    dispatch(setSelectedMonthTransactions(selectedDateTransactions.length));

    if (selectedDateTransactions.length > 0) {
      const filteredRevenue =
        selectedDateTransactions
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
    }
  }, [data, transactions]);
  ///////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-5">
      <Popover>
        <PopoverTrigger asChild className="text-black">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateRange?.from ? (
              selectedDateRange.to ? (
                <>
                  {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                  {format(selectedDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedDateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDateRange?.from}
            selected={selectedDateRange}
            onSelect={(date) => handleMonthChange(date)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

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
