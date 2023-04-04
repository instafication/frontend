/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN DEFAULT false,
ADD COLUMN     "area" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credits" INTEGER DEFAULT 6,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "uuid" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Scraper" (
    "id" TEXT NOT NULL,
    "last_update" BIGINT
);

-- CreateIndex
CREATE UNIQUE INDEX "Scraper_id_key" ON "Scraper"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
