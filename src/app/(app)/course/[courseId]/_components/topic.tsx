import { CourseStore } from "@/store/course";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const TopicPage = () => {
  const { currentTopic, currentChapter, setCurrentTopic } = CourseStore();

  const index = currentChapter?.topics.findIndex(
    (t) => t.id == currentTopic?.id,
  );

  const lastTopic =
    index && index !== -1 && index > 0
      ? currentChapter?.topics[index - 1]
      : null;
  const nextTopic =
    index !== undefined &&
    index !== -1 &&
    index < (currentChapter?.topics.length ?? 1)
      ? currentChapter?.topics[index + 1]
      : null;

  return (
    <div className="w-full flex flex-col gap-8 h-full">
      <h1 className="text-xl font-medium">{currentTopic?.title}</h1>
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video h-full max-h-[28rem]"
        src={`https://www.youtube.com/embed/${currentTopic?.videoUrl}`}
        allowFullScreen
        width={560}
        height={315}
      />
      <div className="flex flex-col gap-4">
        <span className="text-lg font-medium">Summary</span>
        <span>{currentTopic?.summary}</span>
      </div>
      <div className="flex justify-between w-full items-center">
        <Link
          href=""
          onClick={() => {
            if (lastTopic) setCurrentTopic(lastTopic.id);
          }}
          className="w-2/5"
        >
          {lastTopic && (
            <span className=" flex">
              <ChevronLeft />
              <span className="overflow-hidden w-5/6 whitespace-nowrap  text-ellipsis">
                {lastTopic.title}
              </span>
            </span>
          )}
        </Link>
        <Link
          onClick={() => {
            if (nextTopic) setCurrentTopic(nextTopic.id);
          }}
          href=""
          className="w-2/5 flex justify-end items-center"
        >
          {nextTopic && (
            <span className=" flex">
              <span className="overflow-hidden w-5/6 whitespace-nowrap  text-ellipsis">
                {nextTopic.title}
              </span>
              <ChevronRight />
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default TopicPage;
