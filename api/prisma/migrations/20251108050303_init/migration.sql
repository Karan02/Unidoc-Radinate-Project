/*
  Warnings:

  - You are about to drop the column `gt_confidence` on the `GroundTruth` table. All the data in the column will be lost.
  - You are about to drop the column `gt_label` on the `GroundTruth` table. All the data in the column will be lost.
  - You are about to drop the column `gt_source` on the `GroundTruth` table. All the data in the column will be lost.
  - You are about to drop the column `study_uid` on the `GroundTruth` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp_gt` on the `GroundTruth` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Study` table. All the data in the column will be lost.
  - You are about to drop the `AiOutput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetricTimeSeries` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[study_id,finding]` on the table `GroundTruth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `finding` to the `GroundTruth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `study_id` to the `GroundTruth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiOutput" DROP CONSTRAINT "AiOutput_study_uid_fkey";

-- DropForeignKey
ALTER TABLE "GroundTruth" DROP CONSTRAINT "GroundTruth_study_uid_fkey";

-- AlterTable
ALTER TABLE "GroundTruth" DROP COLUMN "gt_confidence",
DROP COLUMN "gt_label",
DROP COLUMN "gt_source",
DROP COLUMN "study_uid",
DROP COLUMN "timestamp_gt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finding" TEXT NOT NULL,
ADD COLUMN     "study_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Study" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AiOutput";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "MetricTimeSeries";

-- CreateTable
CREATE TABLE "AIOutput" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "finding" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIOutput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIOutput_study_id_finding_key" ON "AIOutput"("study_id", "finding");

-- CreateIndex
CREATE UNIQUE INDEX "GroundTruth_study_id_finding_key" ON "GroundTruth"("study_id", "finding");

-- AddForeignKey
ALTER TABLE "AIOutput" ADD CONSTRAINT "AIOutput_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundTruth" ADD CONSTRAINT "GroundTruth_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;
