import { Profile } from "@/app/(app)/settings/_components/Profile";
import { Credit } from "@/app/(app)/settings/_components/credits";
import { StateCreator } from "zustand";

interface Tab {
  id: string;
  name: string;
  component?: JSX.Element;
}

export interface TabsSlice {
  tabs: Tab[];
  selectedTab: Tab | null;
  setTab: (id: string) => void;
}
export const createTabsSlice: StateCreator<TabsSlice> = (set, get) => ({
  tabs: [
    {
      id: "1",
      name: "Profile",
      component: <Profile />,
    },
    {
      id: "2",
      name: "Credits",
      component: <Credit />,
    },
  ],
  selectedTab: null,

  setTab: (id: string) => {
    const tab = get().tabs.find((tab) => tab.id === id);
    set((state) => {
      return {
        ...state,
        selectedTab: tab,
      };
    });
  },
});
