/*
  Warnings:

  - You are about to drop the column `approvedByAdminId` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_approvedByAdminId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "approvedByAdminId",
ADD COLUMN     "ApprovedByAdminId" INTEGER;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_ApprovedByAdminId_fkey" FOREIGN KEY ("ApprovedByAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
