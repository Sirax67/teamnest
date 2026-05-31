ALTER TABLE "personnel" ALTER COLUMN "avatar" SET DEFAULT '/images/default-avatar.png';--> statement-breakpoint
ALTER TABLE "personnel" ALTER COLUMN "city" SET DATA TYPE varchar(168);--> statement-breakpoint
ALTER TABLE "personnel" ALTER COLUMN "period" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "startups" ALTER COLUMN "stage" SET DEFAULT 'Идея';--> statement-breakpoint
ALTER TABLE "personnel_specialties" ADD COLUMN "category_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "personnel_specialties" ADD CONSTRAINT "personnel_specialties_category_id_personnel_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."personnel_category"("id") ON DELETE no action ON UPDATE no action;