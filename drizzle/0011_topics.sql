ALTER TABLE "topics" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "video_url" text;
