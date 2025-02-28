-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en_US', 'ru', 'uk', 'pl');

-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "language" "Language" NOT NULL DEFAULT 'en_US'; 