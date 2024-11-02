import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Iform } from "../page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

const OperatorField = ({ form, isPending }: Iform) => {
  const operators = [
    {
      title: "Jio",
      value: "jio",
    },
    {
      title: "Airtel",
      value: "airtel",
    },
    {
      title: "VI",
      value: "vi",
    },
    {
      title: "BSNL",
      value: "bsnl",
    },
  ];
  return (
    <>
      <FormField
        control={form.control}
        name="operator"
        defaultValue="airtel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operator</FormLabel>
            <Select
              disabled={isPending}
              value={field.value}
              onValueChange={field.onChange}
              defaultValue="airtel"
            >
              <FormControl>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {operators.map((operator, index) => (
                  <SelectItem value={operator.value} key={index}>
                    {operator.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OperatorField;
