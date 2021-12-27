/*
  Warnings:

  - The values [FINISH] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `cancelationDetailsId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cancelationFee` to the `RoomModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('ACTIVE', 'CANCELED', 'FINISHED');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelationDetailsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomModel" ADD COLUMN     "cancelationFee" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "CancelationDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "cancelationFee" DOUBLE PRECISION NOT NULL,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "CancelationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CancelationDetails_bookingId_key" ON "CancelationDetails"("bookingId");

-- AddForeignKey
ALTER TABLE "CancelationDetails" ADD CONSTRAINT "CancelationDetails_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
