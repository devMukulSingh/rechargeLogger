import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { IgraphData } from "@/src/app/(root)/(dashboard)/components/ChartSection";
import { Plan } from "@prisma/client";
import { getYear } from "date-fns";

type TYear = {
  year: string;
};

export const analyticsRouter = router({
  getGraphData: publicProcedure
    .input(
      z.object({
        year: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = auth();
      if (!userId) return null;

      const currYearDate = new Date(Number(input.year), 1, 1);
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          createdAt: {
            gte: currYearDate,
          },
        },
        select: {
          createdAt: true,
          plan: {
            select: {
              amount: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const graphData: IgraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
      ];

      let i = 0;
      for (let obj of graphData) {
        let totalMonthlyRevenue = 0;
        //getting totalRevenue of a particular month
        totalMonthlyRevenue = transactions
          ?.filter((item) => new Date(item.createdAt).getMonth() === i)
          .map((item) => item.plan.amount)
          .reduce((acc, next) => {
            return acc + next;
          }, 0);
        //inserting total revenue of particular month in the graphData array
        obj.total = totalMonthlyRevenue;
        i++;
      }
      return graphData;
    }),
  ///////////////////////////////////////////////////////////////////////////
  getFilteredRevenue: publicProcedure
    .input(
      z.object({
        from: z.string({
          required_error: "From date is required",
        }),
        to: z.string({
          required_error: "To date is required",
        }),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = auth();
      if (!userId) return null;
      const { from, to } = input;

      let transactions: { plan: Plan }[];
      if (from !== "" && to !== "") {
        transactions = await prisma.transaction.findMany({
          where: {
            userId,
            createdAt: {
              gte: from,
              lte: to,
            },
          },
          select: {
            plan: true,
          },
        });
      } else {
        transactions = await prisma.transaction.findMany({
          where: {
            userId,
            createdAt: to === "" ? from : to,
          },
          select: {
            plan: true,
          },
        });
      }
      const totalRevenue = transactions.reduce(
        (prev, curr) => prev + curr.plan.amount,
        0,
      );
      return { totalRevenue, transactions: transactions.length };
    }),

  getYears: publicProcedure.query(async () => {
    const years =
      await prisma.$queryRaw`SELECT DISTINCT YEAR(createdAt) AS year FROM Transaction`;
    function json(param: unknown): string {
      return JSON.stringify(param, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
    }
    const parsed: TYear[] = JSON.parse(json(years));
    return parsed;
  }),
});
