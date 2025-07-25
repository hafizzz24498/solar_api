/*
  Warnings:

  - You are about to drop the column `installDate` on the `Customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "installDate",
ALTER COLUMN "lastCleanDate" DROP NOT NULL;
