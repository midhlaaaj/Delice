CREATE TYPE "public"."hero_media_type" AS ENUM('none', 'image', 'video');--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"hero_media_type" "hero_media_type" DEFAULT 'none' NOT NULL,
	"hero_desktop_url" text,
	"hero_mobile_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
