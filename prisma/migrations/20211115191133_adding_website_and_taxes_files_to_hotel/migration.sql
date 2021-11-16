/*
  Warnings:

  - You are about to drop the column `webSite` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `website` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "webSite",
ADD COLUMN     "website" TEXT NOT NULL;
