-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "credits" INTEGER DEFAULT 15,
    "raw_user_meta_data" JSONB DEFAULT '{}',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    "notificationWithin" TEXT NOT NULL,
    "options" JSONB DEFAULT '{}',

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scraper" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "last_update" BIGINT
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "area" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "public"."profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "public"."profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "services_user_name_key" ON "public"."services"("user", "name");

-- CreateIndex
CREATE UNIQUE INDEX "scraper_id_key" ON "public"."scraper"("id");
