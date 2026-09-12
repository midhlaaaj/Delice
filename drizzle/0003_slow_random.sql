CREATE TABLE "media_blobs" (
	"id" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"data_base64" text NOT NULL,
	"file_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
