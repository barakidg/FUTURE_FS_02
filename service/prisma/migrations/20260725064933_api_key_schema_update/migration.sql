/*
  Warnings:

  - You are about to drop the column `userId` on the `apikey` table. All the data in the column will be lost.
  - Added the required column `referenceId` to the `apikey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "apikey" DROP CONSTRAINT "apikey_userId_fkey";

-- AlterTable
ALTER TABLE "apikey" DROP COLUMN "userId",
ADD COLUMN     "configId" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "referenceId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "apikey_referenceId_idx" ON "apikey"("referenceId");

-- CreateIndex
CREATE INDEX "apikey_organizationId_idx" ON "apikey"("organizationId");
