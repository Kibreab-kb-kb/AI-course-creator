import { create } from "zustand";
import { EmailSlice, createEmailStore } from "./email.slice";

export interface AuthSlice extends EmailSlice {}

export const AuthStore = create<AuthSlice>((...args) => ({
  ...createEmailStore(...args),
}));
