"use client";

import { ColumnDef } from "@tanstack/react-table";


export type TransactionColumn = {
  mobile: string;
  operator: string;
  plan: number;
  dueAmount:number;
  createdAt:string
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
  },
  {
    accessorKey: "dueAmount",
    header: "Due amount",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
