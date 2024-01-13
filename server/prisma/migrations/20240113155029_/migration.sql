-- CreateTable
CREATE TABLE "searchHistorys" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "searchHistorys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "searchHistorys" ADD CONSTRAINT "searchHistorys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
