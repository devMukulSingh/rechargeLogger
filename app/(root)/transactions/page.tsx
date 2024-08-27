"use client";
import React, { lazy, Suspense, useState } from "react";
import { columns } from "./components/TransactionColumn";
import { Operator, Plan, Transaction } from "@prisma/client";
import TableSkeleton from "@/components/TableSkeleton";
const SearchBar = lazy(() => import("./components/SearchBar"));
const DataTable = lazy(() => import("@/components/DataTable"));

export interface ITransactions extends Transaction {
  plan: Plan;
  operator: Operator;
}

const TransactionsPage = () => {
  
  return (
    <div className="flex flex-col gap-10  items-center justify-center p-5 ">
      <Suspense fallback={<TableSkeleton />}>
        <SearchBar  />
        <DataTable columns={columns} />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
