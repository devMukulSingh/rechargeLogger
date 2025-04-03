"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Copy, Edit, Menu, Trash } from "lucide-react";
import { TransactionColumn } from "./TransactionColumn";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/src/components/AlertModal";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { trpc } from "@/src/lib/trpc";

type Props = {
  data: TransactionColumn;
};

async function deleteTransaction(url: string, { arg }: { arg: string }) {
  return await axios.delete(url, { data: { transactionId: arg } });
}

const TransactionAction = ({ data }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending } =
    trpc.transactionRouter.deleteTransaction.useMutation({
      trpc: {
        abortOnUnmount: false,
      },
      onSuccess() {
        toast.success("transaction deleted");
        setIsOpen(false);
        router.refresh();
      },
      onError(e) {
        toast.error("Something went wrong");
        console.log(e);
      },
    });

  const handleDelete = async () => {
    mutate({ transactionId: data.id });
  };
  return (
    <div>
      <AlertModal
        isOpen={isOpen}
        loading={isPending}
        onClose={() => setIsOpen(false)}
        onConform={handleDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/transactions/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-3" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-3" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TransactionAction;
