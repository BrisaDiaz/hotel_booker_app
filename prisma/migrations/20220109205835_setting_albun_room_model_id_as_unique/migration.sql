/*
  Warnings:

  - A unique constraint covering the columns `[roomModelId]` on the table `Albun` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Albun_roomModelId_key" ON "Albun"("roomModelId");
