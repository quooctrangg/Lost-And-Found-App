/*
  Warnings:

  - You are about to drop the column `sendProtection` on the `posts` table. All the data in the column will be lost.
  - The `done` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "sendProtection",
DROP COLUMN "done",
ADD COLUMN     "done" INTEGER NOT NULL DEFAULT 0;
