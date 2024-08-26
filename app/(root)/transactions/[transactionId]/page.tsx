"use client";
import { Form } from "@/components/ui/form";
import { rechargeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import MobileField from "../../entry/components/MobileField";
import PlanField from "../../entry/components/PlanField";
import OperatorField from "../../entry/components/OperatorField";
import DueAmountField from "../../entry/components/DueAmountField";
import useSWR from "swr";
import { TransactionColumn } from "../components/TransactionColumn";
import { fetcher } from "@/lib/utils";
import { format } from "date-fns";
import { ITransactions } from "../page";

export interface Iform {
  form: UseFormReturn<
    {
      mobile: number;
      operator: string;
      plan: number;
      dueAmount: number;
    },
    any,
    undefined
  >;
  isMutating: boolean;
}

interface Iarg extends formFields {
  transactionId: string;
}

async function editTransaction(url: string, { arg }: { arg: Iarg }) {
  return await axios.put(url, arg);
}

type formFields = z.infer<typeof rechargeSchema>;

const TramsactionEditPage = () => {
  const router = useRouter();
  const { transactionId } = useParams();

  const { data: transactions } = useSWR(`/api/transaction/get-transactions`);
  const { isMutating, trigger } = useSWRMutation(
    `/api/transaction/edit-transaction`,
    editTransaction,
    {
      onError(e) {
        toast.error("Something went wrong");
        console.log(e);
      },
      onSuccess() {
        toast.success("Transaction updated");
        router.push(`/transactions`);
      },
    },
  );

  const transaction = transactions?.find(
    (tran: TransactionColumn) => tran.id === transactionId,
  );
  const formatted = {
    plan: transaction?.plan.amount,
    dueAmount: transaction?.dueAmount,
    operator: transaction?.operator.name,
    mobile: transaction?.mobile,
  };

  const form = useForm<formFields>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      dueAmount: formatted?.dueAmount,
      mobile: formatted?.mobile,
      operator: formatted?.operator,
      plan: formatted?.plan,
    },
  });
  const onSubmit = async (data: formFields) => {
    await trigger({
      transactionId: transactionId.toString(),
      ...data,
    });
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5 border py-5 px-10 rounded-md shadow-xl "
        >
          <MobileField form={form} isMutating={isMutating} />
          <PlanField form={form} isMutating={isMutating} />
          <OperatorField form={form} isMutating={isMutating} />
          <DueAmountField form={form} isMutating={isMutating} />
          <Button disabled={isMutating} className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TramsactionEditPage;
