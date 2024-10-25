import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    const mobile = req.nextUrl.searchParams.get("mobile");
    const pageIndex = req.nextUrl.searchParams.get("pageIndex");
    const pageSize = req.nextUrl.searchParams.get("pageSize");

    if (!userId)
      return NextResponse.json(
        {
          error: "Unauthenticated",
        },
        { status: 403 },
      );

    if (!mobile)
      return NextResponse.json(
        {
          error: "Mobile is required",
        },
        { status: 400 },
      );

    if (!pageIndex)
      return NextResponse.json(
        {
          error: "Page index is required",
        },
        { status: 400 },
      );
    if (!pageSize)
      return NextResponse.json(
        {
          error: "page Size is required",
        },
        { status: 400 },
      );

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
    const formattedTransaction = transactions.map((transaction, index) => ({
      plan: transaction.plan.amount,
      dueAmount: transaction.dueAmount,
      operator: transaction.operator.name,
      mobile: transaction.mobile,
      createdAt: transaction.createdAt,
      id: transaction.id,
    }));
    const totalPages = Math.ceil(totalTransactions / Number(pageSize));
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
