-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "time" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banUntil" TIMESTAMP(3);
