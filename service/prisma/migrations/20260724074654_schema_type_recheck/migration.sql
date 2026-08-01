/*
  Warnings:

  - The values [OWNER] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `apikey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `autoEmailOnConvert` on the `organization` table. All the data in the column will be lost.
  - The `status` column on the `organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `apikey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `slug` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('ADMIN', 'SUPPORT');
ALTER TABLE "member" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "public"."MemberRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "apikey" DROP CONSTRAINT "apikey_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "apikey_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "member" DROP CONSTRAINT "member_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "member_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "autoEmailOnConvert",
ALTER COLUMN "slug" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE';
