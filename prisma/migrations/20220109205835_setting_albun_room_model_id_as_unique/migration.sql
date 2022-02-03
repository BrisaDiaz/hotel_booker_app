/*
  Warnings:

  - A unique constraint covering the columns `[roomModelId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Album_roomModelId_key" ON "Album"("roomModelId");
