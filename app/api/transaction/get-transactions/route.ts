import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,res:NextResponse){
    try{
        const { userId } = auth();

        if(!userId) return NextResponse.json({error:"Unauthenticated"},{status:403});

        const transaction = await prisma.transaction.findMany({
            include:{
                operator:true,
                plan:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        
        return NextResponse.json(transaction,{status:200});
    }

    catch(e){
        console.log(e)
        return NextResponse.json({error:'Internal Server error'},{status:500});
    }
}