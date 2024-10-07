"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CourseStore } from "@/store/course";
import { ToastAction } from "@radix-ui/react-toast";
import clsx from "clsx";
import { useState } from "react";

const Question = () => {
  const { currentTopic, currentChapter, setCurrentTopic, setCurrentChapter } =
    CourseStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answer_question = trpc.answer_question.useMutation();
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  if (!currentTopic) return null;

  const get_questions = trpc.get_questions.useQuery({
    topic_id: currentTopic.id,
  });

  if (get_questions.isPending) {
    return <div>Loading...</div>;
  }

  if (get_questions.isError) {
    return <div>Something went wrong</div>;
  }

  const questions = get_questions.data;

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

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        variant: "destructive",
        title: "Please complete the quiz",
      });
      return;
    }

    const correctAnswers: string[] = [];
    Object.entries(answers).forEach(([q, a], i) => {
      const question = questions.find((qu) => qu.id == q);
      if (a == question?.answer) {
        correctAnswers.push(q);
        setCorrect((prev) => ({
          ...prev,
          [q]: true,
        }));
      } else {
        setCorrect((prev) => ({
          ...prev,
          [q]: false,
        }));
      }
    });
    console.log("Correct Answers", correctAnswers);

    const success = await answer_question.mutateAsync({
      answered: [...correctAnswers],
      completed: correctAnswers.length === questions.length,
    });

    if (success && correctAnswers.length === questions.length) {
      toast({
        variant: "default",
        title: "Passed",
        description: "You have passed the quiz",
        action: (
          <ToastAction
            altText="Continue"
            onClick={() => {
              if (nextTopic) {
                setCurrentTopic(nextTopic.id);
              }
            }}
          >
            Continue
          </ToastAction>
        ),
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-scroll pr-2 h-full w-full pb-10">
      {questions.map((q, i) => {
        return (
          <div key={q.id}>
            <div className="flex gap-1">
              <span className="font-medium text-lg">{i + 1}. </span>
              <span className="font-medium text-lg">{q.question}</span>
            </div>
            <div className="flex mt-2 flex-col gap-1">
              {q.options.map((o) => {
                return (
                  <div key={o} className={clsx(" flex ")}>
                    <div className="w-4 h-1"></div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setAnswers((prev) => {
                          return {
                            ...prev,
                            [q.id]: o,
                          };
                        });
                      }}
                      className={clsx(
                        "bg-gray-100 flex hover:bg-gray-200 justify-start p-2 items-center rounded  w-full",
                        {
                          "bg-gray-600 hover:bg-gray-600 text-white hover:text-white":
                            answers[q.id] === o,
                          "bg-red-400 text-white":
                            correct[q.id] === false && answers[q.id] === o,
                          "bg-primary text-white":
                            correct[q.id] && answers[q.id] === o,
                        },
                      )}
                    >
                      {o}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex gap-4 w-full justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setAnswers({});
            setCorrect({});
          }}
          disabled={Object.keys(correct).length !== Object.keys(answers).length}
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(correct).length === Object.keys(answers).length}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Question;
