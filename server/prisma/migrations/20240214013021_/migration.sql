/*
  Warnings:

  - You are about to drop the column `requestStatusId` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the `requestsStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_requestStatusId_fkey";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "requestStatusId",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "requestsStatus";
