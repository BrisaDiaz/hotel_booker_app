/*
  Warnings:

  - You are about to drop the column `FreeCancellation` on the `Features` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Features" DROP COLUMN "FreeCancellation",
ADD COLUMN     "freeCancellation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "taxesAndCharges" SET DATA TYPE DOUBLE PRECISION;
