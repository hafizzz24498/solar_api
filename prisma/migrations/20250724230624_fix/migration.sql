/*
  Warnings:

  - Added the required column `priority` to the `MaintenanceTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MaintenanceTasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Installations" ALTER COLUMN "nextMaintenance" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceTasks" ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
