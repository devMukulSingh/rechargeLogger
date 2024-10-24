"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { useMemo } from "react";
import { TransactionColumn } from "@/app/(root)/transactions/components/TransactionColumn";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import PaginationButtons from "./PaginationButtons";
import toast from "react-hot-toast";

interface IdataTableProps<TData, TValue> {
  columns: ColumnDef<TransactionColumn, TValue>[];
}
export default function DataTable<TData, TValue>({
  columns,
}: IdataTableProps<TData, TValue>) {
  const page = Number(useSearchParams().get("page")) || 1;
  const query = useSearchParams().get("query");
  const pageSize = 7;

  const { data, isLoading } = useSWR(
    {
      url: query
        ? `/api/transaction/get-transaction`
        : `/api/transaction/get-transactions`,
      args: { pageIndex: page - 1, pageSize, mobile:query },
    },
    fetcher,
    {
      onError(e) {
        console.log(e);
        if (e?.response?.data) toast.error(e.response.data.error);
        else toast.error(`Internal server error`);
      },
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const table = useReactTable({
    data:  (data?.transactions || []),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: page,
        pageSize,
      },
    },
    manualPagination: true,
    enableSorting: true,
  });

  const totalPages =  data?.totalPages 
  return (
    <>
      {isLoading ? (
        <>loading...</>
      ) : (
        <div className="md:w-3/4 w-full flex flex-col  h-full ">
          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="text-neutral-200 text-lg font-medium"
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                className={
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : ""
                                }
                                onClick={header.column.getToggleSortingHandler()}
                                title={
                                  header.column.getCanSort()
                                    ? header.column.getNextSortingOrder() ===
                                      "asc"
                                      ? "Sort ascending"
                                      : header.column.getNextSortingOrder() ===
                                          "desc"
                                        ? "Sort descending"
                                        : "Clear sort"
                                    : undefined
                                }
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            </>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

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
            </Table>
          </div>
          <PaginationButtons totalPages={totalPages} />
        </div>
      )}
    </>
  );
}
