"use client";
import React, { FC, KeyboardEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
  const [inputQuery, setInputQuery] = useState("");
  let params = new URLSearchParams(window.location.search);
  const router = useRouter();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      const query = e.currentTarget.value.trim();
      router.push(`transactions?query=${query}`);
    }
  };
  const handleClearSearch = () => {
    if (inputQuery !== "") {
      setInputQuery("");
      params.delete("query");
      router.push(`/transactions?${params.toString()}`);
    }
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
      <Search className="" />
      <Input
        onChange={(e) => setInputQuery(e.target.value)}
        value={inputQuery}
        onKeyUp={handleSearch}
        className="focus-visible:ring-0 border-0 focus-visible:ring-offset-0 "
        placeholder="Type here to search..."
      />
      <X onClick={handleClearSearch} className="cursor-pointer" />
    </div>
  );
}

export default SearchBar;
