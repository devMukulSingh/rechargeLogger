"use client";
const MobileField = dynamic(() => import("./components/MobileField"), {
  loading: () => <InputSkeleton />,
});
const OperatorField = dynamic(() => import("./components/OperatorField"), {
  loading: () => <InputSkeleton />,
});
const DueAmountField = dynamic(() => import("./components/DueAmountField"), {
  loading: () => <InputSkeleton />,
});
const PlanField = dynamic(() => import("./components/PlanField"), {
  loading: () => <InputSkeleton />,
});
import { Form } from "@/src/components/ui/form";
import { rechargeSchema } from "@/src/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { z } from "zod";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import InputSkeleton from "./components/InputSkeleton";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr/_internal";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/src/lib/trpc";

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

const EntryPage = () => {
  const { mutate,isPending,isSuccess } =
    trpc.transactionRouter.postTransaction.useMutation({
      onError(e) {
        console.log(`Error in add-transaction`, e);
        toast.error("Something went wrong, please try again later");
      },
      onSuccess() {
        toast.success("Transaction added");
        form.reset();
        form.setFocus("mobile", { shouldSelect: true });
      },
    });

  const form = useForm<formFields>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      dueAmount: 0,
      mobile: 0,
      operator: "",
      plan: 299,
    },
  });
  const onSubmit = async (data: formFields) => {
    mutate(data);
  };
  useEffect(() => {
    form.setFocus("mobile", { shouldSelect: true });
  }, [form.setFocus, isSuccess]);
  return (
    <div className="flex items-center justify-center h-full py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5 border py-5 px-10 rounded-md shadow-xl w-[35rem] h-[17rem]"
        >
          <MobileField form={form} isPending={isPending} />
          <PlanField form={form} isPending={isPending} />
          <OperatorField form={form} isPending={isPending} />
          <DueAmountField form={form} isPending={isPending} />
          <Button disabled={isPending} className="col-span-2 mt-auto">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EntryPage;
