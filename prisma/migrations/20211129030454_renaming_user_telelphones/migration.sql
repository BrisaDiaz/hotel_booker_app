/*
  Warnings:

  - You are about to drop the column `roomId` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `cellularNumber` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `homePhoneNumber` on the `Client` table. All the data in the column will be lost.
  - Added the required column `landlineNumber` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNumber` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingRequest" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "cellularNumber",
DROP COLUMN "homePhoneNumber",
ADD COLUMN     "landlineNumber" TEXT NOT NULL,
ADD COLUMN     "mobileNumber" TEXT NOT NULL;
