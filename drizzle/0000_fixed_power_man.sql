CREATE TYPE "public"."product_category" AS ENUM('cheesecake', 'bake');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" "product_category" NOT NULL,
	"kicker" text,
	"price_label" text NOT NULL,
	"description" text NOT NULL,
	"image_top_url" text,
	"image_side_url" text,
	"image_three_quarter_url" text,
	"transition_video_url" text,
	"color_from" text,
	"color_to" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_featured_on_wheel" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address_line" text NOT NULL,
	"city" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"google_maps_url" text,
	"is_own_outlet" boolean DEFAULT false NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ugc_videos" (
	"id" text PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"caption" text NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"sound_label" text DEFAULT 'Original audio',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
