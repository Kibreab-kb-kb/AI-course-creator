import { sql, relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { user } from "./user";

export const course = pgTable("courses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  thumbnail: text("thumbnail"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
});

export const courseRelations = relations(course, ({ many }) => ({
  chapters: many(chapter),
}));

export const chapter = pgTable("chapters", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title"),
  objective: text("objective"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  courseId: uuid("course_id").references(() => course.id),
});

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
  topics: many(topic),
}));

export const topic = pgTable("topics", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  youtubeSearchQuery: text("youtube_search_query"),
  videoUrl: text("video_url"),
  summary: text("summary"),
  completed: timestamp("completed"),
  started: timestamp("started"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  chapterId: uuid("chapter_id").references(() => chapter.id),
});

export const topicRelations = relations(topic, ({ one, many }) => ({
  chapter: one(chapter, {
    fields: [topic.chapterId],
    references: [chapter.id],
  }),
  questions: many(question),
}));

export const question = pgTable("questions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  answered: timestamp("answered"),
  attempted: timestamp("attempted"),
  options: jsonb("options").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  topicId: uuid("topic_id")
    .references(() => topic.id)
    .notNull(),
});

export const questionRelations = relations(question, ({ one }) => ({
  topic: one(topic, {
    fields: [question.topicId],
    references: [topic.id],
  }),
}));

export const SelectCourse = createSelectSchema(course);
export const InsertCourse = createInsertSchema(course);

export const SelectChapter = createSelectSchema(chapter);
export const InsertChapter = createInsertSchema(chapter);

export const SelectTopic = createSelectSchema(topic);
export const InsertTopic = createInsertSchema(topic);

export const SelectQuestion = createSelectSchema(question);
export const InsertQuestion = createInsertSchema(question);
