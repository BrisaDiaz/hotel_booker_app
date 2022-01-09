/*
  Warnings:

  - You are about to drop the column `hotelId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `roomModelId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `albunId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "hotelId",
DROP COLUMN "roomModelId",
ADD COLUMN     "albunId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Albun" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hotelId" INTEGER NOT NULL,
    "roomModelId" INTEGER,

    CONSTRAINT "Albun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albunId_fkey" FOREIGN KEY ("albunId") REFERENCES "Albun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
