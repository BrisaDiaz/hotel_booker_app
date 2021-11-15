/*
  Warnings:

  - You are about to drop the column `email` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `featuresId` on the `Hotel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hotelId]` on the table `Features` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_featuresId_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "email",
DROP COLUMN "featuresId";

-- CreateIndex
CREATE UNIQUE INDEX "Features_hotelId_key" ON "Features"("hotelId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
