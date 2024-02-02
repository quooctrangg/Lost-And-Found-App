/*
  Warnings:

  - Added the required column `symbol` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "symbol" TEXT NOT NULL;
