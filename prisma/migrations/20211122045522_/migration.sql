/*
  Warnings:

  - The values [DECLINED,PENDING] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `totalCost` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingRequestStatus" AS ENUM ('PENDING', 'DECLINED');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('ACTIVE', 'CANCELED', 'FINISH');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomId_fkey";

-- DropIndex
DROP INDEX "Client_email_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "totalCost" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GuestsDistribution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "children" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "bookingRequestId" INTEGER,
    "bookingId" INTEGER,

    CONSTRAINT "GuestsDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomModelId" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "nights" INTEGER NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "specifications" TEXT NOT NULL,
    "status" "BookingRequestStatus" NOT NULL DEFAULT E'PENDING',
    "roomId" INTEGER,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToRoom_AB_unique" ON "_BookingToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToRoom_B_index" ON "_BookingToRoom"("B");

-- AddForeignKey
ALTER TABLE "GuestsDistribution" ADD CONSTRAINT "GuestsDistribution_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestsDistribution" ADD CONSTRAINT "GuestsDistribution_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_roomModelId_fkey" FOREIGN KEY ("roomModelId") REFERENCES "RoomModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToRoom" ADD FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToRoom" ADD FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
