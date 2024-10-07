import { StateCreator } from "zustand";
import { CourseStore } from ".";
export interface FetchingSlice {
  fetching: boolean[];
  addFetching: (key: string) => void;
  removeFetching: (key: string) => void;
}
export const createFetchingSlice: StateCreator<FetchingSlice> = (set, get) => ({
  fetching: [],
  addFetching: () =>
    set((state) => {
      return { fetching: [...state.fetching, true] };
    }),
  removeFetching: () =>
    set((state) => {
      const index = state.fetching.indexOf(true);
      return {
        fetching: state.fetching.filter((_, i) => i !== index),
      };
    }),
});
