/*
  Warnings:

  - The values [ACEPTED] on the enum `BookingRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingRequestStatus_new" AS ENUM ('PENDING', 'DECLINED', 'ACCEPTED');
ALTER TABLE "BookingRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BookingRequest" ALTER COLUMN "status" TYPE "BookingRequestStatus_new" USING ("status"::text::"BookingRequestStatus_new");
ALTER TYPE "BookingRequestStatus" RENAME TO "BookingRequestStatus_old";
ALTER TYPE "BookingRequestStatus_new" RENAME TO "BookingRequestStatus";
DROP TYPE "BookingRequestStatus_old";
ALTER TABLE "BookingRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
