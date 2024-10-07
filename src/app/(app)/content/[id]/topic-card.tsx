"use client";
import { trpc } from "@/app/_trpc/client";
import { Topic } from "@/server/course";
import { CourseStore } from "@/store/course";
import clsx from "clsx";
import { Pencil } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface TopicCardProps {
  topic: Topic & { id: string; videoUrl: string | null };
  setCompleted: Dispatch<SetStateAction<Set<string>>>;
}

export interface TopicHandler {
  handleTopic: () => Promise<void>;
}

const TopicCard = forwardRef<TopicHandler, TopicCardProps>(
  ({ topic, setCompleted }, ref) => {
    const get_info = trpc.get_info.useQuery(
      {
        topic_id: topic.id,
      },
      {
        enabled: false,
      },
    );

    useEffect(() => {
      if (topic.videoUrl) {
        setCompleted((prev) => new Set(prev.add(topic.id)));
        setSuccess(true);
      }
    }, [topic.videoUrl, setCompleted, topic.id]);
    const [success, setSuccess] = useState<boolean | null>(null);
    useImperativeHandle(ref, () => {
      return {
        handleTopic: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 2000),
          );
          if (topic.videoUrl) {
            setCompleted((prev) => new Set(prev.add(topic.id)));
            setSuccess(true);
            return;
          }
          //if there are more than 2 requests already return
          const { data, error } = await get_info.refetch();

          if (data?.error || error) {
            setSuccess(false);
            return;
          }

          setSuccess(data?.data ?? false);

          if (data?.data) {
            setCompleted((prev) => new Set(prev.add(topic.id)));
            setSuccess(true);
            // removeFetching(topic.id);
          }
        },
      };
    });

    return (
      <div
        className={clsx(
          "flex gap-4 items-center w-full bg-gray-100 p-2 border border-gray-200 rounded-md",
          {
            "bg-green-500": success === true,
            "bg-red-500": success === false,
            "bg-gray-100": success === null,
          },
        )}
      >
        <Pencil className="h-4 w-4" />
        <span>{topic.title}</span>
      </div>
    );
  },
);

TopicCard.displayName = "TopicCard";

export default TopicCard;
