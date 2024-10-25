import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();

    if (!userId)
      return NextResponse.json(
        {
          error: "Unauthenticated",
        },
        { status: 403 },
      );
    const year = new Date().getFullYear();
    const currYearDate = new Date(1, 1, year);
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: currYearDate,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedTransaction = transactions?.map((item) => ({
      plan: item.plan.amount,
      dueAmount: item.dueAmount,
      operator: item.operator.name,
      mobile: item.mobile,
      createdAt:item.createdAt,
      id: item.id,
    }));
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
