/*
  Warnings:

  - You are about to drop the column `postStatusId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `verifyStatusId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `postsStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verifiesStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_postStatusId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_verifyStatusId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "postStatusId",
DROP COLUMN "verifyStatusId",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendProtection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verify" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "isDelete" SET DEFAULT false;

-- DropTable
DROP TABLE "postsStatus";

-- DropTable
DROP TABLE "verifiesStatus";
