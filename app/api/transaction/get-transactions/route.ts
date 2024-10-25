import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    const pageIndex = req.nextUrl.searchParams.get("pageIndex");
    const pageSize = req.nextUrl.searchParams.get("pageSize");
    console.log(pageSize);

    if (!userId)
      return NextResponse.json(
        {
          error: "Unauthenticated",
        },
        { status: 403 },
      );

    if (!pageIndex)
      return NextResponse.json(
        {
          error: "Page index is required",
        },
        { status: 400 },
      );

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
      createdAt: format(item.createdAt, "PP- p",{
        
      }),
      id: item.id,
    }));
    
    const totalPages = Math.ceil(totalTransactions / 8);
    return NextResponse.json(
      { transactions: formattedTransaction, totalPages },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
