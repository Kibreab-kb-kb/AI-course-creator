"use client";
import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft, EllipsisVertical, Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import TopicCard, { TopicHandler } from "./topic-card";
import { createRef, useRef, useState } from "react";
import LoadingEllipsis from "@/components/loading/ellipsis";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";
import Link from "next/link";
import { PromiseQueue } from "@/lib/promiseQueue";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const fetchCourse = trpc.get_course.useQuery({
    id,
  });

  const topicRefs: Record<string, React.RefObject<TopicHandler>> = {};
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  // Need to rest for some time
  const [rest, setRest] = useState<boolean>(false);

  if (fetchCourse.isPending) {
    return <div>Loading...</div>;
  }

  if (fetchCourse.error || !fetchCourse.data.data || fetchCourse.data.error) {
    return <div>Error: {fetchCourse.data?.error}</div>;
  }

  const course = fetchCourse.data.data;

  course.chapters.forEach((chapter) => {
    chapter.topics.forEach((topic) => {
      topicRefs[topic.id] = createRef();
    });
  });

  const handleGenerate = async () => {
    setLoading(true);
    // Only allow 2 concurrent promises
    const promiseQueue = new PromiseQueue(2);

    const promises = Object.values(topicRefs).map(
      (ref) => () => promiseQueue.add(ref.current!.handleTopic),
    );

    try {
      await Promise.all(promises.map((f) => f()));
    } catch (error) {
      console.error("Error handling topics:", error);
      // Handle errors appropriately
    } finally {
      setLoading(false);
      setRest(true);
      setTimeout(() => {
        setRest(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="flex w-full max-w-2xl flex-col gap-8 items-start">
        <div>
          <span className="text-4xl font-medium">{course.title}</span>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Please Confirm</AlertTitle>
          <AlertDescription>
            Your course has been successfully created. Please confirm the
            details below.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-16 w-full">
          {course.chapters.map((chapter) => {
            return (
              <div key={chapter.id} className="flex flex-col gap-4">
                <span className="text-xl font-semibold">{chapter.title}</span>
                <div className="flex flex-col gap-2 w-full">
                  {chapter.topics.map((lesson) => {
                    return (
                      <TopicCard
                        ref={topicRefs[lesson.id]}
                        key={lesson.title}
                        topic={lesson}
                        setCompleted={setCompleted}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-evenly items-center w-full">
          <Button
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-1/4 flex justify-center gap-4"
            onClick={() => {
              router.push("/create-course");
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
            <div></div>
          </Button>
          <div className="flex items-center w-1/4 ">
            <Button
              disabled={
                loading ||
                rest ||
                completed.size == Object.values(topicRefs).length
              }
              onClick={handleGenerate}
              size="lg"
              className={clsx("w-full  h-12 ", {
                "rounded-r-none": completed.size > 1,
                "w-4/5": completed.size > 1,
              })}
            >
              {loading ? <LoadingEllipsis /> : "Confirm"}
            </Button>
            {completed.size > 1 && (
              <Popover>
                <PopoverTrigger disabled={loading} className="w-1/5">
                  <Button className="border-l w-full h-12 p-0 rounded-l-none">
                    <EllipsisVertical className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1">
                  <div className="flex flex-col">
                    <Link href={`/course/${course.id}`}>
                      <Button
                        disabled={loading}
                        variant="ghost"
                        className="w-full p-0"
                      >
                        Save and Continue
                      </Button>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        {rest && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Please Wait</AlertTitle>
            <AlertDescription>
              Please wait 5 seconds before trying to generate the course again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
