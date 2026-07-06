CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"puppy_id" text,
	"puppy_name" text NOT NULL,
	"name" text,
	"city" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
