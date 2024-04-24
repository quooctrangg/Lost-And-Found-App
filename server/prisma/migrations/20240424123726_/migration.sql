/*
  Warnings:

  - You are about to drop the column `ApprovedByAdminId` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_ApprovedByAdminId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "ApprovedByAdminId",
ADD COLUMN     "approvedByAdminId" INTEGER;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
