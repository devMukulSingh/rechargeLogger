"use client";
import React, { FC, useState } from "react";
import { Search, X } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setTransactions } from "@/redux/slice";
import { Input } from "@/components/ui/input";
import useSWR from "swr";

interface SearchBarProps {
  tableData: any;
}

export function SearchBar({ tableData }: SearchBarProps) {
  const { data } = useSWR(`/api/transaction/get-transactions`);

  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    const query = e.target.value.trim().toLowerCase();
    if (query !== "") {
      const filterdData = data.filter((item: any) =>
        item?.mobile?.toLowerCase()?.includes(query),
      );
      dispatch(setTransactions(filterdData));
    } else dispatch(setTransactions(data));
  };

  const handleClearSearch = () => {
    setQuery("");
    dispatch(setTransactions(data));
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
