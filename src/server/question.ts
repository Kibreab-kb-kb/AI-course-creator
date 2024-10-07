import { z } from "zod";
import { protectedProcedure, router } from "./trpc";
import { question, topic } from "@schema/course";
import { eq, inArray } from "drizzle-orm";

export const questionRouter = router({
  get_questions: protectedProcedure
    .input(
      z.object({
        topic_id: z.string(),
      }),
    )
    .output(
      z.array(
        z.object({
          id: z.string().uuid(),
          question: z.string(),
          answer: z.string(),
          options: z.array(z.string()),
        }),
      ),
    )
    .query(async ({ ctx: { db }, ...opts }) => {
      try {
        const topic_id = opts.input.topic_id;

        await db
          .update(topic)
          .set({
            started: new Date(),
          })
          .where(eq(topic.id, topic_id));

        const questions = await db
          .select()
          .from(question)
          .where(eq(question.topicId, topic_id));

        return questions.map((q) => ({
          ...q,
          options: JSON.parse(q.options as string) as string[],
        }));
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),

  answer_question: protectedProcedure
    .input(
      z.object({
        answered: z.array(z.string()),
        completed: z.boolean(),
      }),
    )
    .output(z.boolean())
    .mutation(async ({ ctx: { db }, ...opts }) => {
      try {
        const questions = await db
          .update(question)
          .set({
            answered: new Date(),
          })
          .where(inArray(question.id, opts.input.answered))
          .returning();

        // Set attempted questions
        await db
          .update(question)
          .set({
            attempted: new Date(),
          })
          .where(eq(question.topicId, questions?.[0].topicId));

        if (opts.input.completed) {
          await db
            .update(topic)
            .set({
              completed: new Date(),
            })
            .where(eq(topic.id, questions?.[0].topicId))
            .returning();
        }
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }),
});
