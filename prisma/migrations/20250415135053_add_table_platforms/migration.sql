/*
  Warnings:

  - You are about to drop the column `platforms` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "platforms",
ADD COLUMN     "platformsId" INTEGER;

-- CreateTable
CREATE TABLE "Platforms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameToPlatforms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platforms_name_key" ON "Platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Platforms_slug_key" ON "Platforms"("slug");

-- CreateIndex
CREATE INDEX "_GameToPlatforms_B_index" ON "_GameToPlatforms"("B");

-- AddForeignKey
ALTER TABLE "_GameToPlatforms" ADD CONSTRAINT "_GameToPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToPlatforms" ADD CONSTRAINT "_GameToPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "Platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
