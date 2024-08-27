"use client";
import React, { FC, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useAppDispatch } from "@/redux/hooks";
import { setTransactions } from "@/redux/slice";
import { format } from "date-fns";
import { ITransactions } from "../page";

interface SearchBarProps {
  // tableData: any;
}

export function SearchBar({}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  const { isLoading, data: transactions } = useSWR<ITransactions[]>(`/api/transaction/get-transactions`,);
  const formatted = transactions?.map((item) => ({
    plan: item.plan.amount,
    dueAmount: item.dueAmount,
    operator: item.operator.name,
    mobile: item.mobile,
    createdAt: format(item.createdAt, "HH:mm - dd/MM/yyyy"),
    id: item.id,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    const query = e.target.value.trim().toLowerCase();
    if (query !== "") {
      const filterdData = formatted?.filter(
        (item) =>
          item?.mobile?.toLowerCase()?.includes(query) ||
          item.operator.toLowerCase().includes(query),
      );

      dispatch(setTransactions(filterdData));
    } else dispatch(setTransactions(formatted));
  };

  const handleClearSearch = () => {
    setQuery("");
    dispatch(setTransactions(formatted));
  };
  return (
    <div
      className="
        flex 
        px-3
        sm:px-5 
        py-1 
        rounded-md 
        items-center 
        text-black
        bg-white
        w-1/2
        focus-visible-ring-2
        border-2
        "
    >
      <Search className="cursor-pointer" />
      <Input
        className="focus-visible:ring-0 border-0 focus-visible:ring-offset-0 "
        onChange={handleChange}
        value={query}
        placeholder="Type here to search..."
      />
      <X onClick={handleClearSearch} className="cursor-pointer" />
    </div>
  );
}

export default SearchBar;
