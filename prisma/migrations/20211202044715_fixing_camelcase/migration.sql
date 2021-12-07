/*
  Warnings:

  - You are about to drop the column `roomId` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BookingRequestStatus" ADD VALUE 'ACEPTED';

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "roomId";
