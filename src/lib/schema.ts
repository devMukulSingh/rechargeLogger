import { z } from "zod";

export const rechargeSchema = z.object({
  mobile: z.coerce.number().refine((num) => num.toString().length === 10, {
    message: "Number must be 10 in length",
  }),
  operator: z.string().min(1, {
    message: "Operator is required",
  }),
  plan: z.coerce.number().min(1, {
    message: "plan is required",
  }),
  dueAmount: z.coerce.number().min(0, {
    message: "dueAmount is required",
  }),
});
