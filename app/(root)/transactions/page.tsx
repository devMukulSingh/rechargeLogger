// "use client";
import { DataTable } from "@/components/DataTable";
import React, { useState } from "react";
import { columns } from "./components/TransactionColumn";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import SearchBar from "./components/SearchBar";
import { useAppDispatch } from "@/redux/hooks";
import { setTransactions } from "@/redux/slice";
import { format } from "date-fns";
import { Operator, Plan, Transaction } from "@prisma/client";
import toast from "react-hot-toast";
import { getTransactions } from "@/actions/get-transactions";

export interface ITransactions extends Transaction {
  plan: Plan;
  operator: Operator;
}

const TransactionsPage = async() => {
  // const [tableData, setTableData] = useState([]);
  // const dispatch = useAppDispatch();
  // const { isLoading } = useSWR(`/api/transaction/get-transactions`, fetcher, {
  //   onError(e) {
  //     toast.error("Something went wrong");
  //     console.log(e);
  //   },
  //   onSuccess(data) {
  //     console.log(data);
  //     const formatted = data?.map((item: ITransactions) => ({
  //       plan: item.plan.amount,
  //       dueAmount: item.dueAmount,
  //       operator: item.operator.name,
  //       mobile: item.mobile,
  //       createdAt: format(item.createdAt, "HH:mm - dd/MM/yyyy"),
  //     }));
  //     dispatch(setTransactions(formatted));
  //   },
  //   revalidateOnFocus: false,
  // });
  const tableData = await getTransactions() || [];
  return (
    <div className="flex flex-col gap-10 items-center justify-center p-5">
      <SearchBar tableData={tableData} />
      <DataTable columns={columns} data={tableData}/>
    </div>
  );
};

export default TransactionsPage;
