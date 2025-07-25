-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT NOT NULL,
    "installDate" TIMESTAMP(3) NOT NULL,
    "lastCleanDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installations" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "panels" INTEGER NOT NULL,
    "capacityKW" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "nextMaintenance" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceTasks" (
    "id" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "customerId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,

    CONSTRAINT "MaintenanceTasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installations" ADD CONSTRAINT "Installations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTasks" ADD CONSTRAINT "MaintenanceTasks_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTasks" ADD CONSTRAINT "MaintenanceTasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
