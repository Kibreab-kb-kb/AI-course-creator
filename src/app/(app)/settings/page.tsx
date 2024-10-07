"use client";
import { NavStore } from "@/store/layout";
import { useEffect } from "react";
import SideBar from "./_components/sidebar";
import { Separator } from "@/components/ui/separator";
import { SettingsStore } from "@/store/settings";

const Page = () => {
  const { setHeader } = NavStore((state) => ({
    setHeader: state.setHeader,
  }));

  useEffect(() => {
    setHeader("Settings", "left");
  }, []);

  const { tabs, setTab, selectedTab } = SettingsStore((state) => ({
    tabs: state.tabs,
    setTab: state.setTab,
    selectedTab: state.selectedTab,
  }));
  return (
    <div className="w-full flex justify-center h-full">
      <div className="w-full flex justify-center h-[80vh] max-w-screen-xl">
        <div className="w-1/4">
          <SideBar />
        </div>
        <Separator orientation="vertical" />
        <div className="w-full">{selectedTab?.component}</div>
      </div>
    </div>
  );
};

export default Page;
