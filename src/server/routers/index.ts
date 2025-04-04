import { router } from "../trpc";
import { analyticsRouter } from "./analyticsRouter";
import { transactionRouter } from "./transactionRouter";

export const appRouter = router({
  transactionRouter,
  analyticsRouter
});

export type AppRouter = typeof appRouter;
