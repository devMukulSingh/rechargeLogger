import { router } from "../trpc";
import { transactionRouter } from "./transactionRouter";

export const appRouter = router({
  transactionRouter,
});

export type AppRouter = typeof appRouter;
