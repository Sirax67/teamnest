CREATE TABLE "personnel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"avatar" varchar(500),
	"name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	"summary" text NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"contact" varchar(255) NOT NULL,
	"category_id" varchar(255) NOT NULL,
	"specialties_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personnel_specialties" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_category_id_personnel_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."personnel_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_specialties_id_personnel_specialties_id_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."personnel_specialties"("id") ON DELETE no action ON UPDATE no action;