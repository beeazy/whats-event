DROP TABLE IF EXISTS "city_events";
DROP TABLE IF EXISTS "kb_events";

CREATE TABLE "city_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_details" text,
	"venue" varchar(255),
	"image_url" text,
	"city" varchar(100),
	"date" text,
	"source" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kb_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"date" text,
	"start_date" text,
	"end_date" text,
	"name" text,
	"slug" text,
	"description" text,
	"featured" boolean DEFAULT false,
	"recurring" text,
	"frequency" integer,
	"poster" text,
	"type" integer DEFAULT 0,
	"price" text,
	"ticket_active" boolean DEFAULT false,
	"multiple_ticketing" boolean DEFAULT false,
	"ticketing_url" text,
	"status_id" integer,
	"is_virtual" boolean DEFAULT false,
	"location_id" integer,
	"contact_email" text,
	"contact_phone" text,
	"contact_website" text,
	"contact_address" text,
	"location_name" text,
	"location_slug" text,
	"recur_frequency" text,
	"default_date" text,
	"created_at" timestamp DEFAULT now()
);
