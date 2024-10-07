import { create } from "zustand";
import { TabsSlice, createTabsSlice } from "./tabs.slice";
import { HeaderSlice, createHeaderSlice } from "./header.slice";

interface NavStoreType extends TabsSlice, HeaderSlice {}

export const NavStore = create<NavStoreType>((...args) => ({
  ...createTabsSlice(...args),
  ...createHeaderSlice(...args),
}));
