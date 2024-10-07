"use client";

import { trpc } from "@/app/_trpc/client";
import { NavStore } from "@/store/layout";
import { useEffect } from "react";
import CourseCard from "./_components/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Page: React.FC = () => {
  const get_all_courses = trpc.get_all_courses.useQuery();
  const { setHeader } = NavStore((state) => ({
    setHeader: state.setHeader,
  }));

  useEffect(() => {
    setHeader("Courses", "left");
  }, []);

  if (get_all_courses.isPending) {
    return <div>Loading...</div>;
  }
  if (get_all_courses.isError) {
    return <div> Something wrong</div>;
  }

  const courses = get_all_courses.data;

  return (
    <div className="w-full px-12 h-full justify-start flex flex-col gap-4">
      <div className="w-full">
        <Input placeholder={"Search"} className="w-80 ring-offset-white" />
      </div>
      <Separator />
      <div className="grid grid-cols-1 h-full sm:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5 3xl:gri-cols-6 gap-4">
        {courses.map((c) => {
          return (
            <>
              <CourseCard
                course={{
                  ...c,
                  createdAt: new Date(c.createdAt),
                  updatedAt: new Date(c.updatedAt),
                }}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
