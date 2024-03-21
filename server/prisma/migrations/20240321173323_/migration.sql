/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
