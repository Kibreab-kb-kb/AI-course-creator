import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

interface TimeTabProps {
  time: "week" | "month" | "year" | "all" | "day";
  setTime: Dispatch<SetStateAction<"week" | "month" | "year" | "all" | "day">>;
}

const TimeTabs: React.FC<TimeTabProps> = ({ time, setTime }) => {
  return (
    <Tabs defaultValue={time}>
      <TabsList>
        <TabsTrigger onClick={() => setTime("day")} value="day">
          Today
        </TabsTrigger>
        <TabsTrigger onClick={() => setTime("week")} value="week">
          Week
        </TabsTrigger>
        <TabsTrigger onClick={() => setTime("month")} value="month">
          Month
        </TabsTrigger>
        <TabsTrigger onClick={() => setTime("year")} value="year">
          Year
        </TabsTrigger>
        <TabsTrigger onClick={() => setTime("all")} value="all">
          All
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TimeTabs;
