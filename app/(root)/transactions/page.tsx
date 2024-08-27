"use client";
import React, { lazy, Suspense, useState } from "react";
import { columns } from "./components/TransactionColumn";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useAppDispatch } from "@/redux/hooks";
import { setTransactions } from "@/redux/slice";
import { format } from "date-fns";
import { Operator, Plan, Transaction } from "@prisma/client";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/TableSkeleton";
const SearchBar = lazy(() => import("./components/SearchBar"));
const  DataTable = lazy(() => import("@/components/DataTable"));


export interface ITransactions extends Transaction {
  plan: Plan;
  operator: Operator;
}

const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, data } = useSWR(
    `/api/transaction/get-transactions`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const formatted = data?.map((item: ITransactions) => ({
    plan: item.plan.amount,
    dueAmount: item.dueAmount,
    operator: item.operator.name,
    mobile: item.mobile,
    createdAt: format(item.createdAt, "HH:mm - dd/MM/yyyy"),
    id: item.id,
  }));
  dispatch(setTransactions(formatted));
  // const tableData = await getTransactions() || [];
  return (
    <div className="flex flex-col gap-10 items-center justify-center p-5">
      <Suspense fallback={<TableSkeleton/>}>
        <SearchBar tableData={formatted} />
        <DataTable columns={columns} />
      </Suspense>
    </div>
  );
};

export default TransactionsPage;
