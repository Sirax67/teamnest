CREATE TYPE "public"."stage_enum" AS ENUM('Идея', 'Разработка', 'Запуск');--> statement-breakpoint
ALTER TABLE "startups_stages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "startups_stages" CASCADE;--> statement-breakpoint
ALTER TABLE "startups" DROP CONSTRAINT "startups_stage_id_startups_stages_id_fk";
--> statement-breakpoint
ALTER TABLE "startups" ADD COLUMN "stage" "stage_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "startups" DROP COLUMN "startup_stage";--> statement-breakpoint
ALTER TABLE "startups" DROP COLUMN "stage_id";