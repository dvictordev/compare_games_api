/*
  Warnings:

  - You are about to drop the `Platforms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToPlatforms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GameToPlatforms" DROP CONSTRAINT "_GameToPlatforms_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToPlatforms" DROP CONSTRAINT "_GameToPlatforms_B_fkey";

-- DropTable
DROP TABLE "Platforms";

-- DropTable
DROP TABLE "_GameToPlatforms";

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlatform" (
    "gameId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,

    CONSTRAINT "GamePlatform_pkey" PRIMARY KEY ("gameId","platformId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_slug_key" ON "Platform"("slug");

-- AddForeignKey
ALTER TABLE "GamePlatform" ADD CONSTRAINT "GamePlatform_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlatform" ADD CONSTRAINT "GamePlatform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
