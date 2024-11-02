import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src//components/ui/input";
import { Iform } from "../page";

const DueAmountField = ({ form, isPending }: Iform) => {
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

export default DueAmountField;
