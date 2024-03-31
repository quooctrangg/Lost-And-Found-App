/*
  Warnings:

  - You are about to drop the column `email` on the `verifyCodes` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `verifyCodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verifyCodes" DROP COLUMN "email",
ADD COLUMN     "studentId" TEXT NOT NULL;
