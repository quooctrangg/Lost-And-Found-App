-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_postId_fkey";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
