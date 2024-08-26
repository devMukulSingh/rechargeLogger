import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { format } from "date-fns";

export const getTransactions = cache(async () => {
  try {
    const data = await prisma.transaction.findMany({
      include: {
        operator: true,
        plan: true,
      },
    });
    const formatted = data.map((item) => ({
      plan: item.plan.amount,
      dueAmount: item.dueAmount,
      operator: item.operator.name,
      mobile: item.mobile,
      createdAt: format(item.createdAt, "dd/MM/yyyy"),
      id: item.id,
    }));

    return formatted;
  } catch (e) {
    console.log(e);
  }
});
