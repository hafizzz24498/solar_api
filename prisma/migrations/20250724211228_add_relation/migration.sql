/*
  Warnings:

  - Added the required column `technicianId` to the `Installations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Installations" ADD COLUMN     "technicianId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Installations" ADD CONSTRAINT "Installations_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
