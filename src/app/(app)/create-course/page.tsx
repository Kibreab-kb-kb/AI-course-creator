"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingEllipsis from "@/components/loading/ellipsis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { NavStore } from "@/store/layout";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CourseType {
  title: string;
  chapters: string[];
}

export default function Page() {
  const { setHeader } = NavStore((state) => ({
    setHeader: state.setHeader,
  }));
  const [chapters, setChapters] = useState<string[]>(["", "", ""]);
  const { register, watch, handleSubmit, setValue } = useForm<CourseType>();
  const createCourse = trpc.create_course.useMutation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHeader("Create Course");
  }, [setHeader]);

  useEffect(() => {
    setValue("chapters", chapters);
  }, [chapters, setValue]);

  const handleGenerate = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      await createCourse.mutateAsync(data, {
        onSuccess: (data) => {
          if (data.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: data.error,
            });
            setLoading(false);
            return;
          }
          toast({
            variant: "default",
            title: "Course Created",
            description: "Course has been created successfully",
          });

          router.push(`/content/${data.data}`);
          setHeader("Generate Course");
          setLoading(false);
        },
      });
    })();
  };

  return (
    <div className="w-full mt-8 flex justify-center">
      <div className="max-w-lg w-full flex flex-col gap-8">
        <div>
          <span>Title:</span>
          <Input
            {...register("title")}
            disabled={loading}
            className="outline-none focus:border-none shadow-neutral-700/60 focus-visible:ring-0  focus:shadow-md"
          />
        </div>
        <div>
          <span>Chapters</span>
          <div className="flex flex-col gap-4 w-full">
            {chapters.map((_, i) => {
              return (
                <div key={i} className="flex w-full gap-2">
                  <Input
                    disabled={loading}
                    value={chapters[i]}
                    className="outline-none focus:border-none w-11/12 focus-visible:ring-0  focus:shadow-md"
                    onChange={(e) => {
                      setChapters((prev) =>
                        prev.map((chapter, index) => {
                          if (index === i) {
                            return e.target.value;
                          }
                          return chapter;
                        }),
                      );
                    }}
                  />
                  <div className="w-1/12">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setChapters((prev) => {
                          return prev.filter((_, index) => {
                            return index !== i;
                          });
                        });
                      }}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() => {
              setChapters((prev) => {
                return [...prev, ""];
              });
            }}
          >
            Add Chapter
          </Button>
          <Button disabled={loading} onClick={handleGenerate}>
            {loading ? <LoadingEllipsis /> : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
