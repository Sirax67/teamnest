CREATE TABLE "startups" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"startup_stage" varchar NOT NULL,
	"link" varchar NOT NULL,
	"start_date" date NOT NULL,
	"sector_id" varchar(255) NOT NULL,
	"stage_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "startups_sectors" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "startups_stages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "personnel" ADD COLUMN "period" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "personnel" ADD COLUMN "institution" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "personnel" ADD COLUMN "faculty" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "startups" ADD CONSTRAINT "startups_sector_id_startups_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."startups_sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "startups" ADD CONSTRAINT "startups_stage_id_startups_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."startups_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "personnel" DROP COLUMN "education";