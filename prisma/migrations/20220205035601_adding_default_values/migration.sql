/*
  Warnings:

  - Made the column `description` on table `Hotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BookingRequest" ALTER COLUMN "children" DROP NOT NULL,
ALTER COLUMN "children" SET DEFAULT 0,
ALTER COLUMN "adults" DROP NOT NULL,
ALTER COLUMN "adults" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "CancellationDetails" ALTER COLUMN "cancellationFee" DROP NOT NULL,
ALTER COLUMN "cancellationFee" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "landlineNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GuestsDistribution" ALTER COLUMN "children" DROP NOT NULL,
ALTER COLUMN "children" SET DEFAULT 0,
ALTER COLUMN "adults" DROP NOT NULL,
ALTER COLUMN "adults" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "lowestPrice" DROP NOT NULL,
ALTER COLUMN "lowestPrice" SET DEFAULT 0,
ALTER COLUMN "taxesAndCharges" DROP NOT NULL,
ALTER COLUMN "taxesAndCharges" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "public" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "RoomBed" ALTER COLUMN "quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RoomModel" ALTER COLUMN "lowestPrice" DROP NOT NULL,
ALTER COLUMN "public" DROP NOT NULL,
ALTER COLUMN "taxesAndCharges" DROP NOT NULL,
ALTER COLUMN "cancellationFee" DROP NOT NULL;
