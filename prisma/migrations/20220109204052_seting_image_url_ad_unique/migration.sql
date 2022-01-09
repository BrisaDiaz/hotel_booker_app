/*
  Warnings:

  - A unique constraint covering the columns `[src]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_src_key" ON "Image"("src");
