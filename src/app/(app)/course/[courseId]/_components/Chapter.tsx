import { Button } from "@/components/ui/button";
import { CourseStore } from "@/store/course";

export const Chapter = () => {
  const { currentChapter, setCurrentTopic } = CourseStore();
  return (
    <div className="w-full h-full flex gap-12 flex-col">
      <span className="text-2xl font-medium">{currentChapter?.title}</span>
      <div>{currentChapter?.description}</div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-xl">Objective</span>
        <span>{currentChapter?.objective}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-xl mb-4">Content</span>
        <span className="flex gap-8">
          <div className="w-2 h-full"></div>

          <ul className="list-disc gap-4 flex flex-col">
            {currentChapter?.topics.map((topic) => {
              return <li key={topic.title}>{topic.title}</li>;
            })}
          </ul>
        </span>
      </div>
      <div className="w-full mt-8 flex justify-center">
        <Button
          onClick={() => {
            if (currentChapter?.topics?.[0]?.id)
              setCurrentTopic(currentChapter?.topics?.[0]?.id);
          }}
          className="w-40"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default Chapter;
