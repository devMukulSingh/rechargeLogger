import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Iform } from "../page";

const PlanField = ({ form, isPending }: Iform) => {
  return (
    <>
      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plan &#40;in ₹&#41;</FormLabel>
            <FormControl>
              <Input
                placeholder="299"
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

export default PlanField;
