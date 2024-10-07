ALTER TABLE "questions" ADD COLUMN "answered" timestamp;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "completed" timestamp;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "started" timestamp;