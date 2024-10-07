"use client";
import { NavStore } from "@/store/layout";
import React, { useEffect, useState } from "react";
import InfoCard from "./_components/card";
import Chart from "./_components/Chart";
import { trpc } from "@/app/_trpc/client";
import { Book, FileQuestionIcon, Pen } from "lucide-react";
import TimeTabs from "./_components/time-tabs";
import CourseTable from "./_components/CourseTable";

export default function Page() {
  const [time, setTime] = useState<"week" | "month" | "year" | "all" | "day">(
    "week",
  );
  const simple_analytics = trpc.getSimpleData.useQuery({
    time,
  });
  const { setHeader } = NavStore((state) => ({
    setHeader: state.setHeader,
  }));
  useEffect(() => {
    setHeader("Home", "left");
  }, []);

  useEffect(() => {
    simple_analytics.refetch();
  }, [time]);
  const data = simple_analytics.data;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1920px] flex flex-col gap-4 h-full">
        <div className="w-full justify-end flex">
          <TimeTabs setTime={setTime} time={time} />
        </div>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <InfoCard
            loading={!data}
            header={"Courses"}
            icon={<Pen />}
            number={data?.courses_generated ?? 0}
            description={"Courses Generated"}
          />
          <InfoCard
            loading={simple_analytics.isPending}
            header={"Chapters"}
            icon={<Book />}
            number={data?.chapters_completed ?? 0}
            description={"Chapters Completed"}
          />
          <InfoCard
            loading={simple_analytics.isPending}
            header={"Questions"}
            icon={<FileQuestionIcon />}
            number={`${(((data?.questions_correctly_answered ?? 0) / (data?.questions_attempted ?? 1)) * 100).toFixed(1)}%`}
            description={"Questions Answered"}
          />
          <InfoCard
            loading={simple_analytics.isPending}
            header={""}
            icon={<></>}
            number={0}
            description={"Courses Generated"}
          />
        </div>
        <div className="w-full flex gap-8 mt-2 h-[600px]">
          <div className="w-2/3 h-full">
            <Chart />
          </div>
          <div className="w-1/3 h-full">
            <CourseTable />
          </div>
        </div>
      </div>
    </div>
  );
}
