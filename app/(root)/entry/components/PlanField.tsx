import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Iform } from "../page";


const PlanField = ({
    form
}:Iform) => {
  return (
    <>
      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plan &#40;in ₹&#41;</FormLabel>
            <FormControl>
              <Input placeholder="299" {...field} className="text-black" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PlanField;
