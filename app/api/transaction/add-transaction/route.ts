import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    const { mobile, operator, plan, dueAmount } = await req.json();

    if(!userId) return NextResponse.json({
      error:'Unauthenticated'
    },{status:403});

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

    const transaction = await prisma.transaction.create({
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

    return NextResponse.json(
      { msg: "Transaction created successfully", transaction },
      { status: 201 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
