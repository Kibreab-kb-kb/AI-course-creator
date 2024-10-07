import { SelectChapter, SelectCourse, SelectTopic } from "@schema/course";
import { z } from "zod";
import { StateCreator } from "zustand";

type Course = Omit<
  z.infer<typeof SelectCourse>,
  "createdAt" | "updatedAt" | "name" | "userId"
>;
type Chapter = Omit<
  z.infer<typeof SelectChapter>,
  "createdAt" | "courseId" | "updatedAt"
>;
type Topic = Omit<
  z.infer<typeof SelectTopic>,
  "chapterId" | "createdAt" | "updatedAt" | "youtubeSearchQuery"
> & {
  youtube_search_query: string;
};

type FullCourse = Course & {
  chapters: (Chapter & { topics: Topic[] })[];
};

export interface ChapterSlice {
  course: FullCourse | null;
  currentChapter: (Chapter & { topics: Topic[] }) | null;
  currentTopic: Topic | null;
  setCourse: (course: FullCourse) => void;
  setCurrentChapter: (id: string) => void;
    setCurrentTopic: (id: string) => void;
}
export const createChapterSlice: StateCreator<ChapterSlice> = (set, get) => ({
  course: null,
  currentChapter: null,
  currentTopic: null,
  setCourse: (course) => {
    set({ course });
  },
  setCurrentChapter: (id: string) => {
    const course = get().course;
    if (!course) return;
    const chapter = course.chapters.find((chapter) => chapter.id === id);
    set({ currentChapter: chapter });
  },
  setCurrentTopic: (id: string) => {
    const currentChapter = get().currentChapter;
    if (!currentChapter) return;
    const topic = currentChapter.topics.find((topic) => topic.id === id);
    set({ currentTopic: topic });
  },
});
