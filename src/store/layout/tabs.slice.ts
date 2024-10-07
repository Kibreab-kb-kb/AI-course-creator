import { StateCreator } from "zustand";
export interface TabsSlice {
  currentTab: number;
  tabs: {
    id: number;
    name: string;
    route: string;
    icon?: JSX.Element;
  }[];
  setCurrentTab: (id: number) => void;
}

export const createTabsSlice: StateCreator<TabsSlice> = (set) => ({
  currentTab: 0,
  tabs: [
    { id: 0, name: "Dashboard", route: "/home" },
    { id: 1, name: "Courses", route: "/courses" },
    { id: 2, name: "Create Course", route: "/create-course" },
    { id: 3, name: "Settings", route: "/settings" },
  ],
  setCurrentTab: (id: number) => {
    set({ currentTab: id });
  },
});
