"use client";
import { trpc } from "@/app/_trpc/client";
import { SettingsStore } from "@/store/settings";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SideBar = () => {
  const logout = trpc.logout.useMutation();
  const router = useRouter();
  const { tabs, setTab, selectedTab } = SettingsStore((state) => ({
    tabs: state.tabs,
    setTab: state.setTab,
    selectedTab: state.selectedTab,
  }));

  useEffect(() => {
    setTab(tabs[0].id);
  }, [tabs]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="sidebar flex flex-col gap-8 mt-4 text-neutral-400">
        {tabs.map((tab) => {
          return (
            <div
              key={tab.id}
              onClick={() => {
                setTab(tab.id);
              }}
              className={clsx(
                "hover:text-neutral-600 cursor-pointer transition-all duration-100",
                {
                  "text-neutral-900 font-medium": selectedTab?.id == tab.id,
                },
              )}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
      <div
        onClick={async () => {
          await logout.mutateAsync();
          router.push("/auth");
        }}
        className="hover:text-red-500 relative cursor-pointer bottom-0 mt-auto"
      >
        Logout
      </div>
    </div>
  );
};

export default SideBar;
