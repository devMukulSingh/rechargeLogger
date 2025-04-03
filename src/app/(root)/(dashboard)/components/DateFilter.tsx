import { Calendar } from "@/src/components/ui/calendar";
import { Fragment, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  setSelectedMonthRevenue,
  setSelectedMonthTransactions,
} from "@/src/redux/reducers/persistedReducer";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { trpc } from "@/src/lib/trpc";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "debounce";

type Props = {
  disabled: boolean;
};

const DateFilter = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(currentYear, currentMonth, 1),
    to: new Date(),
  });
  const dispatch = useAppDispatch();
  const {
    data: allTransactions,
    error,
    isError,
  } = trpc.transactionRouter.getAllTransactions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isError) {
    console.log(error);
    toast.error(error.message);
  }

  //handling month change eveent
  const debouncedChange = debounce((date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", date?.from?.toISOString() || "");
    params.set("to", date?.to?.toISOString() || "");
    router.push(`/?${params.toString()}`);
  },2000);

  useEffect(() => {
    //setting currentmonth transactions in state
    // const currMonthTransactions =
    //   allTransactions?.filter(
    //     (tran) => new Date(tran.createdAt).getMonth() === Number(currentMonth)
    //   ) || [];
    // dispatch(setSelectedMonthTransactions(currMonthTransactions?.length));

    // //setting selected month revenue in state
    // if (currMonthTransactions.length > 0) {
    //   const filteredRevenue =
    //     currMonthTransactions
    //       .map((tran) => tran.plan.amount)
    //       .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
    //   dispatch(setSelectedMonthRevenue(filteredRevenue));
    // }
  }, [allTransactions]);
  return (
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
              <Fragment>
                {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                {format(selectedDateRange.to, "LLL dd, y")}
              </Fragment>
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
          onSelect={(date) => {
            setSelectedDateRange(date);
            debouncedChange(date);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;

// const handleMonthChange = () => {  //   // const from = date?.from?.setHours(0, 0, 0, 0) || Date.now();
//   // const to = date?.to?.setHours(0, 0, 0, 0) || Date.now();
//   // if (date && date?.from && date?.to) {
//   //   selectedDateTransactions =
//   //     allTransactions?.filter((tran) => {
//   //       const createdAt = new Date(tran.createdAt).setHours(0, 0, 0, 0);
//   //       if (createdAt >= from && createdAt <= to) {
//   //         return tran;
//   //       }
//   //     }) || [];
//   // } else if (!date?.from || !date?.to) {
//   //   selectedDateTransactions =
//   //     allTransactions?.filter((tran) => {
//   //       const createdAt = new Date(tran.createdAt).setHours(0, 0, 0, 0);
//   //       if (createdAt === from || createdAt === to) {
//   //         return tran;
//   //       }
//   //     }) || [];
//   // }
//   // dispatch(setSelectedMonthTransactions(selectedDateTransactions.length));
//   // if (selectedDateTransactions.length > 0) {
//   //   const filteredRevenue =
//   //     selectedDateTransactions
//   //       .map((tran) => tran.plan.amount)
//   //       .flat()
//   //       .reduce((acc: number, curr: number) => acc + curr, 0) || 0;
//   //   dispatch(setSelectedMonthRevenue(filteredRevenue));
//   // } else dispatch(setSelectedMonthRevenue(0));
// };
