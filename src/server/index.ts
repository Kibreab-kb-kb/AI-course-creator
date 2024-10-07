import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";
import { authRouter } from "./auth";
import { courseRouter } from "./course";
import { questionRouter } from "./question";
import { analyticsRouter } from "./analytics";
import { userRouter } from "./user";

export const appRouter = mergeRouters(
  authRouter,
  courseRouter,
  questionRouter,
  analyticsRouter,
  userRouter,
);

export type AppRouter = typeof appRouter;
