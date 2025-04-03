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
} from "@/src/components/ui/table";
import { TransactionColumn } from "@/src/app/(root)/transactions/components/TransactionColumn";
import { useSearchParams } from "next/navigation";
import PaginationButtons from "./PaginationButtons";
import toast from "react-hot-toast";
import { trpc } from "@/src/lib/trpc";
import { skipToken, useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

interface IdataTableProps<TData, TValue> {
  columns: ColumnDef<TransactionColumn, TValue>[];
}
export default function DataTable<TData, TValue>({
  columns,
}: IdataTableProps<TData, TValue>) {
  const page = Number(useSearchParams().get("page")) || 1;
  const query = useSearchParams().get("query");
  const pageSize = 7;


  const { data: searchedTransactions } =
    trpc.transactionRouter.getTransaction.useQuery(
      query
        ? {
            mobile: query || "",
            pageIndex: page - 1,
            pageSize,
          }
        : skipToken,
      {
        trpc: { abortOnUnmount: true },
      },
    );

  const {
    data: paginatedTransactions,
    isError,
    error,
    isLoading,
  } = trpc.transactionRouter.getTransactions.useQuery({
    pageIndex: page - 1,
    pageSize,
  },{

  });

  if (isError) {
    console.log(error);
    if (error) toast.error(error.message);
    else toast.error(`Internal server error`);
  }

  const table = useReactTable({
    data:
      (query
        ? searchedTransactions?.transactions
        : paginatedTransactions?.transactions) || [],
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
          <PaginationButtons
            totalPages={
              (query
                ? searchedTransactions?.totalPages
                : paginatedTransactions?.totalPages) || 1
            }
          />
        </div>
      )}
    </>
  );
}
