/*
  Warnings:

  - Added the required column `email` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxesAndCharges` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webSite` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "taxesAndCharges" INTEGER NOT NULL,
ADD COLUMN     "webSite" TEXT NOT NULL;
