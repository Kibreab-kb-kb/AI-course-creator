import { z } from "zod";
import { protectedProcedure, router } from "./trpc";
import { strict_output } from "@/lib/openai";
import { getUnsplashImage } from "@/lib/unsplash";
import { SelectCourse, chapter, course, question, topic } from "@schema/course";
import { eq, sql } from "drizzle-orm";
import { warn } from "console";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";

export interface Chapter {
  title: string;
  description: string;
  objective: string;
  topics: Topic[];
}

export interface Topic {
  title: string;
  youtube_search_query: string;
}

export const courseRouter = router({
  create_course: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        chapters: z.array(z.string()),
      }),
    )
    .output(
      z.object({
        data: z.string().nullable(),
        error: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx: { db, user }, ...opts }) => {
      try {
        const { title, chapters } = opts.input;

        let image_search = await strict_output(
          "You are responsible for generating an image search term for a given course and also a good descripttion for that course",
          `Give me a very suitable image search term and general descriptions for the course name: ${title}. Make sure the search term perfectly describes the course below so that it can be used to fetch an image from unsplash using it. And that the description is respresentative of the course`,
          {
            search_term: "search term for the course. It's a string",
            description: "good short description for the course",
          },
        );

        const thumbnail = await getUnsplashImage(image_search.search_term);

        let output: Chapter[] = await strict_output(
          "You are responsible for generating a list of possible topics for a course given the chapter. You will also generate accurate youtube search queries for each",
          chapters.map((chapter) => {
            return `Create a course on ${chapter}. Include a brief description of the chapter along with the objectives of the chapter. Include a list of topics in the chapter. Include a list of youtube search queries for the chapter and provide relevant youtube search queries that can be used to search education youtube videos.`;
          }),
          {
            title: "title of the chapter. It's a string",
            description: "description of the chapter. It's a string",
            objective: "objectives of the chapter. It's a string",
            topics:
              "array of topics in the chapter. Each topic includes a relevant youtube search query. Each topic is an object with the following keys: title, youtube_search_query.",
          },
          "gpt-4o",
        );

        if (!output.length) throw new Error("Error generating course content");

        const course_id: string = await db.transaction(async (tx) => {
          const createdCourse = await tx
            .insert(course)
            .values({
              name: title,
              thumbnail: thumbnail,
              userId: user.id,
            })
            .returning();

          const createdChapters = await tx
            .insert(chapter)
            .values(
              output.map((ch) => ({
                title: ch.title,
                objective: ch.objective,
                description: ch.description,
                courseId: createdCourse?.[0].id,
              })),
            )
            .returning();

          for (const outputChapter of output) {
            await tx
              .insert(topic)
              .values(
                outputChapter.topics.map((topic) => ({
                  title: topic.title,
                  youtubeSearchQuery: topic.youtube_search_query,
                  chapterId: createdChapters.find(
                    (chapter) => chapter.title === outputChapter.title,
                  )?.id,
                })),
              )
              .returning();
          }

          return createdCourse?.[0].id;
        });

        return { data: course_id, error: null };
      } catch (e) {
        console.error(e instanceof Error ? e.message : e);
        return {
          data: null,
          error: e instanceof Error ? e.message : "An error occurred",
        };
      }
    }),
  get_course: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(
      z.object({
        data: z
          .object({
            id: z.string(),
            title: z.string(),
            thumbnail: z.string(),
            chapters: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                objective: z.string(),
                topics: z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    videoUrl: z.string().nullable(),
                    youtube_search_query: z.string(),
                    summary: z.string().nullable(),
                  }),
                ),
              }),
            ),
          })
          .nullable(),
        error: z.string().nullable(),
      }),
    )
    .query(async ({ ctx: { db }, ...opts }) => {
      try {
        const course_id = opts.input;

        const fetched_course = await db
          .select()
          .from(course)
          .where(eq(course.id, course_id.id))
          .innerJoin(chapter, eq(course.id, chapter.courseId))
          .innerJoin(topic, eq(chapter.id, topic.chapterId));

        const course_data = fetched_course.reduce((acc, row) => {
          acc["id"] = row.courses.id;
          acc["title"] = row.courses.name;
          acc["thumbnail"] = row.courses.thumbnail;
          if (!acc["chapters"]) {
            acc["chapters"] = [];
          }

          const chapter_data = acc["chapters"].find(
            (chapter: any) => chapter.id === row.chapters.id,
          );
          if (chapter_data) {
            chapter_data.topics.push({
              id: row.topics.id,
              title: row.topics.title,
              videoUrl: row.topics.videoUrl,
              youtube_search_query: row.topics.youtubeSearchQuery,
              summary: row.topics.summary,
            });
          } else {
            acc["chapters"].push({
              id: row.chapters.id,
              title: row.chapters.title,
              description: row.chapters.description,
              objective: row.chapters.objective,
              topics: [
                {
                  id: row.topics.id,
                  videoUrl: row.topics.videoUrl,
                  title: row.topics.title,
                  youtube_search_query: row.topics.youtubeSearchQuery,
                  summary: row.topics.summary,
                },
              ],
            });
          }

          return acc;
        }, {} as any);

        return {
          data: course_data,
          error: null,
        };
      } catch (e) {
        console.error(e);
        return {
          data: null,
          error: e instanceof Error ? e.message : "An error occurred",
        };
      }
    }),

  get_info: protectedProcedure
    .input(
      z.object({
        topic_id: z.string(),
      }),
    )
    .output(
      z.object({
        data: z.boolean(),
        error: z.string().nullable(),
      }),
    )
    .query(async ({ ctx: { db }, ...opts }) => {
      try {
        const topic_id = opts.input.topic_id;

        const topic_data = await db
          .select()
          .from(topic)
          .where(eq(topic.id, topic_id));

        if (!topic_data.length) {
          return {
            data: false,
            error: "Topic not found",
          };
        }

        const youtube_video = await searchYoutube(
          topic_data?.[0].youtubeSearchQuery ?? topic_data?.[0].title,
        );

        const transcript = await getTranscript(youtube_video);

        const shortened_transcript = transcript
          .split(" ")
          .slice(0, 100)
          .join(" ");

        const summary: { summary: string } = await strict_output(
          "You are an AI capable of summarising a youtube transcript",
          "summarise in 50 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
            shortened_transcript,
          { summary: "summary of the transcript" },
        );

        const questions = await getQuestionsFromTranscript(
          transcript,
          topic_data?.[0].title,
        );

        await db.insert(question).values(
          questions.map((question) => {
            let options = [
              question.option1,
              question.option2,
              question.option3,
              question.answer,
            ];

            options.sort(() => Math.random() - 0.5);
            return {
              question: question.question,
              answer: question.answer,
              topicId: topic_id,
              options: JSON.stringify(options),
            };
          }),
        );

        await db
          .update(topic)
          .set({
            videoUrl: youtube_video,
            summary: summary.summary,
          })
          .where(eq(topic.id, topic_id));

        return {
          data: true,
          error: null,
        };
      } catch (e) {
        warn(e);
        return {
          data: false,
          error: e instanceof Error ? e.message : "An error occurred",
        };
      }
    }),

  get_all_courses: protectedProcedure
    .output(
      z.array(
        SelectCourse.merge(
          z.object({
            chapters: z.array(
              z
                .object({
                  id: z.string(),
                })
                .merge(
                  z.object({
                    topics: z.array(
                      z
                        .object({
                          id: z.string(),
                          started: z.date().nullable(),
                          completed: z.date().nullable(),
                        })
                        .merge(
                          z.object({
                            questions: z
                              .array(
                                z.object({
                                  id: z.string(),
                                  answered: z.date().nullable(),
                                }),
                              )
                              .optional(),
                          }),
                        )
                        .optional(),
                    ),
                  }),
                ),
            ),
          }),
        ),
      ),
    )
    .query(async ({ ctx: { db, user } }) => {
      try {
        const courses = await db.query.course.findMany({
          where: eq(course.userId, user.id),
          with: {
            chapters: {
              columns: {
                id: true,
              },
              with: {
                topics: {
                  columns: {
                    id: true,
                    started: true,
                    completed: true,
                  },
                  with: {
                    questions: {
                      columns: {
                        id: true,
                        answered: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return courses;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
