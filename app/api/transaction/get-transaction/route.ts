import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    const mobile = req.nextUrl.searchParams.get('mobile');

    if (!userId)
      return NextResponse.json(
        {
          error: "Unauthenticated",
        },
        { status: 403 },
      );

    if (!mobile) return NextResponse.json(
      {
        error: "Mobile is required",
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
    });

    const formattedTransaction = transactions.map((transaction, index) => ({
      plan: transaction.plan.amount,
      dueAmount: transaction.dueAmount,
      operator: transaction.operator.name,
      mobile: transaction.mobile,
      createdAt: format(transaction.createdAt, "HH:mm - dd/MM/yyyy"),
      id: transaction.id,
    }
    ))
    return NextResponse.json({ transactions: formattedTransaction }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
