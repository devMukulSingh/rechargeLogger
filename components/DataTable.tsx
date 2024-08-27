"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import TableSkeleton from "./TableSkeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTransactions } from "@/redux/slice";
import { TransactionColumn } from "@/app/(root)/transactions/components/TransactionColumn";
import useSWR from "swr";
import { ITransactions } from "@/app/(root)/transactions/page";
import { format } from "date-fns";

interface IdataTableProps<TData, TValue> {
  columns: ColumnDef<TransactionColumn, TValue>[];
  // data: TData[];
}

export default function DataTable<TData, TValue>({
  columns,
}: IdataTableProps<TData, TValue>) {
  const [isMounted, setIsMounted] = useState(false);
  const { transactions } = useAppSelector((state) => state.rootSlice);
  const { data } = useSWR(`/api/transaction/get-transactions`);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const formatted = data?.map((item: ITransactions) => ({
      plan: item.plan.amount,
      dueAmount: item.dueAmount,
      operator: item.operator.name,
      mobile: item.mobile,
      createdAt: format(item.createdAt, "HH:mm - dd/MM/yyyy"),
      id: item.id,
    }));
    dispatch(setTransactions(formatted));
    setIsMounted(true)
  }, []);
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if(!isMounted) return null;
  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>

          <Suspense fallback={<TableSkeleton />}>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Suspense>
        </Table>
      </div>
      <footer className="flex space-x-5 justify-end items-center text-black">
        <Button
          onClick={() => table.previousPage()}
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          variant="default"
          size="sm"
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
