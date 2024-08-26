"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Menu, Trash } from "lucide-react";
import { TransactionColumn } from "./TransactionColumn";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/AlertModal";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";

type Props = {
  data: TransactionColumn;
};

async function deleteTransaction(url: string, { arg }: { arg: string }) {
  return await axios.delete(url, { data: { transactionId: arg } });
}

const TransactionAction = ({ data }: Props) => {
  console.log(data, "Data");

  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { trigger, isMutating } = useSWRMutation(
    `/api/transaction/delete-transaction`,
    deleteTransaction,
    {
      onSuccess() {
        toast.success("transaction deleted");
        setIsOpen(false);
        router.refresh();
      },
      onError(e) {
        toast.error("Something went wrong");
        console.log(e);
      },
    },
  );
  const handleDelete = async () => {
    await trigger(data.id);
  };
  return (
    <div>
      <AlertModal
        isOpen={isOpen}
        loading={isMutating}
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
