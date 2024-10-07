import { StateCreator } from "zustand";

export interface HeaderSlice {
  header: {
    title: string;
    position: "left" | "center" | "right";
  } | null;
  setHeader: (header: string, position?: "left" | "center" | "right") => void;
}

export const createHeaderSlice: StateCreator<HeaderSlice> = (set, get) => ({
  header: null,
  setHeader: (header, position) =>
    set({ header: { title: header, position: position ?? "center" } }),
});
