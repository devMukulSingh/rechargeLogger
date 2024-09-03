import { TransactionColumn } from "@/app/(root)/transactions/components/TransactionColumn";
import { Transaction } from "@prisma/client";

export interface IinitialState {
  transactions: TransactionColumn[];
  selectedMonthTransactions: number;
  selectedMonthRevenue: number;
}

export interface ITransactions {
  operator: string;
  number: string;
  createdAt: string;
  plan: number;
  dueAmount: number;
}
