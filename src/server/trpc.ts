import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;

export const protectedProcedure = trpc.procedure.use(
  async function isAuthed(opts) {
    if (!opts.ctx.user) {
      throw new Error("Unauthorized");
    }
    return opts.next({
      ctx: {
        ...opts.ctx,
        user: opts.ctx.user,
      },
    });
  },
);
