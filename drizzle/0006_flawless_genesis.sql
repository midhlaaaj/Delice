CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text DEFAULT 'Journal' NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"author" text DEFAULT 'Team Delice' NOT NULL,
	"read_minutes" integer DEFAULT 4 NOT NULL,
	"cover_image_url" text,
	"color_from" text,
	"color_to" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
