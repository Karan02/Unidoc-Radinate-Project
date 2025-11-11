/*
  Warnings:

  - Added the required column `study_id` to the `ComparisonResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ComparisonResult" DROP CONSTRAINT "ComparisonResult_study_uid_fkey";

-- AlterTable
ALTER TABLE "ComparisonResult" ADD COLUMN     "study_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ComparisonResult" ADD CONSTRAINT "ComparisonResult_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
