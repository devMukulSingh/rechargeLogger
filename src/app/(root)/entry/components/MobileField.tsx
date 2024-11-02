import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Iform } from "../page";
import { useEffect, useRef, useState } from "react";

const MobileField = ({ form, isPending }: Iform) => {
  // const inputRef = useRef<HTMLInputElement | null>(null);
  // useEffect(() => {
  //   if (inputRef.current) inputRef.current.focus();
  // }, []);
  return (
    <>
      <FormField
        control={form.control}
        name="mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile</FormLabel>
            <FormControl>
              <Input
                placeholder="9808273072"
                {...field}
                // ref={inputRef}
                className="text-black"
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MobileField;
