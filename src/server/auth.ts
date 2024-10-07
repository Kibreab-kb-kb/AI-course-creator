import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { SelectUser, user } from "@schema/user";

export const authRouter = router({
  send_otp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(
      async ({
        ctx: { supabase },
        ...opts
      }): Promise<{ data: boolean; error: string | null }> => {
        console.log("Sending OTP", opts.input.email);
        const { email } = opts.input;
        console.log("Sending OTP", email);

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });
        if (error) {
          console.error("Error sending OTP:", error.message, error);
          return {
            data: false,
            error: error.message,
          };
        }

        return {
          data: true,
          error: null,
        };
      },
    ),
  verify_otp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6),
      }),
    )
    .output(
      z.object({
        data: SelectUser,
        error: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx: { supabase, db }, ...opts }) => {
      const { email, otp } = opts.input;

      const { error, data } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) {
        throw new Error(error.message);
      }

      const created_user = await db
        .insert(user)
        .values({
          id: data.user?.id,
          email: data.user?.email ?? email,
        })
        .onConflictDoUpdate({
          target: user.email,
          set: {
            id: data.user?.id,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        error: null,
        data: created_user?.[0],
      };
    }),

  logout: protectedProcedure.mutation(async ({ ctx: { supabase } }) => {
    await supabase.auth.signOut();
    return true;
  }),
});
