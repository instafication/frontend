/*
  Warnings:

  - You are about to drop the `Scraper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Scraper";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "active" BOOLEAN DEFAULT false,
    "area" TEXT,
    "credits" INTEGER DEFAULT 6,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scraper" (
    "id" TEXT NOT NULL,
    "last_update" BIGINT
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "public"."profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "public"."profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "scraper_id_key" ON "public"."scraper"("id");
