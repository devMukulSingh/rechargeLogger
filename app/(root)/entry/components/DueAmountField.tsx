import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Iform } from "../page";

const DueAmountField = ({ form, isMutating }: Iform) => {
  return (
    <>
      <FormField
        defaultValue={0}
        control={form.control}
        name="dueAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due Amount &#40;in ₹&#41;</FormLabel>
            <FormControl>
              <Input
                placeholder="0"
                {...field}
                className="text-black"
                disabled={isMutating}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DueAmountField;
