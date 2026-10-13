-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "contactPerson" TEXT,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 7,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplier_userId_idx" ON "Supplier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_userId_name_key" ON "Supplier"("userId", "name");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
