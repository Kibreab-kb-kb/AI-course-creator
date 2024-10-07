import { z } from "zod";
import { protectedProcedure, router } from "./trpc";
import { user } from "@schema/user";
import { eq } from "drizzle-orm";

export const userRouter = router({
  get_me: protectedProcedure
    .output(
      z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        username: z.string().nullable(),
        createdAt: z.date(),
        avatar: z.string().nullable(),
        bio: z.string().nullable(),
      }),
    )
    .query(async ({ ctx: { user: u, db } }) => {
      const user_id = u.id;

      const fetched_user = await db
        .select()
        .from(user)
        .where(eq(user.id, user_id));

      if (fetched_user.length === 0) {
        throw new Error("User not found");
      }

      return { ...fetched_user[0], email: u.email! };
    }),

  update_me: protectedProcedure
    .output(z.boolean())
    .input(
      z.object({
        username: z.string().optional(),
        avatar: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { user: u, db }, input }) => {
      const user_id = u.id;

      await db.update(user).set(input).where(eq(user.id, user_id));

      return true;
    }),
});
