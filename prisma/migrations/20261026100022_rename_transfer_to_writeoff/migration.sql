/*
  Warnings:

  - The values [TRANSFER_OUT] on the enum `MovementReason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovementReason_new" AS ENUM ('PURCHASE', 'RETURN_FROM_CUSTOMER', 'FOUND', 'SALE', 'DAMAGE', 'LOSS', 'WRITE_OFF', 'AUDIT_CORRECTION');
ALTER TABLE "StockMovement" ALTER COLUMN "reason" TYPE "MovementReason_new" USING ("reason"::text::"MovementReason_new");
ALTER TYPE "MovementReason" RENAME TO "MovementReason_old";
ALTER TYPE "MovementReason_new" RENAME TO "MovementReason";
DROP TYPE "public"."MovementReason_old";
COMMIT;
