import { create } from "zustand";
import { FetchingSlice, createFetchingSlice } from "./fetching.slice";
import { ChapterSlice, createChapterSlice } from "./chapter.slice";

interface CourseStoreType extends FetchingSlice, ChapterSlice {}

export const CourseStore = create<CourseStoreType>((...args) => ({
  ...createFetchingSlice(...args),
  ...createChapterSlice(...args),
}));
