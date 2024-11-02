"use client";
import { Form } from "@/src/components/ui/form";
import { rechargeSchema } from "@/src/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
const MobileField = dynamic(
  () => import("../../entry/components/MobileField"),
  {
    loading: () => <InputSkeleton />,
  }
);
const PlanField = dynamic(() => import("../../entry/components/PlanField"), {
  loading: () => <InputSkeleton />,
});
const OperatorField = dynamic(
  () => import("../../entry/components/OperatorField"),
  {
    loading: () => <InputSkeleton />,
  }
);
const DueAmountField = dynamic(
  () => import("../../entry/components/DueAmountField"),
  {
    loading: () => <InputSkeleton />,
  }
);
import { TransactionColumn } from "../components/TransactionColumn";
import dynamic from "next/dynamic";
import InputSkeleton from "../../entry/components/InputSkeleton";
import { trpc } from "@/src/lib/trpc";
import { Button } from "@/src/components/ui/button";

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
  isPending: boolean;
}

type formFields = z.infer<typeof rechargeSchema>;

const TramsactionEditPage = () => {
  const pageSize = 7;
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get("page")) || 1;

  const router = useRouter();
  const { transactionId } = useParams();

  const { data } = trpc.transactionRouter.getTransactions.useQuery(
    {
      pageIndex:pageIndex-1,
      pageSize,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const {  mutate,isPending } =
    trpc.transactionRouter.updateTransaction.useMutation({
      onError(e) {
        console.log(e);
        toast.error(e.message);
      },
      onSuccess() {
        toast.success("Transaction updated");
        router.push(`/transactions`);
      },
    });
  const transaction = data?.transactions?.find(
    (tran: TransactionColumn) => tran.id === transactionId
  );

  const form = useForm<formFields>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      dueAmount: transaction?.dueAmount,
      mobile: Number(transaction?.mobile),
      operator: transaction?.operator,
      plan: transaction?.plan,
    },
  });
  const onSubmit = async (data: formFields) => {
    mutate({
      transactionId: transactionId.toString(),
      ...data,
    });
  };
  return (
    <div className="flex items-center justify-center h-full p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5 border py-5 px-10 rounded-md shadow-xl  w-[35rem] h-[17rem]"
        >
          <MobileField form={form} isPending={isPending} />
          <PlanField form={form} isPending={isPending} />
          <OperatorField form={form} isPending={isPending} />
          <DueAmountField form={form} isPending={isPending} />
          <Button disabled={isPending} className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TramsactionEditPage;
