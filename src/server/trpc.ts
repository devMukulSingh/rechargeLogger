import { initTRPC, TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
// import { isAuth } from "../utils/jwt";


export const createContext = async (opts: FetchCreateContextFnOptions): Promise<Request> => {
    return opts.req
};
export const t = initTRPC.context<typeof createContext>().create();


// export const t = initTRPC.create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ next }) => {
    // const isJwtVerified = await isAuth(token);

    // if (!isJwtVerified) throw new TRPCError({
    //     code: "FORBIDDEN",
    //     message: "User is unauthenticated"
    // })

    return next()
})