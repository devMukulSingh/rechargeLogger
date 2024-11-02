import React, { lazy, Suspense, useState } from "react";
import { columns } from "./components/TransactionColumn";
import { Operator, Plan, Transaction } from "@prisma/client";
import TableSkeleton from "@/src/components/TableSkeleton";
import dynamic from "next/dynamic";
const SearchBar = lazy(() => import("./components/SearchBar"));
const DataTable = dynamic(() => import("./components/DataTable"), {
  ssr: false,
});

export interface ITransactions extends Transaction {
  plan: Plan;
  operator: Operator;
}

const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-5  items-center  px-5 py-3 h-full ">
      <SearchBar />
      <Suspense fallback={<TableSkeleton />}>
        <DataTable columns={columns} />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
