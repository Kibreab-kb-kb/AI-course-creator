"use client";
import { trpc } from "@/app/_trpc/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CourseStore } from "@/store/course";
import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import TopicPage from "./_components/topic";
import Chapter from "./_components/Chapter";
import Question from "./_components/questions";

interface PageProps {
  params: {
    courseId: string;
  };
}

const Page: React.FC<PageProps> = ({ params: { courseId } }) => {
  const get_course = trpc.get_course.useQuery({
    id: courseId,
  });

  const {
    currentChapter,
    setCurrentChapter,
    setCourse,
    currentTopic,
    setCurrentTopic,
  } = CourseStore();

  useEffect(() => {
    if (!get_course.data?.data) return;
    setCourse(get_course.data.data);
  }, [currentChapter, get_course.data?.data]);

  if (get_course.error) {
    console.log(get_course.error);
    return <div>Something went Wrong</div>;
  }

  if (!get_course.data?.data) {
    return <div>Loading...</div>;
  }

  const course = get_course.data.data;
  return (
    <div className="w-full flex h-[85vh] justify-center">
      <div className="w-full flex justify-between max-w-screen-2xl h-full">
        <div className="pr-4 flex flex-col border-r w-1/3 gap-4 h-full">
          <span className="text-3xl font-medium">{course.title}</span>
          {course.chapters.map((chapter) => {
            return (
              <Accordion key={chapter.title} type="single" collapsible>
                <AccordionItem value={chapter.id}>
                  <AccordionTrigger
                    onClick={() => {
                      if (!currentChapter) {
                        setCurrentChapter(chapter.id);
                      }
                    }}
                  >
                    <span
                      className={clsx("", {
                        underline: currentChapter?.id === chapter.id,
                      })}
                      onClick={() => setCurrentChapter(chapter.id)}
                    >
                      {chapter.title}
                    </span>
                  </AccordionTrigger>
                  {chapter.topics.map((topic) => {
                    return (
                      <AccordionContent key={topic.title}>
                        <Link
                          href="#"
                          onClick={() => {
                            setCurrentTopic(topic.id);
                          }}
                          className={clsx(
                            "hover:text-primary/50 transition-all duration-100 text-neutral-800",
                            {
                              "text-primary": currentTopic?.id === topic.id,
                            },
                          )}
                        >
                          {topic.title}
                        </Link>
                      </AccordionContent>
                    );
                  })}
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
        <div className="w-full flex gap-8 flex-col px-4 h-full">
          {currentTopic ? (
            <>
              <TopicPage />
            </>
          ) : (
            <>{currentChapter && <Chapter />}</>
          )}
        </div>
        <div className="w-2/5 flex flex-col gap-4 overflow-y-hidden  pl-4 border-l h-full">
          <span className="text-3xl font-medium">Quiz</span>
          {currentTopic && <Question />}
        </div>
      </div>
    </div>
  );
};

export default Page;
