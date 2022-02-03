/*
  Warnings:

  - The values [FINISH] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `cancellationDetailsId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cancellationFee` to the `RoomModel` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "Booking" ADD COLUMN     "cancellationDetailsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomModel" ADD COLUMN     "cancellationFee" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "CancellationDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "cancellationFee" DOUBLE PRECISION NOT NULL,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "CancellationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CancellationDetails_bookingId_key" ON "CancellationDetails"("bookingId");

-- AddForeignKey
ALTER TABLE "CancellationDetails" ADD CONSTRAINT "CancellationDetails_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
