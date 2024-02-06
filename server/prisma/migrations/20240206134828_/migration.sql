/*
  Warnings:

  - You are about to drop the column `typeId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_typeId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_conversationId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "typeId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "conversationId";

-- DropTable
DROP TABLE "types";

-- CreateTable
CREATE TABLE "_ConversationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationToUser_AB_unique" ON "_ConversationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationToUser_B_index" ON "_ConversationToUser"("B");

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
