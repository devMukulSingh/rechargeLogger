import { rechargeSchema } from "@/src/lib/schema";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";


export const transactionRouter = router({
    postTransaction: publicProcedure.input(rechargeSchema).mutation(async ({ input: { dueAmount, mobile, operator, plan } }) => {
        const { userId } = auth();
        if (!userId) return null;
        const newTransaction = await prisma.transaction.create({
            data: {
                userId,
                mobile: mobile.toString(),
                dueAmount,
                operator: {
                    create: {
                        name: operator,
                    },
                },
                plan: {
                    create: {
                        amount: plan,
                    },
                },
            },
        });
        return newTransaction;
    }),

    updateTransaction: publicProcedure.input(
        z.object({
            mobile: z.number().refine((num) => num.toString().length === 10, {
                message: "Number must be 10 in length",
            }),
            operator: z.string().min(1, {
                message: "Operator is required",
            }),
            plan: z.number().min(1, {
                message: "plan is required",
            }),
            dueAmount: z.number().min(0, {
                message: "dueAmount is required",
            }),
            transactionId:z.string()
        })

    ).mutation(async ({ input: { dueAmount, mobile, operator, plan,transactionId } }) => {
        const { userId } = auth();
        if (!userId) return null;
        return await prisma.transaction.update({
            data: {
                mobile: mobile.toString(),
                dueAmount,
                operator: {
                    create: {
                        name: operator,
                    },
                },
                plan: {
                    create: {
                        amount: plan,
                    },
                },
            },
            where: {
                id: transactionId,
                userId,
            },
        });
    }),

    deleteTransaction: publicProcedure.input(
        z.object({
            transactionId:z.string()
        })
    ).mutation(async ( {input:{transactionId}}) => {
        const { userId } = auth();
        if (!userId) return null;
        const transaction = await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        });
        return {transaction}
    }),

    getTransaction: publicProcedure.input(z.object({
            pageIndex:z.number(),
            pageSize:z.number(),
            mobile:z.string()}))
            .query(async ({ctx,input : {mobile,pageIndex,pageSize}}) => {
        const { userId } = auth();
        if (!userId) return null;
        
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                mobile,
            },
            include: {
                operator: {
                    select: {
                        name: true,
                    },
                },
                plan: {
                    select: {
                        amount: true,
                    },
                },
            },
            skip: Number(pageIndex) * Number(pageSize),
            take: Number(pageSize),
        });
        const totalTransactions = await prisma.transaction.count({
            where: {
                userId,
                mobile,
            },
        });
        const formattedTransaction = transactions.map((transaction) => ({
            plan: transaction.plan.amount,
            dueAmount: transaction.dueAmount,
            operator: transaction.operator.name,
            mobile: transaction.mobile,
            createdAt: transaction.createdAt,
            id: transaction.id,
        }));
        const totalPages = Math.ceil(totalTransactions / Number(pageSize));
        return { transactions: formattedTransaction, totalPages }
    }),

    getTransactions : publicProcedure.input(
        z.object({
            pageIndex:z.number(),
            pageSize:z.number()
        })
    ).query( async( {input:{pageIndex,pageSize}}) => {

        const { userId } = auth();
        if (!userId) return null;
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
            },
            skip: Number(pageIndex) * Number(pageSize),
            take: Number(pageSize),
            include: {
                operator: {
                    select: {
                        name: true,
                    },
                },
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

        const totalTransactions = await prisma.transaction.count({
            where: {
                userId,
            },
        });

        const formattedTransaction = transactions?.map((item) => ({
            plan: item.plan.amount,
            dueAmount: item.dueAmount,
            operator: item.operator.name,
            mobile: item.mobile,
            createdAt: item.createdAt,
            id: item.id,
        }));

        const totalPages = Math.ceil(totalTransactions / 8);

        return { transactions:formattedTransaction, totalPages };
    }),

    getAllTransactions : publicProcedure.query( async() => {
        const { userId } = auth()
        if(!userId) return null;

        const year = new Date().getFullYear();
        const currYearDate = new Date(1, 1, year);
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                createdAt: {
                    gte: currYearDate,
                },
            },
            select:{

                createdAt:true,
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
        return transactions 
    })
})
