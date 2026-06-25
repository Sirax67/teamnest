CREATE TYPE "public"."user_roles" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"contentType" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "startups" ADD COLUMN "logo" varchar(500) DEFAULT '/images/default-logo.png';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_roles" DEFAULT 'USER' NOT NULL;