import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {


    const transaction = await prisma.transaction.findMany({
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

    return NextResponse.json(transaction, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
