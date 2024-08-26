import { z } from "zod";

export const rechargeSchema = z.object({
  mobile: z.coerce
    .number()
    .min(1, {
      message: "Number is required",
    })
    .max(10, {
      message: "Maximum 10 numbers allowed",
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
