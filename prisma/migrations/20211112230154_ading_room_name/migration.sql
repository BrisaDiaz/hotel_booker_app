/*
  Warnings:

  - You are about to drop the column `children` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `children` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RoomModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "children",
ADD COLUMN     "children" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoomModel" ADD COLUMN     "name" TEXT NOT NULL;
