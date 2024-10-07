import { and, eq } from "drizzle-orm";
import { startOfWeek, startOfYear, startOfMonth, startOfDay } from "date-fns";
import { protectedProcedure, router } from "./trpc";
import { course } from "@schema/course";
import { z } from "zod";
type DateCategory = "month" | "week" | "year" | "all" | "day";
function getStartDate(category: DateCategory): Date | undefined {
  const today = new Date(); // Today's date

  switch (category) {
    case "day":
      return startOfDay(today);
    case "week":
      return startOfWeek(today, { weekStartsOn: 1 }); // Assumes week starts on Monday
    case "month":
      return startOfMonth(today);
    case "year":
      return startOfYear(today);
    case "all":
      return undefined; // Returning the account creation date directly
    default:
      return undefined; // In case of an invalid category
  }
}

export const analyticsRouter = router({
  getSimpleData: protectedProcedure
    .input(
      z
        .object({
          time: z.enum(["week", "month", "year", "all", "day"]),
        })
        .optional(),
    )
    .output(
      z.object({
        courses_generated: z.number(),
        chapters_completed: z.number(),
        questions_attempted: z.number(),
        questions_correctly_answered: z.number(),
      }),
    )
    .query(async ({ ctx: { user, db }, ...opts }) => {
      const startDate = getStartDate(opts.input?.time ?? "all");
      const courses = await db.query.course.findMany({
        where: eq(course.userId, user.id),
        with: {
          chapters: {
            columns: {
              id: true,
              updatedAt: true,
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
                      attempted: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const courses_generated = courses.reduce((acc, row) => {
        if (startDate) {
          acc += row.updatedAt >= startDate ? 1 : 0;
        } else {
          acc += 1;
        }

        return acc;
      }, 0);

      const {
        chapters_completed,
        questions_attempted,
        questions_correctly_answered,
      } = courses.reduce(
        (acc, row) => {
          row.chapters.forEach((ch) => {
            let topics_completed = 0;
            ch.topics.forEach((t) => {
              if (startDate && t.completed) {
                topics_completed += t.completed >= startDate ? 1 : 0;
              } else {
                topics_completed += t.completed ? 1 : 0;
              }
              t.questions.forEach((q) => {
                if (q.attempted) {
                  if (startDate) {
                    acc.questions_attempted += q.attempted >= startDate ? 1 : 0;
                  } else {
                    acc.questions_attempted += 1;
                  }
                }
                if (q.answered) {
                  if (startDate) {
                    acc.questions_correctly_answered +=
                      q.answered >= startDate ? 1 : 0;
                  } else {
                    acc.questions_correctly_answered += 1;
                  }
                }
              });
            });

            if ((topics_completed = ch.topics.length))
              acc.chapters_completed += 1;
          });
          return acc;
        },
        {
          chapters_completed: 0,
          questions_attempted: 0,
          questions_correctly_answered: 0,
        },
      );

      return {
        courses_generated,
        chapters_completed,
        questions_attempted,
        questions_correctly_answered,
      };
    }),
});
