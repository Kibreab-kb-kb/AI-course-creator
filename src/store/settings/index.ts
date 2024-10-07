// @ts-expect-error tsx needs to be used
import { createTabsSlice, TabsSlice } from "./tabs.slice.tsx";
import { create } from "zustand";

interface SettingsStoreType extends TabsSlice {}

export const SettingsStore = create<SettingsStoreType>((...args) => ({
  ...createTabsSlice(...args),
}));
