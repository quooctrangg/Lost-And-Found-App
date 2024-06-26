/*
  Warnings:

  - Made the column `userId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "approvedByAdminId" INTEGER,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
