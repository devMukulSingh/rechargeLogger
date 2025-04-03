import { appRouter } from "@/src/server/routers";
import { createContext } from "@/src/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function handler(req: Request, res: Response) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createContext(opts),
  });
}

export { handler as GET, handler as POST };
