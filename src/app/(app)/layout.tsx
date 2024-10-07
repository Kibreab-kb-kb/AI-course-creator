"use client";
import Image from "next/image";
import Link from "next/link";
import {
  GalleryThumbnails,
  Home,
  Package2,
  Pen,
  Search,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { trpc } from "../_trpc/client";
import { usePathname, useRouter } from "next/navigation";
import { NavStore } from "@/store/layout";
import { useEffect } from "react";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const icons = [
  {
    name: "Dashboard",
    icon: <Home className="h-6 w-6" />,
  },
  {
    name: "Courses",
    icon: <GalleryThumbnails className="h-6 w-6" />,
  },
  {
    name: "Create Course",
    icon: <Pen className="h-6 w-6" />,
  },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const logout = trpc.logout.useMutation();
  const user = trpc.get_me.useQuery().data;
  const router = useRouter();
  const pathName = usePathname();
  const { storeTabs, setCurrentTab, currentTab, header, setHeader } = NavStore(
    (state) => ({
      storeTabs: state.tabs,
      setCurrentTab: state.setCurrentTab,
      currentTab: state.currentTab,
      header: state.header,
      setHeader: state.setHeader,
    }),
  );

  const tabs = storeTabs.map((tab) => {
    return {
      ...tab,
      icon: icons.find((icon) => icon.name === tab.name)?.icon,
    };
  });

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push("/auth");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 2xl:w-48 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col w-full items-center gap-8 px-2 sm:py-5">
          <Link href="/" className="flex items-center 2xl:w-40 gap-2 text-lg ">
            <div className="w-9 rounded-full h-9 bg-primary flex items-center justify-center shrink-0 font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base text-lg">
              <div>M</div>
              <span className="sr-only">Memarya</span>
            </div>
            <span className="text-xl font-bold text-gray-600 hidden 2xl:flex">
              Memarya
            </span>
          </Link>
          {tabs
            .filter((t) => t.name.toLowerCase() !== "settings")
            .map((t) => (
              <TooltipProvider key={t.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={t.route}
                      prefetch={true}
                      className={clsx(
                        "flex h-12 w-12  items-center p-2 py-1 hover:bg-neutral-50 justify-between rounded-lg  transition-colors hover:text-foreground md:h-8 2xl:h-12 2xl:w-44 md:w-8",
                        pathName === t.route
                          ? "text-neutral-800 bg-primary/10"
                          : "text-muted-foreground/50",
                      )}
                    >
                      <span className="w-1/4">{t.icon}</span>
                      <span className="w-3/4 hidden 2xl:block whitespace-nowrap">
                        {t.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{t.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="/settings"
                  className="flex  h-9 w-9 2xl:w-36 2xl:h-12 items-center justify-between rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-1/4" />
                  <span className="hidden 2xl:block w-3/4">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col 2xl:ml-40 w-[calc(100%-180px)] h-full  items-center  sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky w-full justify-end top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* @ts-ignore */}
          <DropdownMenu className="w-full justify-end">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar className="w-full flex justify-center h-full aspect-square">
                  <AvatarImage
                    className="object-cover cursor-pointer"
                    src={
                      user?.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgsaRe2zqH_BBicvUorUseeTaE4kxPL2FmOQ&s"
                    }
                  />
                  <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
                <Image
                  src={user?.avatar ?? "/avatar.jpg"}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.username ?? user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid h-full flex-1 max-w-screen-[1920px] px-2 w-full mb-20 items-start flex-col gap-4 p-4 pt-0 sm:px-6 sm:py-0 md:gap-8">
          <div
            className={clsx("text-4xl h-8 px-2 font-bold w-full flex", {
              "justify-center": header?.position === "center",
              "justify-start": header?.position === "left",
              "justify-end": header?.position === "right",
            })}
          >
            {header && header?.title}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
