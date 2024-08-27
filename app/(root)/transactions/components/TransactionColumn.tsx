"use client";

import { ColumnDef } from "@tanstack/react-table";
import TransactionAction from "./TransactionAction";

export type TransactionColumn = {
  mobile: string;
  operator: string;
  plan: number;
  dueAmount: number;
  createdAt: string;
  id: string;
};

export const columns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "operator",
    header: "Operator",
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <>{`₹${row.original.plan}`}</>,
  },
  {
    accessorKey: "dueAmount",
    header: "Due amount",
    cell: ({ row }) => <>{`₹${row.original.dueAmount}`}</>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <TransactionAction data={row.original} />,
  },
];
