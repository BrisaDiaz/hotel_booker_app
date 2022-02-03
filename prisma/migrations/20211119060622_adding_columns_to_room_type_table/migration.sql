/*
  Warnings:

  - Added the required column `smocking` to the `RoomModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxesAndCharges` to the `RoomModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomModel" ADD COLUMN     "smocking" BOOLEAN NOT NULL,
ADD COLUMN     "taxesAndCharges" DOUBLE PRECISION NOT NULL;
