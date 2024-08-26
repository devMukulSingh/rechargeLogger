import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 403 });

    const { transactionId } = await req.json();
    if (!transactionId)
      return NextResponse.json(
        { error: "transactionId is required" },
        { status: 400 },
      );

    const transaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return NextResponse.json(
      { msg: "transaction deleted", transaction },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server error", e },
      { status: 500 },
    );
  }
}
