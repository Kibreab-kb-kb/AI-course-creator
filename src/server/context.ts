import { db } from "@/lib/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createClient } from "@/lib/supabase/server";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const { req } = opts;
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  return {
    req,
    db,
    supabase,
    user:user.data.user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
