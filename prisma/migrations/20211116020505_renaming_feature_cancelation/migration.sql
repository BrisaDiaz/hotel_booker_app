/*
  Warnings:

  - You are about to drop the column `cancelationFree` on the `Features` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Features" DROP COLUMN "cancelationFree",
ADD COLUMN     "freeCancelation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "taxesAndCharges" SET DATA TYPE DOUBLE PRECISION;
