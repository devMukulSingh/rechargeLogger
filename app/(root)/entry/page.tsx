"use client";
import { Form } from "@/components/ui/form";
import { rechargeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {  useForm, UseFormReturn } from "react-hook-form";
import MobileField from "./components/MobileField";
import OperatorField from "./components/OperatorField";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import DueAmountField from "./components/DueAmountField";
import PlanField from "./components/PlanField";
import axios from "axios"
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";

export interface Iform {
  form: UseFormReturn<
    {
      mobile: number;
      operator: string;
      plan: number;
      dueAmount:number;
    },
    any,
    undefined
  >;
  isMutating:boolean
}

async function sendRequest(url:string,{arg}:{arg:formFields}){
  return await axios.post(url,arg);
}

type formFields = z.infer<typeof rechargeSchema>

const EntryPage = () => {
  const { data,isMutating,trigger } = useSWRMutation(`/api/transaction/add-transaction`,sendRequest,{
    onError(e){
      console.log(`Error in /api/transaction/add-transaction`,e);
      toast.error('Something went wrong, please try again later')
    },
    onSuccess(){
      toast.success('Transaction added');
      form.reset({dueAmount:0,operator:'airtel',plan:299,mobile:0})
    }
  });
  const form = useForm<formFields>({
    resolver: zodResolver(rechargeSchema),

  });
  const onSubmit = async(data: formFields) => {
  await trigger(data)
  }
  return (
    <div className="flex items-center justify-center h-full py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5 border py-5 px-10 rounded-md shadow-xl "
        >
          <MobileField form={form} isMutating={isMutating}/>
          <PlanField form={form} isMutating={isMutating}/>
          <OperatorField form={form} isMutating={isMutating}/>
          <DueAmountField form={form} isMutating={isMutating}/>
          <Button disabled={isMutating} className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EntryPage;
