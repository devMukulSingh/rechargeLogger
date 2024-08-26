import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const { transactionId, mobile, operator, plan, dueAmount } =
      await req.json();





    if (!mobile)
      return NextResponse.json(
        { error: "Mobile is required" },
        { status: 400 },
      );
    if (!operator)
      return NextResponse.json(
        { error: "operator is required" },
        { status: 400 },
      );
    if (!plan)
      return NextResponse.json({ error: "plan is required" }, { status: 400 });

    const transaction = await prisma.transaction.update({
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
      },
    });

    return NextResponse.json(
      { msg: "Transaction updated successfully", transaction },
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
