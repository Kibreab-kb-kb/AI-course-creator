CREATE TABLE IF NOT EXISTS "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"youtube_search_query" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"chapter_id" uuid
);
--> statement-breakpoint
ALTER TABLE "chapters" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "objective" text;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "description" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topics" ADD CONSTRAINT "topics_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
