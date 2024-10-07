import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CircularProgressBar } from "@/components/ui/circular_progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectCourse } from "@schema/course";
import { Book, FileQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

interface CardProps {
  course: z.infer<typeof SelectCourse> & {
    chapters: {
      id: string;
      topics: ({
        id: string;
        started: string | null;
        completed: string | null;
        questions?:
          | {
              id: string;
              answered: string | null;
            }[]
          | undefined;
      } | null)[];
    }[];
  };
}
const CourseCard: React.FC<CardProps> = ({ course }) => {
  const number_of_questions = course.chapters.reduce((acc, row) => {
    for (let r of row.topics) {
      acc += r?.questions?.length ?? 0;
    }

    return acc;
  }, 0);

  const number_of_topics = course.chapters.reduce((acc, row) => {
    for (let r of row.topics) {
      acc += r ? 1 : 0;
    }
    return acc;
  }, 1);

  const completed_topics = course.chapters.reduce((acc, row) => {
    for (let r of row.topics) {
      acc += r?.completed ? 1 : 0;
    }
    return acc;
  }, 0);

  const completed_chapters = course.chapters.reduce((acc, row) => {
    let start = 0;
    for (let r of row.topics) {
      start += r?.completed ? 1 : 0;
    }

    if (row.topics.length == start) {
      acc += 1;
    }
    return acc;
  }, 0);

  const correctly_answered_questions = course.chapters.reduce((acc, row) => {
    for (let r of row.topics) {
      if (!r?.questions) continue;
      for (let q of r?.questions) {
        acc += q?.answered ? 1 : 0;
      }
    }
    return acc;
  }, 0);

  return (
    <div>
      <Link href={`/course/${course.id}`}>
        <Card className="p-0 flex flex-col gap-0 cursor-pointer shadow overflow-hidden h-96 ">
          <CardHeader className="p-0  w-full h-56 overflow-hidden">
            <Image
              src={course.thumbnail ?? ""}
              alt="thumbnail"
              className="w-full object-contain"
              width={200}
              height={200}
              objectFit="contain"
              loader={() => course.thumbnail ?? ""}
            />
          </CardHeader>
          <CardContent className="mt-2 mb-2 px-4 h-1/4 py-2">
            <div className=" font-medium">{course.name}</div>
            <div className="text-gray-500 text-sm">
              {course.description ??
                "LLorem ipsum doler sit ametLorem ipsum doler sit ametorem ipsum doler sit amet"}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="px-4 py-0">
            <TooltipProvider>
              <div className="flex justify-between w-full items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex gap-1 items-center">
                      <Book className="w-4 h-4" />
                      {course.chapters.length}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {course.chapters.length} chapters
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex gap-1 items-center">
                      <FileQuestion className="w-4 h-4" />
                      {number_of_questions}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {number_of_questions} quiz questions
                  </TooltipContent>
                </Tooltip>
                <div>
                  <HoverCard>
                    <HoverCardTrigger>
                      <CircularProgressBar
                        percentage={(completed_topics / number_of_topics) * 100}
                        colour={"#1188aa"}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs text-neutral-500">
                      <div className="text-sm mb-2 text-neutral-800">
                        Progress:{" "}
                        {((completed_topics / number_of_topics) * 100).toFixed(
                          0,
                        ) ?? 0}
                        %
                      </div>
                      <div>Completed Chapters: {completed_chapters}</div>
                      <div>Completed Topics: {completed_topics}</div>
                      <div>
                        Correctly Answered Questions:{" "}
                        {correctly_answered_questions}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};

export default CourseCard;
