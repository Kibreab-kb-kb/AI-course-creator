import { type StateCreator } from "zustand";
import { AuthError } from "@supabase/supabase-js";
import { SelectUser } from "@schema/user";
import { z } from "zod";

type User = z.infer<typeof SelectUser>;

export interface EmailSlice {
  user: User | null;
  userError: AuthError | null;
  userEmail: string;
  setUser: (user: User) => void;
  setUserEmail: (userEmail: string) => void;
}
export const createEmailStore: StateCreator<EmailSlice> = (set) => ({
  user: null,
  userError: null,
  userEmail: "",
  setUserEmail: (userEmail: string) => set({ userEmail }),
  setUser: (user) => set({ user }),
});
